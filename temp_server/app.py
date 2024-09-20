from flask import request, session, jsonify,  Blueprint, send_file,Flask
from concurrent.futures import ThreadPoolExecutor
import os
from flask_cors import cross_origin
from flask_cors import CORS
from utils import *
from deep_translator import GoogleTranslator
from werkzeug.utils import secure_filename
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceBgeEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
import secrets
import string

from datetime import timedelta


# Initialize the Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = 'EDUNEXUS'  # Make sure to set a secret key for session management
app.permanent_session_lifetime = timedelta(days=5)  
device_type = 'cpu'

model_name = "BAAI/bge-small-en-v1.5"

encode_kwargs = {'normalize_embeddings': True}
EMBEDDINGS = HuggingFaceBgeEmbeddings(
    model_name=model_name,
    model_kwargs={'device': device_type },
    encode_kwargs=encode_kwargs
)

@app.route('/create_modules', methods=['POST'])
def create_modules():
    # user_id = session.get('user_id')
    # print(session.get('user_id'))
    # if user_id is None:
    #     return jsonify({"message": "User not logged in", "response": False}), 401

    # Check if a file is provided in the request
    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400

    # Create uploads directory if it doesn't exist
    if not os.path.exists("uploads"):
        os.makedirs("uploads")

    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join("uploads", filename))

    title = request.form['title']
    description = request.form['description']
    # modules=request.form['modules']
    session['user_profile'] = description
    session['title'] = title

    # print("Modules:--",modules)
    # Load the uploaded PDF and process it
    DOCS_PATH = os.path.join("uploads", filename)
    loader = PyPDFLoader(DOCS_PATH)
    docs = loader.load()
    docs_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    split_docs = docs_splitter.split_documents(docs)
    
    # Create a FAISS vector store for the documents
    TEXTBOOK_VECTORSTORE = FAISS.from_documents(split_docs, EMBEDDINGS)
    TEXTBOOK_VECTORSTORE.save_local('user_docs')
    print('CREATED VECTORSTORE')

    # Load the FAISS vector store
    VECTORDB_TEXTBOOK = FAISS.load_local('user_docs', EMBEDDINGS, allow_dangerous_deserialization=True)

    # Generate submodules from the textbook
    submodules = generate_module_from_textbook(title, VECTORDB_TEXTBOOK)
    values_list = list(submodules.values())
    session['submodules'] = submodules
    print("Session Data: ", session)
    print("SubModules are as follows:- ", submodules)

    return jsonify({"message": "Query successful", "submodules": values_list, "response": True}), 200

@app.route('/query2/doc-upload/<string:topicname>/<string:level>/<string:source_lang>', methods=['POST'])
def doc_query_topic(topicname, level, source_lang):
    user_id = session.get('user_id')
    print(session.get('user_id'))
    if user_id is None:
        return jsonify({"message": "User not logged in", "response": False}), 401

    if 'file' not in request.files:
        return 'No file part', 400
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400

    if not os.path.exists("uploads"):
        os.makedirs("uploads")

    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join("uploads", filename))

    DOCS_PATH = os.path.join("uploads", filename)
    loader = PyPDFLoader(DOCS_PATH)
    docs = loader.load()
    docs_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    split_docs = docs_splitter.split_documents(docs)

    TEXTBOOK_VECTORSTORE = FAISS.from_documents(split_docs, EMBEDDINGS)
    TEXTBOOK_VECTORSTORE.save_local('user_docs')
    print('CREATED VECTORSTORE')

    VECTORDB_TEXTBOOK = FAISS.load_local('user_docs', EMBEDDINGS, allow_dangerous_deserialization=True)

      # Generate module summary content
    module_summary_content = generate_module_from_textbook(topicname, level, VECTORDB_TEXTBOOK)
    print("Content", module_summary_content)

    return jsonify({"message": "Query successful", "topic": topicname, "content": module_summary_content, "response": True}), 200


@app.route('/query2/doc_generate_content', methods=['GET'])
def personalized_module_content():
    # user_id = session.get("user_id", None)
    # if user_id is None:
    #     return jsonify({"message": "User not logged in", "response": False}), 401

    
    characters = string.ascii_letters + string.digits  # Alphanumeric characters
    key = ''.join(secrets.choice(characters) for _ in range(7))
    description = session.get('user_profile')
    title = session.get('title')
    print("user_profile",title)

    VECTORDB_TEXTBOOK = FAISS.load_local('user_docs', EMBEDDINGS, allow_dangerous_deserialization=True)

    with ThreadPoolExecutor() as executor:
        submodules = session['submodules']
        keys_list = list(submodules.keys())
        
        # Concurrently process images, videos, and content generation
        future_images_list = executor.submit(module_image_from_web, submodules)
        future_video_list = executor.submit(module_videos_from_web, submodules)

        submodules_split_one = {key: submodules[key] for key in keys_list[:3]}
        submodules_split_two = {key: submodules[key] for key in keys_list[3:]}
        
        future_content_one = executor.submit(generate_content_from_textbook, title, submodules_split_one, description, VECTORDB_TEXTBOOK, 'first')
        future_content_two = executor.submit(generate_content_from_textbook, title, submodules_split_two, description, VECTORDB_TEXTBOOK, 'second')

    # Retrieve the results when both functions are done
    content_one = future_content_one.result()
    content_two = future_content_two.result()

    content = content_one + content_two
    images_list = future_images_list.result()
    video_list = future_video_list.result()

    print("Content:-------------------",content)
    print("images:-----------",images_list)
    print("videos:----------------",video_list)

    return jsonify({"message": "Query successful", "images": images_list, "videos": video_list, "content": content, "response": True}), 200




if __name__ == '__main__':
    app.run(debug=True)
