from flask import request, session, jsonify,  Blueprint, send_file
from server import db, bcrypt
from server.database_model import User, Topic, Module, CompletedModule
from concurrent.futures import ThreadPoolExecutor
import os
from flask_cors import cross_origin
from server.users.utils import *


@users.route('/register',methods=['POST'])
@cross_origin(supports_credentials=True)
def register():
    # take user input
    fname = request.form['firstName']  # Access the 'fname' variable from the JSON data
    lname = request.form['lastName']
    email = request.form['email']
    password = request.form['password']
    country = request.form['country']
    state = request.form['state']
    city = request.form['city']
    gender = request.form['gender']
    age = request.form['age']
    college_name = request.form['college']
    course_name = request.form['course']
    interests = request.form['interest']
    student_id_file = request.files['collegeId']
    # check if user has already registered by same email
    print("id of the colege------",request.form)
    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"message": "User already exists", "response":False}), 201
    
    # hash password, create new user save to database
    hash_pass = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(fname=fname, lname=lname, email=email, password=hash_pass, country=country, state=state, city=city, gender=gender, age=age, college_name=college_name, course_name=course_name, interests=interests, student_id=student_id_file.read())
    db.session.add(new_user)
    db.session.commit()

    response = jsonify({"message": "User created successfully", "id":new_user.user_id, "email":new_user.email, "response":True}), 200
    return response


# login route  --> add username to session and make it unique in user model
@users.route('/login', methods=['POST'])
@cross_origin(supports_credentials=True)
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    # check user is registered or not
    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"message": "Unregistered email id", "response":False}), 200
    
    # check password
    if not bcrypt.check_password_hash(user.password, password.encode('utf-8')):
        return jsonify({"message": "Incorrect password", "response":False}), 200
    
    # start user session
    session["user_id"] = user.user_id
    print("user id in session:-",session.get('user_id'))
    profile = f"This a profile of user, Name: {user.fname} {user.lname}, Email: {user.email}, Country: {user.country}, Age: {user.age}, Ongoing Course Name: {user.course_name}, User Interest: {user.interests}"
    print("Profile",profile)
    # create assistant for user
    client = OpenAI(api_key = openai_api_key1)
    assistant = client.beta.assistants.create(
        name="MINDCRAFT",
        instructions=f"You are ISSAC, a helpful assistant for the website Mindcraft. Use the functions provided to you to answer user's question about the Mindcraft platform. {profile}",
        model="gpt-3.5-turbo-1106",
        tools=tools
    )
    thread = client.beta.threads.create()

    session['thread_id'] = thread.id
    session['assistant_id'] = assistant.id


    return jsonify({"message": "User logged in successfully", "email":user.email, "response":True}), 200


@users.route('/user_profile', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True)
def user_profile():
    # check if user is logged in
    user_id = session.get("user_id", None)
    if user_id is None:
        return jsonify({"message": "User not logged in", "response":False}), 401
    
    # check if user exists
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"message": "User not found", "response":False}), 404
    
    if request.method == 'POST':
        data = request.json
        print("data is printed---------",data)
        user.fname = data.get("fname")
        user.lname = data.get("lname")
        user.email = data.get("email")
        user.country = data.get("country")
        user.state = data.get("state")
        user.gender = data.get("gender")
        user.city = data.get("city")
        user.age = data.get("age")
        user.interests = data.get("interests")
        user.college_name = data.get("college_name")
        user.course_name = data.get("course_name")
        db.session.commit()
    
    user_info = {}
    user_info['fname'] = user.fname
    user_info['lname'] = user.lname
    user_info['email'] = user.email
    user_info['country'] = user.country
    user_info['state'] = user.state
    user_info['city'] = user.city
    user_info['age'] = user.age
    user_info['gender'] = user.gender
    user_info['interests'] = user.interests
    user_info['date_joined'] = user.date_joined
    user_info['college_name'] = user.college_name
    user_info['course_name'] = user.course_name

    return jsonify({"message": "User found", "user_info":user_info, "response":True}), 200


@users.route('/user_dashboard', methods=['GET'])
@cross_origin(supports_credentials=True)
def getuser():
    # check if user is logged in
    user_id = session.get("user_id", None)
    if user_id is None:
        return jsonify({"message": "User not logged in", "response":False}), 401
    
    # check if user exists
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"message": "User not found", "response":False}), 404
    
    completed_modules = []
    ongoing_modules = []

    user_ongoing_modules = user.user_onmodule_association
    user_completed_modules = user.user_module_association
    user_course = user.course_name
    user_interest = user.interests
    all_ongoing_modules_names = ""
  
    for comp_module in user_ongoing_modules:
        temp = {}
        module = Module.query.get(comp_module.module_id)
        topic = Topic.query.get(module.topic_id)
        temp['module_name'] = module.module_name
        temp['topic_name'] = topic.topic_name
        temp['module_summary'] = module.summary
        temp['level'] = module.level
        all_ongoing_modules_names += f"{module.module_name},"
        c_module = CompletedModule.query.filter(CompletedModule.module_id==comp_module.module_id,CompletedModule.user_id==user_id).first()
        if c_module:
            if c_module.theory_quiz_score is not None and c_module.application_quiz_score is not None and c_module.assignment_score is not None:
                temp['quiz_score'] = [c_module.theory_quiz_score, c_module.application_quiz_score, c_module.assignment_score]
                completed_modules.append(temp)
            else:
                temp['date_started'] = comp_module.date_started.strftime("%d/%m/%Y %H:%M")
                quiz_list = [c_module.theory_quiz_score, c_module.application_quiz_score, c_module.assignment_score]
                temp['quiz_score'] = [x for x in quiz_list if x is not None]
                ongoing_modules.append(temp)
        else:
            temp['date_started'] = comp_module.date_started.strftime("%d/%m/%Y %H:%M")
            temp['quiz_score'] = []
            ongoing_modules.append(temp)
            

        
    query_message = ""
    user_queries = user.user_query_association
    # if user_queries is None:
    #     query_message = "You have not searched for any topic yet. Please search for a topic to get recommendations."
    #     recommended_topics = popular_topics()
    #     recommended_topic_names = [Topic.query.get(topic_id).topic_name for topic_id in recommended_topics]

    #     return jsonify({"message": "User found", "query_message":query_message,"recommended_topics":recommended_topic_names, "user_ongoing_modules":ongoing_modules, "user_completed_module":completed_modules, "response":True}), 200
    # else:
    # latest_query = Query.query.filter_by(user_id=1).order_by(desc(Query.date_search)).first() 
    # base_module = Module.query.filter_by(topic_id=latest_query.topic_id).first()
    # recommended_modules = recommend_module(base_module.module_id)
    recommended_modules = generate_recommendations(user_course, user_interest, all_ongoing_modules_names)
    print(recommended_modules)
    print("Ongoing :-----------",ongoing_modules)
    # recommended_module_summary = {}
    # for module_id in recommended_modules:
    #     module = Module.query.get(module_id)
    #     recommended_module_summary[module.module_name] = module.summary
        
    return jsonify({"message": "User found", "query_message":query_message,"recommended_topics":recommended_modules, "user_ongoing_modules":ongoing_modules, "user_completed_module":completed_modules, "response":True}), 200

# logout route
@users.route('/logout', methods=['GET'])
@cross_origin(supports_credentials=True)
def logout():
    session.pop("user_id", None)
    return jsonify({"message": "User logged out successfully", "response":True}), 200



# delete user route --> user dependent queries and completed topics will also be deleted no need to delete them separately
@users.route('/delete', methods=['DELETE'])
@cross_origin(supports_credentials=True)
def delete():
    # check if user is logged in
    user_id = session.get("user_id", None)
    if user_id is None:
        return jsonify({"message": "User not logged in", "response":False}), 401
    
    # check if user exists
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"message": "User not found", "response":False}), 404
    
    # select all queries and completed topics by user and delete them
    # user_saved_queries = user.queries
    # user_saved_topics = user.completed_topics

    db.session.delete(user)
    # db.session.delete(user_saved_queries)
    # db.session.delete(user_saved_topics)
    db.session.commit()

    # return response
    return jsonify({"message": "User deleted successfully", "response":True}), 200


@users.route('/query2/trending/<string:domain>', methods=['GET'])
@cross_origin(supports_credentials=True)
def trending_data(domain):
    text=trending_module_summary_from_web(domain)
    print(text)
    return jsonify({"message": "Query successful", "domain": domain,  "content": text, "response":True}), 200


@users.route('/query2/trending/<string:domain>/<string:module_name>/<string:summary>/<string:source_lang>', methods=['GET'])
@cross_origin(supports_credentials=True)
def trending_query(domain, module_name, summary, source_lang):
    # check if user is logged in
    user_id = session.get("user_id", None)
    if user_id is None:
        return jsonify({"message": "User not logged in", "response":False}), 401
    
    # check if user exists
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"message": "User not found", "response":False}), 404
    
    topic = Topic.query.filter_by(topic_name=domain.lower()).first()
    if topic is None:
        topic = Topic(topic_name=domain.lower())
        db.session.add(topic)
        db.session.commit()

    module = Module.query.filter_by(module_name=module_name, topic_id=topic.topic_id, level='trending', websearch=True).first()
    if module is not None:
        trans_submodule_content = translate_submodule_content(module.submodule_content, source_lang)
        print(f"Translated submodule content: {trans_submodule_content}")
        return jsonify({"message": "Query successful", "images": module.image_urls, "content": trans_submodule_content, "response": True}), 200
    
    # add module to database
    new_module = Module(module_name=module_name, topic_id=topic.topic_id, level='trending', websearch=True, summary=summary)
    db.session.add(new_module)
    db.session.commit()

    images = module_image_from_web(module.module_name)
    with ThreadPoolExecutor() as executor:
        submodules = generate_submodules_from_web(module.module_name,module.summary)
        print(submodules)
        keys_list = list(submodules.keys())
        submodules_split_one = {key: submodules[key] for key in keys_list[:3]}
        submodules_split_two = {key: submodules[key] for key in keys_list[3:]}
        future_content_one = executor.submit(generate_content_from_web, submodules_split_one, 'first')
        future_content_two = executor.submit(generate_content_from_web, submodules_split_two, 'second')

        content_one = future_content_one.result()
        content_two = future_content_two.result()

        content = content_one + content_two 

        module.submodule_content = content
        module.image_urls = images
        db.session.commit()

        # translate submodule content to the source language
        trans_submodule_content = translate_submodule_content(content, source_lang)
        print(f"Translated submodule content: {trans_submodule_content}")

        return jsonify({"message": "Query successful", "images": module.image_urls, "content": trans_submodule_content, "response": True}), 200