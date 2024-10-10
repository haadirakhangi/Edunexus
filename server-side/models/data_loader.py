import faiss
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.schema import Document
from models.data_utils import PdfUtils
import numpy as np

class PDFVectorStore:
    @staticmethod
    def create_faiss_vectorstore_for_text(pdf_path, embeddings, chunk_size, chunk_overlap):
        loader = PyPDFLoader(pdf_path)
        documents = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size, chunk_overlap=chunk_overlap, length_function=len
        )
        docs = text_splitter.split_documents(documents)
        processed_docs = [Document(metadata=doc.metadata, page_content=doc.page_content.replace('\t', ' ')) for doc in docs]
        vectorstore = FAISS.from_documents(processed_docs, embeddings)
        return vectorstore
    
    @staticmethod
    def create_faiss_vectorstore_for_image(pdf_path, image_directory_path, clip_model, clip_processor):
        PdfUtils.extract_images(pdf_path=pdf_path, output_directory_path=image_directory_path)
        image_embeddings = np.vstack([PdfUtils.embed_image_with_clip(image, clip_model=clip_model, clip_processor=clip_processor) for image in image_directory_path])
        vectorstore = faiss.IndexFlatIP(512)
        vectorstore.add(image_embeddings)
        return vectorstore
