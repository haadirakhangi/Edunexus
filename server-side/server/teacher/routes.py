import os
import string
import secrets
from io import BytesIO
from server import db, bcrypt
from datetime import datetime
from gtts import gTTS
from sqlalchemy import desc
from deep_translator import GoogleTranslator
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from flask import request, session, jsonify, send_file, Blueprint
from models.database_model import User, Topic, Module, CompletedModule, Query, OngoingModule, Transaction
from concurrent.futures import ThreadPoolExecutor
from flask_cors import cross_origin
from werkzeug.utils import secure_filename
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader, ScrapflyLoader
from langchain_community.document_loaders.merge import MergedDataLoader
import torch
from transformers import AutoImageProcessor, AutoModel, AutoTokenizer
from api.gemini_client import GeminiProvider
from api.serper_client import SerperProvider
from core.submodule_generator import SubModuleGenerator
from core.content_generator import ContentGenerator
from core.module_generator import ModuleGenerator
from core.quiz_generator import QuizGenerator
from core.pdf_generator import PdfGenerator
from core.evaluator import Evaluator
from core.recommendation_generator import RecommendationGenerator
from core.rag import MultiModalRAG
from server.utils import ServerUtils, AssistantUtils
import json
import typing_extensions as typing
import google.generativeai as genai


users = Blueprint(name='users', import_name=__name__)

DEVICE_TYPE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
IMAGE_EMBEDDING_MODEL_NAME = "openai/clip-vit-base-patch16"
CLIP_MODEL = AutoModel.from_pretrained(IMAGE_EMBEDDING_MODEL_NAME).to(DEVICE_TYPE)
CLIP_PROCESSOR = AutoImageProcessor.from_pretrained(IMAGE_EMBEDDING_MODEL_NAME)
CLIP_TOKENIZER = AutoTokenizer.from_pretrained(IMAGE_EMBEDDING_MODEL_NAME)
EMBEDDINGS = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
GEMINI_CLIENT = GeminiProvider()
TOOLS = [AssistantUtils.get_page_context]
MODULE_GENERATOR = ModuleGenerator()
SUB_MODULE_GENERATOR = SubModuleGenerator()
CONTENT_GENERATOR = ContentGenerator()
PDF_GENERATOR = PdfGenerator()
QUIZ_GENERATOR = QuizGenerator()
RECOMMENDATION_GENERATOR = RecommendationGenerator()
EVALUATOR = Evaluator()
USER_DOCS_PATH = os.path.join('server', 'user_docs')
AVAILABLE_TOOLS = {
    'get_context_from_page': AssistantUtils.get_page_context
}

model = genai.GenerativeModel("gemini-1.5-flash")
class Lecture(typing.TypedDict):
    Lesson_Name: str
    description: str

@users.route('/query2/multimodal-rag-submodules', methods=['POST'])
async def multimodal_rag_submodules():
    # user_id = session.get('user_id')

    # if user_id is None:
    #     return jsonify({"message": "User not logged in", "response":False}), 401
    
    # user = User.query.get(user_id)
    # if user is None:
    #     return jsonify({"message": "User not found", "response":False}), 404

    if 'files[]' not in request.files:
        files = []
    else:
        files = request.files.getlist('files[]')
    title = request.form['title']
    includeImages = request.form['includeImages']
    if includeImages=="true":
        includeImages=True
    else:
        includeImages=False
    if title=="":
        raise Exception("Title must be provided")
    description = request.form['description']
    
    current_dir = os.path.dirname(__file__)
    uploads_path = os.path.join(current_dir, 'uploaded-documents', title)
    if not os.path.exists(uploads_path):
        os.makedirs(uploads_path)
    
    for file in files:
        if file:
            filename = secure_filename(file.filename)
            file.save(os.path.join(uploads_path, filename))
    links = request.form.get('links')
    links_list = []
    if links:
        links_list = json.loads(links)
        print(f"\nLinks provided: {links_list}\n")

    if len(files)>0 and len(links_list)>0:
        session['input_type']='pdf_and_link'
        print("\nInput: File + Links...\n",links_list)
        multimodal_rag = MultiModalRAG(
            course_name=title,
            documents_directory_path=uploads_path,  
            embeddings=EMBEDDINGS,
            clip_model=CLIP_MODEL,
            clip_processor=CLIP_PROCESSOR,
            clip_tokenizer=CLIP_TOKENIZER,
            input_type="pdf_and_link",
            links=links_list,
            includeImages=includeImages
        )
    elif len(files)>0:
        session['input_type']='pdf'
        print("\nInput: File only...\n")
        multimodal_rag = MultiModalRAG(
            course_name=title,
            documents_directory_path=uploads_path,  
            embeddings=EMBEDDINGS,
            clip_model=CLIP_MODEL,
            clip_processor=CLIP_PROCESSOR,
            clip_tokenizer=CLIP_TOKENIZER,
            input_type="pdf",
            includeImages=includeImages
        )
    elif len(links_list)>0:
        session['input_type']='link'
        print("\nInput: Links only..\n")
        multimodal_rag = MultiModalRAG(
            course_name=title,
            documents_directory_path=uploads_path,  
            embeddings=EMBEDDINGS,
            clip_model=CLIP_MODEL,
            clip_processor=CLIP_PROCESSOR,
            clip_tokenizer=CLIP_TOKENIZER,
            input_type="link",
            links=links_list,
            includeImages=includeImages
        )
    else:
        print("\nInput: None\n")
        submodules = SUB_MODULE_GENERATOR.generate_submodules(title)
        session['title'] = title
        session['user_profile'] = description
        session['submodules'] = submodules
        session['is_multimodal_rag'] = False
        print("\nGenerated Submodules:\n", submodules)
        return jsonify({"message": "Query successful", "submodules": submodules, "response": True}), 200

    text_vectorstore_path, image_vectorstore_path = await multimodal_rag.create_text_and_image_vectorstores()
    
    session['text_vectorstore_path'] = text_vectorstore_path
    session['image_vectorstore_path'] = image_vectorstore_path
    
    VECTORDB_TEXTBOOK = FAISS.load_local(text_vectorstore_path, EMBEDDINGS, allow_dangerous_deserialization=True)
    
    submodules = SUB_MODULE_GENERATOR.generate_submodules_from_textbook(title, VECTORDB_TEXTBOOK)
        
    session['title'] = title
    session['user_profile'] = description
    session['submodules'] = submodules
    session['document_directory_path'] = uploads_path 
    session['is_multimodal_rag'] = True
    session['includeImages']=includeImages
    print("\nGenerated Submodules:\n", submodules)
    return jsonify({"message": "Query successful", "submodules": submodules, "response": True}), 200


@users.route('/update-submodules', methods=['POST'])
def update_submodules():
    updated_submodules = request.get_json()
    session['submodules'] = updated_submodules
    return jsonify({'message': 'Submodules updated successfully'}), 200
    
@users.route('/query2/multimodal-rag-content', methods=['GET'])
async def multimodal_rag_content():
    # user_id = session.get("user_id", None)
    # if user_id is None:
    #     return jsonify({"message": "User not logged in", "response": False}), 401
    
    # user = User.query.get(user_id)
    # if user is None:
    #     return jsonify({"message": "User not found", "response": False}), 404
    
    is_multimodal_rag = session.get("is_multimodal_rag")
    if is_multimodal_rag:
        document_paths = session.get("document_directory_path") 
        title = session.get("title")
        user_profile = session.get("user_profile")
        submodules = session.get("submodules")
        text_vectorstore_path = session.get("text_vectorstore_path")
        image_vectorstore_path = session.get("image_vectorstore_path")
        input_type = session.get('input_type')
        includeImages=session.get('includeImages')
        multimodal_rag = MultiModalRAG(
            documents_directory_path=document_paths,
            course_name=title,
            embeddings=EMBEDDINGS,
            clip_model=CLIP_MODEL,
            clip_processor=CLIP_PROCESSOR,
            clip_tokenizer=CLIP_TOKENIZER,
            chunk_size=1000,
            chunk_overlap=200,
            image_similarity_threshold=0.1,
            input_type=input_type,
            text_vectorstore_path=text_vectorstore_path,
            image_vectorstore_path=image_vectorstore_path,
            includeImages=includeImages
        )

        content_list, relevant_images_list = await multimodal_rag.execute(CONTENT_GENERATOR, title, submodules=submodules, profile=user_profile, top_k_docs=7)
        final_content = ServerUtils.json_list_to_markdown(content_list)
        return jsonify({"message": "Query successful", "relevant_images": relevant_images_list, "content": final_content, "response": True}), 200
    else:
        submodules = session.get("submodules")
        title = session.get("title")
        keys_list = list(submodules.keys())
        submodules_split_one = {key: submodules[key] for key in keys_list[:2]}
        submodules_split_two = {key: submodules[key] for key in keys_list[2:4]}
        submodules_split_three = {key: submodules[key] for key in keys_list[4:]}
        with ThreadPoolExecutor() as executor:
            future_images_list = executor.submit(SerperProvider.module_image_from_web, submodules)
            future_content_one = executor.submit(CONTENT_GENERATOR.generate_content, submodules_split_one, title,'first')
            future_content_two = executor.submit(CONTENT_GENERATOR.generate_content, submodules_split_two, title,'second')
            future_content_three = executor.submit(CONTENT_GENERATOR.generate_content, submodules_split_three, title,'third')
        content_one = future_content_one.result()
        content_two = future_content_two.result()
        content_three = future_content_three.result()
        relevant_images_list = future_images_list.result()
        content_list = content_one + content_two + content_three
        final_content = ServerUtils.json_list_to_markdown(content_list)
        return jsonify({"message": "Query successful", "relevant_images": relevant_images_list, "content": final_content, "response": True}), 200
    
    
    
from flask import Flask, request, jsonify
from core.generate_lectures import create_rag_pipeline, search_documents, generate_prompt, generate_lectures_from_prompt

@users.route('/generate_lectures', methods=['POST'])
def generate_lectures():
    # Parse input data from the request
    data = request.json
    num = data.get('num')
    course_name = data.get('course_name')
    pdf_path = data.get('pdf_path')

    # Check for missing input
    if not num or not course_name or not pdf_path:
        return jsonify({"error": "Missing required input: 'num', 'course_name', or 'pdf_path'"}), 400

    # Create the RAG pipeline using the provided PDF path
    try:
        vectorstore, retriever = create_rag_pipeline(pdf_path)
    except Exception as e:
        return jsonify({"error": f"Failed to create RAG pipeline: {str(e)}"}), 500

    # Retrieve relevant documents based on the course name
    try:
        relevant_docs = search_documents(course_name, retriever)
    except Exception as e:
        return jsonify({"error": f"Failed to search documents: {str(e)}"}), 500

    # Extract the text from the relevant documents for the prompt
    relevant_text = "\n".join([doc.page_content for doc in relevant_docs])

    # Generate the prompt
    prompt = generate_prompt(course_name, relevant_text, num)

    # Generate the lectures using the prompt
    try:
        result = generate_lectures_from_prompt(prompt)
        # Return the generated lectures as a JSON response
        return jsonify(result), 200

    except Exception as e:
        # Handle errors during AI model inference or request processing
        return jsonify({"error": f"Failed to generate lectures: {str(e)}"}), 500
