from models.data_loader import PDFVectorStore
from models.data_utils import PdfUtils
from api.serper_client import SerperProvider
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
            pdf_path, 
            course_name,
            embeddings, 
            clip_model, 
            clip_processor,
            clip_tokenizer,
            chunk_size=1000,
            chunk_overlap=200,
            image_similarity_threshold=0.5,
        ):
        self.clip_model = clip_model
        self.clip_processor = clip_processor
        self.clip_tokenizer = clip_tokenizer
        self.image_similarity_threshold = image_similarity_threshold

        self.current_dir = os.path.dirname(__file__)
        self.image_directory_path = os.path.join(self.current_dir, course_name)

        self.text_vectorstore = PDFVectorStore.create_faiss_vectorstore_for_text(pdf_path=pdf_path, embeddings=embeddings, chunk_size=chunk_size, chunk_overlap=chunk_overlap)

        self.image_vectorstore = PDFVectorStore.create_faiss_vectorstore_for_image(pdf_path=pdf_path, course_name=course_name, clip_model=clip_model, clip_processor=clip_processor, clip_tokenizer=clip_tokenizer)

    async def search_image(self, query_text, k):
        images_list = os.listdir(self.image_directory_path)
        query_image_embeddings = PdfUtils.embed_text_with_clip(text=query_text, clip_model=self.clip_model, clip_tokenizer=self.clip_tokenizer)
        dist, indx = self.image_vectorstore.search(query_image_embeddings, k)
        distances = dist[0]
        indexes = indx[0]
        top_k_images = [images_list[idx] for idx in indexes if distances[idx]>=self.image_similarity_threshold]
        return top_k_images

    async def search_text(self, query_text, k):
        top_k_docs = self.text_vectorstore.similarity_search(query_text, k=k)
        return top_k_docs
    
    async def run(self, content_generator, module_name, submodule_name, profile, top_k_images=1, top_k_docs =1,):
        images_list = os.listdir(self.image_directory_path)
        if len(images_list)>0:
            with ThreadPoolExecutor() as executor:
                future_docs = executor.submit(self.search_text, submodule_name, top_k_docs)
                future_images = executor.submit(self.search_image, submodule_name, top_k_images)
            docs = future_docs.result()
            images = future_images.result()
            if len(images)>=2:
                rel_docs = [doc.page_content for doc in docs]
                context = '\n'.join(rel_docs)
                image_explanation = content_generator.generate_explanation_from_images(images[:2], submodule_name)
                output = content_generator.generate_content_from_textbook_and_images(module_name, )

        else: 
            future_docs = executor.submit(self.search_text, submodule_name, top_k_docs)
            future_images = executor.submit(SerperProvider.submodule_image_from_web(submodule_name))

