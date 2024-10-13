import faiss
from langchain_community.document_loaders import DirectoryLoader, UnstructuredFileLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.schema import Document
from models.data_utils import PdfUtils
from server.utils import ServerUtils
from deep_translator import GoogleTranslator
import numpy as np
import os

class PDFVectorStore:
    @staticmethod
    def create_faiss_vectorstore_for_text(documents_directory, embeddings, chunk_size, chunk_overlap):
        loader = DirectoryLoader(documents_directory, loader_cls=UnstructuredFileLoader)
        documents = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size, chunk_overlap=chunk_overlap, length_function=len
        )
        docs = text_splitter.split_documents(documents)
        texts = [doc.page_content.replace('\t', ' ') for doc in docs]
        source_language = ServerUtils.detect_source_language(texts[0])
        if source_language != 'en':
            trans_texts = GoogleTranslator(source=source_language, target='en').translate_batch(texts)
        else:
            trans_texts = texts
        vectorstore = FAISS.from_texts(trans_texts, embeddings)
        return vectorstore
    
    @staticmethod
    def create_faiss_vectorstore_for_image(pdf_paths, image_directory_path, clip_model, clip_processor):
        PdfUtils.extract_images(pdf_path=pdf_paths, output_directory_path=image_directory_path)
        images_in_directory = os.listdir(image_directory_path)   
        image_paths = [os.path.join(image_directory_path, image_name) for image_name in images_in_directory]
        image_embeddings = np.vstack([PdfUtils.embed_image_with_clip(image, clip_model=clip_model, clip_processor=clip_processor) for image in image_paths])
        vectorstore = faiss.IndexFlatIP(512)
        vectorstore.add(image_embeddings)
        return vectorstore
