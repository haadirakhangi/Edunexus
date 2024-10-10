from models.data_loader import PDFVectorStore
from models.data_utils import PdfUtils
from api.serper_client import SerperProvider
from langchain_community.vectorstores.faiss import FAISS
import faiss
import os
import asyncio
from pykka import ThreadingActor
from concurrent.futures import ThreadPoolExecutor

class ResultHandler(ThreadingActor):
    async def receive(self, message):
        print("Received result:", message)

class MultiModalRAG:
    def __init__(
            self, 
            pdf_path=None, 
            course_name=None,
            embeddings=None, 
            clip_model=None, 
            clip_processor=None,
            clip_tokenizer=None,
            chunk_size=1000,
            chunk_overlap=200,
            image_similarity_threshold=0.5,
            text_vectorstore_path=None,
            image_vectorstore_path=None,
        ):
        if pdf_path is None:
            raise Exception("PDF path must be provided")
        self.pdf_path = pdf_path
        self.embeddings = embeddings
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.clip_model = clip_model
        self.clip_processor = clip_processor
        self.clip_tokenizer = clip_tokenizer
        self.image_similarity_threshold = image_similarity_threshold

        self.current_dir = os.path.dirname(__file__)
        self.image_directory_path = os.path.join(self.current_dir, course_name)
        self.text_vectorstore_path = os.path.join(self.current_dir, 'faiss-vectorstore', 'text-faiss-index')
        self.image_vectorstore_path = os.path.join(self.current_dir, 'faiss-vectorstore', 'image-faiss-index')
        if text_vectorstore_path is not None:
            self.text_vectorstore = FAISS.load_local(text_vectorstore_path, embeddings=embeddings, allow_dangerous_deserialization=True)
        else:
            self.text_vectorstore = None
        
        if image_vectorstore_path is not None:
            self.image_vectorstore = faiss.read_index(image_vectorstore_path)
        else:
            self.image_vectorstore = None

    def create_text_and_image_vectorstores(self):
        self.text_vectorstore = PDFVectorStore.create_faiss_vectorstore_for_text(pdf_path=self.pdf_path, embeddings=self.embeddings, chunk_size=self.chunk_size, chunk_overlap=self.chunk_overlap)
        self.image_vectorstore = PDFVectorStore.create_faiss_vectorstore_for_image(pdf_path=self.pdf_path, image_directory_path=self.image_directory_path, clip_model=self.clip_model, clip_processor=self.clip_processor)
        self.text_vectorstore.save_local(self.text_vectorstore_path)
        faiss.write_index(self.image_vectorstore, self.image_vectorstore_path)
        return self.text_vectorstore_path, self.image_vectorstore_path

    def search_image(self, query_text):
        images_in_directory = os.listdir(self.image_directory_path)
        image_paths = [os.path.join(self.image_directory_path, image_name) for image_name in images_in_directory]
        query_image_embeddings = PdfUtils.embed_text_with_clip(text=query_text, clip_model=self.clip_model, clip_tokenizer=self.clip_tokenizer)
        dist, indx = self.image_vectorstore.search(query_image_embeddings, k=len(image_paths))
        distances = dist[0]
        indexes = indx[0]
        sorted_images = [image_paths[idx] for idx in indexes]
        top_k_images = [sorted_images[i] for i in range(len(indexes)) if distances[i]>= self.image_similarity_threshold]
        return top_k_images

    def search_text(self, query_text, k):
        top_k_docs = self.text_vectorstore.similarity_search(query_text, k=k)
        return top_k_docs
    
    async def run(self, content_generator, module_name, submodule_split, profile, top_k_docs):
        images_list = os.listdir(self.image_directory_path)
        submodule_content = []
        submodule_images=[]
        for key, val in submodule_split.items():
            if len(images_list) >= 5:
                with ThreadPoolExecutor() as executor:
                    future_docs = executor.submit(self.search_text, val, top_k_docs)
                    future_images = executor.submit(self.search_image, val)
                relevant_docs = future_docs.result()
                relevant_images = future_images.result()
                if len(relevant_images) >= 2:
                    rel_docs = [doc.page_content for doc in relevant_docs]
                    context = '\n'.join(rel_docs)
                    image_explanation = await content_generator.generate_explanation_from_images(relevant_images[:2], val)
                    output = await content_generator.generate_content_from_textbook_and_images(module_name, val, profile, context, image_explanation)
                # else:
                #     relevant_docs = self.search_text(val, top_k_docs)
                #     rel_docs = [doc.page_content for doc in relevant_docs]
                #     context = '\n'.join(rel_docs)
                #     result_handler = ResultHandler.start()
                #     try:
                #         submodule_images, submodule_output = await asyncio.gather(
                #             SerperProvider.submodule_image_from_web(val),
                #             content_generator.generate_single_content_from_textbook(module_name, val, profile, context)
                #         )
                #         output = submodule_output
                #         result_handler.tell(submodule_images)
                #         result_handler.tell(submodule_output)
                #     finally:
                #         result_handler.stop()
            else:
                relevant_docs = self.search_text(val, top_k_docs)
                rel_docs = [doc.page_content for doc in relevant_docs]
                context = '\n'.join(rel_docs)
                result_handler = ResultHandler.start()
                try:
                    relevant_images, output = await asyncio.gather(
                        SerperProvider.submodule_image_from_web(val),
                        content_generator.generate_single_content_from_textbook(module_name, val, profile, context)
                    )
                    result_handler.tell(relevant_images)
                    result_handler.tell(output)
                finally:
                    result_handler.stop()
            submodule_content.append(output)
            submodule_images.append(relevant_images)
        return submodule_content, submodule_images
    
    async def execute(self, content_generator, module_name, submodules, profile, top_k_docs=5):
        keys_list = list(submodules.keys())
        submodules_split_one = {key: submodules[key] for key in keys_list[:2]}
        submodules_split_two = {key: submodules[key] for key in keys_list[2:4]}
        submodules_split_three = {key: submodules[key] for key in keys_list[4:]}
        result_handler = ResultHandler.start()
        try:
            results = await asyncio.gather(
                self.run(content_generator=content_generator, module_name=module_name, submodule_split=submodules_split_one, profile=profile, top_k_docs=top_k_docs),
                self.run(content_generator=content_generator, module_name=module_name, submodule_split=submodules_split_two, profile=profile, top_k_docs=top_k_docs),
                self.run(content_generator=content_generator, module_name=module_name, submodule_split=submodules_split_three, profile=profile, top_k_docs=top_k_docs),
            )
            content_one, images_one = results[0]
            content_two, images_two = results[1]
            content_three, images_three = results[2]
            content = content_one + content_two + content_three
            images = images_one + images_two + images_three

            for result in results:
                result_handler.tell(result)
        finally:
            result_handler.stop()
        return content, images