# from langchain_community.vectorstores import FAISS
# from langchain_community.embeddings import HuggingFaceBgeEmbeddings
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain_community.document_loaders import PyPDFLoader
# from lingua import LanguageDetectorBuilder

class AssistantDataLoader:
    def __init__(self) -> None:
        device_type = 'cpu'
        embedding_model_name = "BAAI/bge-small-en-v1.5"
        encode_kwargs = {'normalize_embeddings': True} # set True to compute cosine similarity

        

        # FEATURE_DOCS_PATH = 'assistant_data/Description.pdf'
        # loader = PyPDFLoader(FEATURE_DOCS_PATH)
        # docs = loader.load()
        # docs_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        # split_docs = docs_splitter.split_documents(docs)
        # NYAYMITRA_FEATURES_VECTORSTORE = FAISS.from_documents(split_docs, EMBEDDINGS)
        # NYAYMITRA_FEATURES_VECTORSTORE.save_local('assistant_data/faiss_index_assistant')
        # print('CREATED VECTORSTORE')
        # VECTORDB = FAISS.load_local('assistant_data/faiss_index_assistant', EMBEDDINGS, allow_dangerous_deserialization=True)