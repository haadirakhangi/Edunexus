'''#create FAISS for text and imgs
parallel; asyncio;

ip: pdf
op: vectordb

call in 421
'''
import faiss
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.schema import Document

class PDFVectorStore:
    def __init__(self, embedding_model="text-embedding-3-small"):
        """
        Initializes the PDFVectorStore with the specified embedding model.

        Args:
            embedding_model: The name of the OpenAI embedding model to use.
        """
        self.embedding_model = embedding_model

    def create_faiss_vectorstore(self, path, chunk_size=1000, chunk_overlap=200):
        """
        Encodes a PDF book into a FAISS vector store using OpenAI embeddings.

        Args:
            path: The path to the PDF file.
            chunk_size: The desired size of each text chunk.
            chunk_overlap: The amount of overlap between consecutive chunks.

        Returns:
            A FAISS vector store containing the encoded book content.
        """
        # Load PDF documents
        loader = PyPDFLoader(path)
        documents = loader.load()

        # Split documents into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size, chunk_overlap=chunk_overlap, length_function=len
        )
        docs = text_splitter.split_documents(documents)

        # Replacing \t with space
        processed_docs = [Document(metadata=doc.metadata, page_content=doc.page_content.replace('\t', ' ')) for doc in docs]

        # Create embeddings and vector store
        embeddings = OpenAIEmbeddings(model=self.embedding_model)
        vectorstore = FAISS.from_documents(processed_docs, embeddings)

        return vectorstore, processed_docs

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


