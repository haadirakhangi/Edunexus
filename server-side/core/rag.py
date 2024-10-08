from models.data_loader import PDFVectorStore
from models.data_utils import PdfUtils
import os

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
            top_k_images=1
        ):
        self.clip_model = clip_model
        self.clip_processor = clip_processor
        self.clip_tokenizer = clip_tokenizer
        self.image_similarity_threshold = image_similarity_threshold

        self.current_dir = os.path.dirname(__file__)
        self.image_directory_path = os.path.join(self.current_dir, course_name)

        self.text_vectorstore = PDFVectorStore.create_faiss_vectorstore_for_text(pdf_path=pdf_path, embeddings=embeddings, chunk_size=chunk_size, chunk_overlap=chunk_overlap)

        self.image_vectorstore = PDFVectorStore.create_faiss_vectorstore_for_image(pdf_path=pdf_path, course_name=course_name, clip_model=clip_model, clip_processor=clip_processor, clip_tokenizer=clip_tokenizer)

    async def search_image(self, text, k):
        images_list = os.listdir(self.image_directory_path)
        query_image_embeddings = PdfUtils.embed_text_with_clip(text=text, clip_model=self.clip_model, clip_tokenizer=self.clip_tokenizer)
        dist, indx = self.image_vectorstore.search(query_image_embeddings, k)
        distances = dist[0]
        indexes = indx[0]
        if distances[0]<self.image_similarity_threshold:
            return []
        
        top_images = [images_list[idx] for idx in indexes]
        return top_images
