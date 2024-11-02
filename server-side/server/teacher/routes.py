import os
import string
import random
import secrets
from io import BytesIO
from server import db, bcrypt
from datetime import datetime
from gtts import gTTS
from sqlalchemy import desc
from flask import request, session, jsonify, send_file, Blueprint
from models.teacher_schema import Teacher, Lesson, Course, LabManual
from concurrent.futures import ThreadPoolExecutor
from flask_cors import cross_origin
from werkzeug.utils import secure_filename
from langchain_community.vectorstores import FAISS
from api.serper_client import SerperProvider
from core.rag import MultiModalRAG, SimpleRAG
from server.constants import *
from server.utils import ServerUtils
import json
from core.lab_manual_gen import LabManualGenerator


teachers = Blueprint(name='teachers', import_name=__name__)

@teachers.route('/register', methods=['POST'])
def register():
    first_name = request.form['first_name']
    last_name = request.form['last_name']
    email = request.form['email']
    password = request.form['password']
    college_name = request.form['college_name']
    department = request.form['department']
    experience = request.form['experience']
    phone_number = request.form['phone_number']
    qualification = request.form['qualification']
    subjects = request.form['subjects']
    country = request.form['country']
    state = request.form['state']
    city = request.form['city']
    gender = request.form['gender']
    age = request.form['age']

    if not first_name or not last_name or not email or not password:
        return jsonify({"message": "First name, last name, email, and password are required."}), 400
        
    if Teacher.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists", "response":False}), 201

    new_teacher = Teacher(
    first_name=first_name,
    last_name=last_name,
    email=email,
    college_name=college_name,
    department=department,
    experience=experience,
    phone_number=phone_number,
    qualification=qualification,
    subjects=subjects,
    country=country,
    state=state,
    city=city,     
    gender=gender,    
    age=age           
    )

    new_teacher.set_password(password)
    db.session.add(new_teacher)
    db.session.commit()
    return jsonify({"message": "Registration successful!","response":True}), 200


@teachers.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"message": "Email and password are required."}), 400

    teacher = Teacher.query.filter_by(email=email).first()

    if teacher is None or not teacher.check_password(password):
        return jsonify({"message": "Invalid email or password."}), 401

    session['teacher_id'] = teacher.id
    return jsonify({"message": "Login successful!", "teacher_id": teacher.id,"response":True}), 200


@teachers.route('/add-course', methods=['POST'])
def add_course():
    teacher_id = session.get('teacher_id')
    if teacher_id is None:
        return jsonify({"message": "Teacher not logged in.", "response": False}), 401

    data = request.get_json()
    course_name = data.get('course_name')
    num_of_lectures = data.get('num_of_lectures')
    lessons_data = data.get('lessons_data', {})

    if not course_name or not num_of_lectures:
        return jsonify({"message": "Course name and number of lectures are required."}), 400

    course_code = ServerUtils.generate_course_code()
    new_course = Course(
        course_name=course_name,
        num_of_lectures=num_of_lectures,
        teacher_id=teacher_id,
        lessons_data=lessons_data,
        course_code=course_code
    )

    db.session.add(new_course)
    db.session.commit()
    return jsonify({"message": "Course added successfully!", "course_id": new_course.id, "course_code": new_course.course_code}), 200


@teachers.route('/add-lab-manual', methods=['POST'])
def add_lab_manual():
    teacher_id = session.get('teacher_id')
    if teacher_id is None:
        return jsonify({"message": "Teacher not logged in.", "response": False}), 401

    data = request.get_json()
    course_id = data.get('course_id')
    markdown_content = data.get('markdown_content')

    if not course_id or not markdown_content:
        return jsonify({"message": "Course ID and markdown content are required."}), 400

    new_lab_manual = LabManual(
        course_id=course_id,
        teacher_id=teacher_id,
        markdown_content=markdown_content
    )

    db.session.add(new_lab_manual)
    db.session.commit()
    return jsonify({"message": "Lab manual added successfully!", "lab_manual_id": new_lab_manual.id}), 201


@teachers.route('/get-lab-manuals', methods=['GET'])
def get_lab_manuals():
    course_id = request.args.get('course_id')
    
    if not course_id:
        return jsonify({"message": "Course ID is required."}), 400

    lab_manuals = LabManual.query.filter_by(course_id=course_id).all()
    if not lab_manuals:
        return jsonify({"message": "No lab manuals found for this course."}), 404
    manuals = [{"id": lm.id, "markdown_content": lm.markdown_content} for lm in lab_manuals]
    return jsonify({"lab_manuals": manuals}), 200


@teachers.route('/add-lesson', methods=['POST'])
def add_lesson():
    teacher_id = session.get('teacher_id')
    if teacher_id is None:
        return jsonify({"message": "Teacher not logged in.", "response": False}), 401

    data = request.get_json()
    title = data.get('title')
    markdown_content = data.get('markdown_content', '')
    relevant_images = data.get('relevant_images', None)
    uploaded_images = data.get('uploaded_images', None)
    course_id = data.get('course_id')

    if not title or not course_id:
        return jsonify({"message": "Title and course ID are required."}), 400

    new_lesson = Lesson(
        title=title,
        markdown_content=markdown_content,
        relevant_images=relevant_images,
        uploaded_images=uploaded_images,
        teacher_id=teacher_id,
        course_id=course_id
    )

    db.session.add(new_lesson)
    db.session.commit()
    return jsonify({"message": "Lesson added successfully!", "lesson_id": new_lesson.id}), 201


@teachers.route('/get-courses', methods=['GET'])
def get_courses():
    teacher_id = session.get('teacher_id')
    if teacher_id is None:
        return jsonify({"message": "Teacher not logged in.", "response": False}), 401

    courses = Course.query.filter_by(teacher_id=teacher_id).all()
    if not courses:
        return jsonify({"message": "No courses found for this teacher."}), 404

    course_list = [{"id": course.id, "course_name": course.course_name, "num_of_lectures": course.num_of_lectures, "course_code": course.course_code} for course in courses]
    
    return jsonify({"courses": course_list}), 200


@teachers.route('/multimodal-rag-submodules', methods=['POST'])
async def multimodal_rag_submodules():
    teacher_id = session.get('teacher_id')
    if teacher_id is None:
        return jsonify({"message": "Teacher not logged in", "response": False}), 401
    
    if 'files[]' not in request.files:
        files = []
    else:
        files = request.files.getlist('files[]')
    lesson_name = request.form['lesson_name']
    course_name = request.form['course_name']
    include_images = request.form['includeImages']
    if include_images=="true":
        include_images=True
    else:
        include_images=False
    if lesson_name=="":
        raise Exception("lesson_name must be provided")
    description = request.form['description']
    
    current_dir = os.path.dirname(__file__)
    uploads_path = os.path.join(current_dir, 'uploaded-documents', lesson_name)
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
    search_web = request.form.get("search_web", "false")
    if search_web=="true":
        search_web=True
    else:
        search_web=False
    session['search_web'] = search_web

    if len(files)>0 and len(links_list)>0:
        session['input_type']='pdf_and_link'
        print("\nInput: File + Links...\nLinks: ",links_list)
        multimodal_rag = MultiModalRAG(
            course_name=course_name,
            lesson_name=lesson_name,
            documents_directory_path=uploads_path,  
            embeddings=EMBEDDINGS,
            clip_model=CLIP_MODEL,
            clip_processor=CLIP_PROCESSOR,
            clip_tokenizer=CLIP_TOKENIZER,
            input_type="pdf_and_link",
            links=links_list,
            include_images=include_images
        )
    elif len(files)>0 and search_web:
        session['input_type']='pdf_and_web'
        print("\nInput: File + Web Search...\n")
        multimodal_rag = MultiModalRAG(
            course_name=course_name,
            lesson_name=lesson_name,
            documents_directory_path=uploads_path,  
            embeddings=EMBEDDINGS,
            clip_model=CLIP_MODEL,
            clip_processor=CLIP_PROCESSOR,
            clip_tokenizer=CLIP_TOKENIZER,
            input_type="pdf_and_web",
            links=links_list,
            include_images=include_images
        )
    elif len(files)>0:
        session['input_type']='pdf'
        print("\nInput: File only...\n")
        multimodal_rag = MultiModalRAG(
            course_name=course_name,
            lesson_name=lesson_name,
            documents_directory_path=uploads_path,  
            embeddings=EMBEDDINGS,
            clip_model=CLIP_MODEL,
            clip_processor=CLIP_PROCESSOR,
            clip_tokenizer=CLIP_TOKENIZER,
            input_type="pdf",
            include_images=include_images
        )
    elif len(links_list)>0:
        session['input_type']='link'
        print("\nInput: Links only...\nLinks: ", links_list)
        multimodal_rag = MultiModalRAG(
            course_name=course_name,
            lesson_name=lesson_name,
            documents_directory_path=uploads_path,  
            embeddings=EMBEDDINGS,
            clip_model=CLIP_MODEL,
            clip_processor=CLIP_PROCESSOR,
            clip_tokenizer=CLIP_TOKENIZER,
            input_type="link",
            links=links_list,
            include_images=include_images
        )
    elif search_web:
        session['input_type']='web'
        print("\nInput: Web Search only...\n")
        submodules = SUB_MODULE_GENERATOR.generate_submodules_from_web(lesson_name, course_name)
        session['lesson_name'] = lesson_name
        session['course_name'] = course_name
        session['user_profile'] = submodules
        session['submodules'] = submodules
        session['is_multimodal_rag']=False
        print("\nGenerated Submodules:\n", submodules)
        return jsonify({"message": "Query successful", "submodules": submodules, "response": True}), 200
    else:
        print("\nInput: None\n")
        submodules = SUB_MODULE_GENERATOR.generate_submodules(lesson_name)
        session['lesson_name'] = lesson_name
        session['course_name'] = course_name
        session['user_profile'] = description
        session['submodules'] = submodules
        session['is_multimodal_rag'] = False
        print("\nGenerated Submodules:\n", submodules)
        return jsonify({"message": "Query successful", "submodules": submodules, "response": True}), 200

    text_vectorstore_path, image_vectorstore_path = await multimodal_rag.create_text_and_image_vectorstores()
    
    session['text_vectorstore_path'] = text_vectorstore_path
    session['image_vectorstore_path'] = image_vectorstore_path
    
    VECTORDB_TEXTBOOK = FAISS.load_local(text_vectorstore_path, EMBEDDINGS, allow_dangerous_deserialization=True)
    
    if search_web:
        submodules = await SUB_MODULE_GENERATOR.generate_submodules_from_documents_and_web(module_name=lesson_name, course_name=course_name, vectordb=VECTORDB_TEXTBOOK)
    else:
        submodules = SUB_MODULE_GENERATOR.generate_submodules_from_textbook(lesson_name, VECTORDB_TEXTBOOK)
        
    session['lesson_name'] = lesson_name
    session['course_name'] = course_name
    session['user_profile'] = description
    session['submodules'] = submodules
    session['document_directory_path'] = uploads_path 
    session['is_multimodal_rag'] = True
    session['include_images']=include_images
    print("\nGenerated Submodules:\n", submodules)
    return jsonify({"message": "Query successful", "submodules": submodules, "response": True}), 200


@teachers.route('/update-submodules', methods=['POST'])
def update_submodules():
    updated_submodules = request.get_json()
    session['submodules'] = updated_submodules
    return jsonify({'message': 'Submodules updated successfully'}), 200
    
@teachers.route('/multimodal-rag-content', methods=['GET'])
async def multimodal_rag_content():
    teacher_id = session.get('teacher_id')
    if teacher_id is None:
        return jsonify({"message": "Teacher not logged in", "response": False}), 401
    
    is_multimodal_rag = session.get("is_multimodal_rag")
    search_web = session.get("search_web")
    course_name = session.get("course_name")
    lesson_name = session.get("lesson_name")
    if is_multimodal_rag:
        document_paths = session.get("document_directory_path") 
        lesson_name = session.get("lesson_name")
        user_profile = session.get("user_profile")
        submodules = session.get("submodules")
        text_vectorstore_path = session.get("text_vectorstore_path")
        image_vectorstore_path = session.get("image_vectorstore_path")
        input_type = session.get('input_type')
        include_images=session.get('include_images')
        multimodal_rag = MultiModalRAG(
            course_name=course_name,
            documents_directory_path=document_paths,
            lesson_name=lesson_name,
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
            include_images=include_images
        )
        content_list, relevant_images_list = await multimodal_rag.execute(CONTENT_GENERATOR, TAVILY_CLIENT, lesson_name, submodules=submodules, profile=user_profile, top_k_docs=7, search_web=search_web)
        final_content = ServerUtils.json_list_to_markdown(content_list)
        return jsonify({"message": "Query successful", "relevant_images": relevant_images_list, "content": final_content, "response": True}), 200
    elif search_web:
        submodules = session.get("submodules")
        keys_list = list(submodules.keys())
        submodules_split_one = {key: submodules[key] for key in keys_list[:2]}
        submodules_split_two = {key: submodules[key] for key in keys_list[2:4]}
        submodules_split_three = {key: submodules[key] for key in keys_list[4:]}
        with ThreadPoolExecutor() as executor:
            future_images_list = executor.submit(SerperProvider.module_image_from_web, submodules)
            future_content_one = executor.submit(CONTENT_GENERATOR.generate_content_from_web, submodules_split_one, lesson_name,course_name,'first')
            future_content_two = executor.submit(CONTENT_GENERATOR.generate_content_from_web, submodules_split_two, lesson_name, course_name,'second')
            future_content_three = executor.submit(CONTENT_GENERATOR.generate_content_from_web, submodules_split_three, lesson_name, course_name,'third')
        content_one = future_content_one.result()
        content_two = future_content_two.result()
        content_three = future_content_three.result()
        relevant_images_list = future_images_list.result()
        content_list = content_one + content_two + content_three
        final_content = ServerUtils.json_list_to_markdown(content_list)
        return jsonify({"message": "Query successful", "relevant_images": relevant_images_list, "content": final_content, "response": True}), 200
    else:
        submodules = session.get("submodules")
        keys_list = list(submodules.keys())
        submodules_split_one = {key: submodules[key] for key in keys_list[:2]}
        submodules_split_two = {key: submodules[key] for key in keys_list[2:4]}
        submodules_split_three = {key: submodules[key] for key in keys_list[4:]}
        with ThreadPoolExecutor() as executor:
            future_images_list = executor.submit(SerperProvider.module_image_from_web, submodules)
            future_content_one = executor.submit(CONTENT_GENERATOR.generate_content, submodules_split_one, lesson_name, course_name,'first')
            future_content_two = executor.submit(CONTENT_GENERATOR.generate_content, submodules_split_two, lesson_name, course_name,'second')
            future_content_three = executor.submit(CONTENT_GENERATOR.generate_content, submodules_split_three, lesson_name, course_name,'third')
        content_one = future_content_one.result()
        content_two = future_content_two.result()
        content_three = future_content_three.result()
        relevant_images_list = future_images_list.result()
        content_list = content_one + content_two + content_three
        final_content = ServerUtils.json_list_to_markdown(content_list)
        return jsonify({"message": "Query successful", "relevant_images": relevant_images_list, "content": final_content, "response": True}), 200

@teachers.route('/generate-lesson', methods=['POST'])
async def generate_lesson():
    teacher_id = session.get('teacher_id')
    if teacher_id is None:
        return jsonify({"message": "Teacher not logged in", "response": False}), 401

    num_lectures = request.form.get('num_lectures')
    course_name = request.form.get('course_name')
    file = request.files.get('syllabus')
    current_dir = os.path.dirname(__file__)
    uploads_path = os.path.join(current_dir, 'uploaded-documents', 'syllabus')
    if not os.path.exists(uploads_path):
        os.makedirs(uploads_path)
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(uploads_path, filename))

    simple_rag = SimpleRAG(
        course_name=course_name,
        syllabus_directory_path=uploads_path,
        embeddings=EMBEDDINGS,
    )
    await simple_rag.create_text_vectorstore()
    relevant_text = await simple_rag.search_similar_text(query=course_name, k=10)
    output = LESSON_PLANNER.generate_lesson_plan(course_name=course_name, context=relevant_text, num_lectures=num_lectures)
    return jsonify({"lessons": output})

@teachers.route('/generate-lab-manual', methods=['POST'])
def generate_lab_manual():
    # teacher_id = session.get('teacher_id')
    # if teacher_id is None:
    #     return jsonify({"message": "Teacher not logged in", "response": False}), 401
    # teacher = Teacher.query.get(teacher_id)
    # if not teacher:
    #     return jsonify({"message": "Teacher not found", "response": False}), 404
    # teacher_name = f"{teacher.first_name} {teacher.last_name}"
    teacher_name = "Aruna Gawade"
    data = request.json
    print(data) 
    experiment_num = data.get('exp_num')
    exp_aim = data.get('exp_aim')
    course_name = data.get('course_name')
    include_videos = data.get('include_videos')
    if include_videos == "false":
        print("i was here!!")
        include_videos = False
    else:
        include_videos = True  
    
    components = data.get('lab_components', [])
    generator = LabManualGenerator()
    result = generator.generate_lab_manual(exp_aim,teacher_name, course_name, components, include_videos)

    return jsonify({"message": "Query successful","MarkdownContent": result, "response": True}), 200


@teachers.route('/convert-docx', methods=['POST'])
def convert_docx():
    # teacher_id = session.get('teacher_id')
    # if teacher_id is None:
    #     return jsonify({"message": "Teacher not logged in", "response": False}), 401
    try:
        data = request.json
        markdown = data.get('markdown')
        course_name = data.get('course_name')
        exp_num = data.get('exp_num')
        
        doc=LabManualGenerator.convert_markdown_to_docx(markdown,course_name,exp_num)
        return send_file(
            doc,
            as_attachment=True,
            download_name=f"{course_name}_{exp_num}.docx",
            mimetype='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        )
    except Exception as e:  
        print("An error occured while creating document: ",e)

@teachers.route('/logout', methods=['GET'])
@cross_origin(supports_credentials=True)
def logout():
    session.clear()
    return jsonify({"message": "User logged out successfully", "response":True}), 200