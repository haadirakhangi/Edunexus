# lecture_scheduler.py
import google.generativeai as genai
import typing_extensions as typing
import torch
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS

# Define the Lecture TypedDict
class Lecture(typing.TypedDict):
    Lesson_Name: str
    description: str

# Initialize the Generative AI model
model = genai.GenerativeModel("gemini-1.5-flash")

def generate_prompt(course_names, relevant_docs, num):
    """Generate the prompt for lecture scheduling."""
    prompt = """You are a lecture scheduler. Your job is to divide the submodules into lectures, each lecture would be of an hour each. You need to plan on what should be covered in each lecture.
    Name of the course: %(course_name)s
    The relevant docs might contain useless stuff, you need to filter out only the submodules that are relevant to %(course_name)s.
    The relevant docs are given below:
    %(relevant_docs)s

    List %(num)s number of lecture names with a brief description of each lecture. The description would consist of a flow on how the teacher should teach that lecture.
    """
    return prompt % locals()

def generate_lectures_from_prompt(prompt):
    """Generate lectures using the AI model based on the given prompt."""
    result = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json", response_schema=list[Lecture]
        ),
    )
    return result.text


# pdf_processing.py


def create_rag_pipeline(pdf_path, model_name="BAAI/bge-small-en-v1.5"):
    """Creates a RAG pipeline by loading the PDF, generating embeddings, and setting up a retriever."""
    print("Loading PDF")
    # 1. Load and split the PDF
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=2000,
        chunk_overlap=400,
        length_function=len
    )
    splits = text_splitter.split_documents(documents)

    # 2. Initialize Jina embeddings
    print("Creating embeddings")
    embeddings = HuggingFaceEmbeddings(
        model_name=model_name,
        model_kwargs={'device': 'cuda' if torch.cuda.is_available() else 'cpu'},
        encode_kwargs={'normalize_embeddings': True}
    )

    # 3. Create vector store
    print("Creating vector store")
    vectorstore = FAISS.from_documents(splits, embeddings)
    
    # 4. Create retriever
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 8}
    )
    
    return vectorstore, retriever

def search_documents(query, retriever):
    """Search documents using the retriever."""
    print("Searching for:", query)
    return retriever.get_relevant_documents(query)


