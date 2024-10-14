import faiss
from langchain_community.document_loaders import DirectoryLoader, UnstructuredFileLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from models.data_utils import DocumentUtils
from server.utils import ServerUtils
from deep_translator import GoogleTranslator
import numpy as np
import os

class DocumentLoader:
    @staticmethod
    def create_faiss_vectorstore_for_text(documents_directory, embeddings, chunk_size, chunk_overlap):
        loader = DirectoryLoader(documents_directory, loader_cls=PyPDFLoader)
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
    def create_faiss_vectorstore_for_image(documents_directory, image_directory_path, clip_model, clip_processor):
        DocumentUtils.extract_images_from_directory(documents_directory=documents_directory, output_directory_path=image_directory_path)
        images_in_directory = []
        for root, dirs, files in os.walk(image_directory_path):
            for file in files:
                if file.endswith(('png', 'jpg', 'jpeg')):
                    images_in_directory.append(os.path.join(root, file))
        
        image_embeddings = np.vstack([DocumentUtils.embed_image_with_clip(image, clip_model=clip_model, clip_processor=clip_processor) for image in images_in_directory])
        vectorstore = faiss.IndexFlatIP(512)
        vectorstore.add(image_embeddings)
        return vectorstore
