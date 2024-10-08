import faiss
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.schema import Document
from models.data_utils import PdfUtils
import numpy as np
import os

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
    def create_faiss_vectorstore_for_image(pdf_path, image_directory_path, clip_model, clip_processor, clip_tokenizer):
        PdfUtils.extract_images(pdf_path=pdf_path, output_directory_path=image_directory_path)
        image_embeddings = np.vstack([PdfUtils.embed_image_with_clip(image, clip_model=clip_model, clip_processor=clip_processor) for image in image_directory_path])
        vectorstore = faiss.IndexFlatIP(512)
        vectorstore.add(image_embeddings)
        return vectorstore

# Example usage
# pdf_vector_store = PDFVectorStore()
# vectorstore, processed_docs = pdf_vector_store.create_faiss_vectorstore("path/to/pdf")






# def create_faiss_vectorstore(path, chunk_size=1000, chunk_overlap=200):
#     """
#     Encodes a PDF book into a vector store using OpenAI embeddings.

#     Args:
#         path: The path to the PDF file.
#         chunk_size: The desired size of each text chunk.
#         chunk_overlap: The amount of overlap between consecutive chunks.

#     Returns:
#         A FAISS vector store containing the encoded book content.
#     """

#     # Load PDF documents
#     loader = PyPDFLoader(path)
#     documents = loader.load()

#     # Split documents into chunks
#     text_splitter = RecursiveCharacterTextSplitter(
#         chunk_size=chunk_size, chunk_overlap=chunk_overlap, length_function=len
#     )
#     docs = text_splitter.split_documents(documents)

#     # Replacing \t with space
#     processed_docs = [Document(metadata= doc.metadata, page_content=doc.page_content.replace('\t', ' ')) for doc in docs]
#     # Create embeddings and vector store
#     embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
#     vectorstore = FAISS.from_documents(processed_docs, embeddings)

#     return vectorstore, processed_docs


