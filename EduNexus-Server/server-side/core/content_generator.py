import PIL
import time

import PIL.Image
from api.gemini_client import GeminiProvider
from api.tavily_client import TavilyProvider

class ContentGenerator:
    def __init__(self):
        self.gemini_client = GeminiProvider()

    def generate_content(self, sub_modules : dict, module_name, course_name, api_key_to_use):
        prompt_content_gen = """I'm seeking your expertise on the sub-module : {sub_module_name} which comes under the module: {module_name}. This module is a part of the course: {course_name}. As a knowledgeable educational assistant, I trust in your ability to provide a comprehensive explanation of this sub-module. Think about the sub-module step by step and design the best way to explain the sub-module to a student. Your response should cover essential aspects such as definition, in-depth examples, and any details crucial for understanding the topic. Please generate quality content on the sub-module ensuring the response is sufficiently detailed covering all the relevant topics related to the sub-module. In your response, organize the information into subsections for clarity and elaborate on each subsection with suitable examples if and only if it is necessary. Include specific hypothetical scenario-based examples(only if it is necessary) or important sub-sections related to the subject to enhance practical understanding. If applicable, incorporate real-world examples, applications or use-cases to illustrate the relevance of the topic in various contexts. Additionally, incorporate anything that helps the student to better understand the topic. Ensure all the relevant aspects and topics related to the sub-module is covered in your response. Conclude your response by suggesting relevant URLs for further reading to empower users with additional resources on the subject. Please format your output as valid JSON, with the following keys: title_for_the_content (suitable title for the sub-module), content(an introduction of the sub-module), subsections (a list of dictionaries with keys - title and content), and urls (a list). Be a good educational assistant and craft the best way to explain the sub-module.Strictly, ensure that output shouldn't have any syntax errors and the given format is followed"""
        all_content = []
        flag = 1 if api_key_to_use== 'first' else (2 if api_key_to_use=='second' else 3 )
        print(f'THREAD {flag} RUNNING...')
        for key,val in sub_modules.items():
            content_output = self.gemini_client.generate_json_response(prompt_content_gen.format(sub_module_name = val, module_name = module_name, course_name=course_name))
            print("Thread 1: Module Generated: ",key,"!")   
            content_output['subject_name'] = val
            print(content_output)
            all_content.append(content_output)
        return all_content
    
    def generate_content_with_profile(self, sub_modules : dict, module_name, course_name, lesson_type, profile, api_key_to_use):
        theoretical_prompt = """I'm seeking your expertise on the sub-module : {sub_module_name} which comes under the module: {module_name}. This module is a part of the course: {course_name}. As a knowledgeable educational assistant, I trust in your ability to provide a comprehensive explanation of this sub-module. Think about the sub-module step by step and design the best way to explain the sub-module to a student.  You will also be provided with my course requirements and needs inside <INSTRUCTIONS>. Structure the course according to my needs.\n<INSTRUCTIONS>\nMY COURSE REQUIREMENTS : {profile}\n</INSTRUCTIONS>\n\nYour response should cover essential aspects such as definition, in-depth examples, and any details crucial for understanding the topic. Please generate quality content on the sub-module ensuring the response is sufficiently detailed covering all the relevant topics related to the sub-module. In your response, organize the information into subsections for clarity and elaborate on each subsection with suitable examples if and only if it is necessary. Include specific hypothetical scenario-based examples(only if it is necessary) or important sub-sections related to the subject to enhance practical understanding. If applicable, incorporate real-world examples, applications or use-cases to illustrate the relevance of the topic in various contexts. Additionally, incorporate anything that helps the student to better understand the topic. Ensure all the relevant aspects and topics related to the sub-module is covered in your response. Conclude your response by suggesting relevant URLs for further reading to empower users with additional resources on the subject. Please format your output as valid JSON, with the following keys: title_for_the_content (suitable title for the sub-module), content(an introduction of the sub-module), subsections (a list of dictionaries with keys - title and content), and urls (a list). Be a good educational assistant and craft the best way to explain the sub-module.Strictly, ensure that output shouldn't have any syntax errors and the given format is followed"""

        math_prompt = """I'm seeking your expertise on the mathematical sub-module: {sub_module_name} which comes under the module: {module_name}. This module is a part of the course: {course_name}. As a knowledgeable mathematical assistant, I trust in your ability to provide a clear, structured, and comprehensive explanation of this sub-module. Think about the mathematical concepts step by step and develop the best method to explain this sub-module to a student. You will also be provided with my course requirements and needs inside <INSTRUCTIONS>. Structure the course according to my needs.\n<INSTRUCTIONS>\nMY COURSE REQUIREMENTS : {profile}\n</INSTRUCTIONS>\n\nYour response should address key aspects such as definitions, theorems, proofs, and practical problem-solving techniques. Break down complex topics into simpler parts, using appropriate notations and step-by-step calculations. Structure the content into well-defined sections that focus on conceptual understanding, followed by real-world applications if applicable. Where necessary, provide equations or solved problems to teach me. Include hypothetical or practical examples, illustrating the application of mathematical principles through problem-solving exercises. Offer detailed explanations of the solutions, emphasizing core methodologies and any common pitfalls. Ensure the response is sufficiently detailed, covering all essential mathematical concepts and related sub-topics. Conclude by suggesting relevant URLs for further exploration, enabling users to expand their knowledge. Format the output as valid JSON, with the following keys: title_for_the_content (suitable title for the sub-module), content (an introduction of the sub-module), subsections (a list of dictionaries with keys - title and content), and urls (a list). Ensure that the output adheres strictly to the given format and does not contain any syntax errors."""

        if lesson_type == 'mathematical':
            prompt = math_prompt
        else:
            prompt = theoretical_prompt    
        all_content = []
        flag = 1 if api_key_to_use== 'first' else (2 if api_key_to_use=='second' else 3 )
        print(f'THREAD {flag} RUNNING...')
        for key,val in sub_modules.items():
            content_output = self.gemini_client.generate_json_response(prompt.format(sub_module_name = val, module_name = module_name, course_name=course_name, profile=profile))
            print("Thread 1: Module Generated: ",key,"!")   
            content_output['subject_name'] = val
            print(content_output)
            all_content.append(content_output)
        return all_content
    
    def generate_content_from_web(self, sub_modules: dict, module_name, course_name, api_key_to_use):
        content_generation_prompt = """I'm seeking your expertise on the subject of {sub_module_name}, which falls under the module: {module_name}. This module is a part of the course: {course_name}. As a knowledgeable educational assistant, you must provide a response in strictly formatted JSON.\n\nYour response should cover key aspects such as definitions, in-depth examples, and essential details to ensure a comprehensive understanding. This content must be structured specifically for educational purposes.\n\n**IMPORTANT**:\n1. Your response must **strictly adhere to JSON format** as shown below.\n2. Ensure that the output includes all required fields as JSON keys: `title_for_the_content`, `content`, `subsections`, and `urls`.\n3. Each `subsection` should be structured with `title` and `content` fields only.\n\nCONTENT GENERATION :\nUsing the subject information provided, generate detailed and informative content for the sub-module. Cover essential aspects such as definitions, real-world examples, and relevant applications. If helpful, use hypothetical scenarios to enhance practical understanding.\n\nSUBJECT INFORMATION:\n```{search_result}```\n--------------------------------\n<INSTRUCTIONS>\n- Organize the information into subsections for clarity and elaborate on each subsection with suitable examples if and only if it is necessary. \n- Include specific hypothetical scenario-based examples (only if it is necessary) or important sub-sections related to the subject to enhance practical understanding. \n- If applicable, incorporate real-world examples, applications or use-cases to illustrate the relevance of the topic in various contexts. Additionally, incorporate anything that helps the student to better understand the topic. \n- Ensure all the relevant aspects and topics related to the sub-module is covered in your response. \n- Conclude your response by suggesting relevant URLs for further reading to empower users with additional resources on the subject.\n- Format your output as valid JSON, with the following keys: title_for_the_content (suitable title for the sub-module), content(an introduction of the sub-module), subsections (a list of dictionaries with keys - title and content), and urls (a list). Follow the JSON format precisely, and ensure it is valid.\n</INSTRUCTIONS>\nYour JSON response should strictly follow the format given above. Failure to follow the exact JSON format will result in invalid output."""
        flag = 1 if api_key_to_use== 'first' else (2 if api_key_to_use=='second' else 3 )
        print(f'THREAD {flag} RUNNING...')
        tavily_client = TavilyProvider(flag)        
        all_content = []
        for key, val in sub_modules.items():    
            topic = course_name + "-" + module_name + " : " + val
            print('Searching content for module:', topic)
            search_result = tavily_client.search_context(topic)
            output = self.gemini_client.generate_json_response(content_generation_prompt.format(sub_module_name = val, search_result = search_result, module_name=module_name, course_name=course_name))
            print('Module Generated:', key, '!')
            output['subject_name'] = val
            print(output)
            all_content.append(output)
            time.sleep(3)

        return all_content
    
    def generate_content_from_web_with_profile(self, sub_modules: dict, module_name, course_name, lesson_type, profile, api_key_to_use):
        theoretical_prompt = """I'm seeking your expertise on the subject of {sub_module_name}, which falls under the module: {module_name}. This module is a part of the course: {course_name}. As a knowledgeable educational assistant, you must provide a response in strictly formatted JSON.\n\nYour response should cover key aspects such as definitions, in-depth examples, and essential details to ensure a comprehensive understanding. This content must be structured specifically for educational purposes.\n\n**IMPORTANT**:\n1. Your response must **strictly adhere to JSON format** as shown below.\n2. Ensure that the output includes all required fields as JSON keys: `title_for_the_content`, `content`, `subsections`, and `urls`.\n3. Each `subsection` should be structured with `title` and `content` fields only.\n\nCONTENT GENERATION :\nUsing the subject information provided, generate detailed and informative content for the sub-module. Cover essential aspects such as definitions, real-world examples, and relevant applications. If helpful, use hypothetical scenarios to enhance practical understanding.\n\nSUBJECT INFORMATION:\n```{search_result}```\n--------------------------------\n<INSTRUCTIONS>\n- Organize the information into subsections for clarity and elaborate on each subsection with suitable examples if and only if it is necessary. \n- Include specific hypothetical scenario-based examples (only if it is necessary) or important sub-sections related to the subject to enhance practical understanding. \n- If applicable, incorporate real-world examples, applications or use-cases to illustrate the relevance of the topic in various contexts. Additionally, incorporate anything that helps the student to better understand the topic. \n- Ensure all the relevant aspects and topics related to the sub-module is covered in your response. \n- Conclude your response by suggesting relevant URLs for further reading to empower users with additional resources on the subject.\n- Format your output as valid JSON, with the following keys: title_for_the_content (suitable title for the sub-module), content(an introduction of the sub-module), subsections (a list of dictionaries with keys - title and content), and urls (a list). Follow the JSON format precisely, and ensure it is valid.\n- Follow the course requirements so I can better understand the topic.\n**Course Requirements**:{profile}\n</INSTRUCTIONS>\nYour JSON response should strictly follow the format given above. Failure to follow the exact JSON format will result in invalid output."""

        math_prompt = """I'm seeking your expertise on the mathematical sub-module: {sub_module_name}, which falls under the module: {module_name}. This module is part of the course: {course_name}. As a knowledgeable educational assistant, you must provide a response in strictly formatted JSON.  

Your response should address key mathematical concepts such as definitions, theorems, proofs, step-by-step problem-solving techniques, and relevant applications. The content must be structured to facilitate learning, ensuring clarity and depth.  

**IMPORTANT**:  
1. Your response must **strictly adhere to JSON format** as shown below.  
2. Ensure that the output includes all required fields as JSON keys: `title_for_the_content`, `content`, `subsections`, and `urls`.  
3. Each `subsection` should be structured with `title` and `content` fields only.  

CONTENT GENERATION:  
Using the provided mathematical subject information, generate detailed and structured content. Include precise definitions, breakdowns of complex topics, real-world applications, and illustrative problem-solving examples where necessary. Provide proofs and step-by-step walkthroughs for mathematical operations to enhance understanding.  

SUBJECT INFORMATION:  
```{search_result}```  
--------------------------------  
<INSTRUCTIONS>  
- Structure the information into clearly defined subsections. Elaborate on each subsection with suitable examples, theorems, or hypothetical problems if necessary.  
- Use scenario-based examples or important sub-sections to explain key mathematical principles practically.  
- Where relevant, include graphs, equations, or diagrams to illustrate abstract concepts.  
- Highlight real-world applications, demonstrating how the mathematical concept is used in engineering, science, or technology.  
- Ensure comprehensive coverage of all related aspects and sub-topics.  
- Conclude by suggesting URLs for further reading to encourage deeper exploration of the topic.  
- Format the response as valid JSON, with the following keys:  
  - `title_for_the_content`: A suitable title for the sub-module  
  - `content`: An introduction or overview of the sub-module  
  - `subsections`: A list of dictionaries containing `title` and `content` for each section  
  - `urls`: A list of URLs for further reading  
- Ensure the JSON is properly formatted and error-free.  
- Align the content with the course requirements for enhanced comprehension.  
**Course Requirements**: {profile}  
</INSTRUCTIONS>  
Your JSON response should strictly follow the format given above. Any deviation will result in invalid output.  
"""
        if lesson_type == 'mathematical':
            prompt = math_prompt
        else:
            prompt = theoretical_prompt 
        flag = 1 if api_key_to_use== 'first' else (2 if api_key_to_use=='second' else 3 )
        print(f'THREAD {flag} RUNNING...')
        tavily_client = TavilyProvider(flag)        
        all_content = []
        for key, val in sub_modules.items():    
            topic = course_name + "-" + module_name + " : " + val
            print('Searching content for module:', topic)
            search_result = tavily_client.search_context(topic)
            output = self.gemini_client.generate_json_response(prompt.format(sub_module_name = val, search_result = search_result, module_name=module_name, course_name=course_name, profile=profile))
            print('Module Generated:', key, '!')
            output['subject_name'] = val
            print(output)
            all_content.append(output)
            time.sleep(3)

        return all_content
    
    def generate_content_from_textbook(self, course_name, module_name, output, profile, vectordb, api_key_to_use):
        prompt= """I'm seeking your expertise on the subject of {sub_module_name} which comes under the module: {module_name}. This module is a part of the course: {course_name}. As a knowledgeable educational assistant, I trust in your ability to provide a comprehensive explanation of this sub-module. Think about the sub-module step by step and design the best way to explain the sub-module to me. Your response should cover essential aspects such as definition, in-depth examples, and any details crucial for understanding the topic. You have access to the subject's information which you have to use while generating the educational content. Please generate quality content on the sub-module ensuring the response is sufficiently detailed covering all the relevant topics related to the sub-module. You will also be provided with my course requirements and needs inside <INSTRUCTIONS>. Structure the course according to my needs.
    
    SUBJECT INFORMATION : ```{context}```

    <INSTRUCTIONS>
    MY COURSE REQUIREMENTS : {profile}
    </INSTRUCTIONS>

    In your response, organize the information into subsections for clarity and elaborate on each subsection with suitable examples if and only if it is necessary. If applicable, incorporate real-world examples, applications or use-cases to illustrate the relevance of the topic in various contexts. Additionally, incorporate anything that helps me to better understand the topic. Please format your output as valid JSON, with the following keys: title_for_the_content (suitable title for the sub-module), content(the main content of the sub-module), subsections (a list of dictionaries with keys - title and content).
    Be a good educational assistant and craft the best way to explain the sub-module following my course requirement. Strictly follow the course requirements and output format provided to you.
    """

        all_content = []
        flag = 1 if api_key_to_use== 'first' else (2 if api_key_to_use=='second' else 3 )
        print(f'THREAD {flag} RUNNING...')
        for key,val in output.items():
            relevant_docs = vectordb.similarity_search(val)
            rel_docs = [doc.page_content for doc in relevant_docs]
            context = '\n'.join(rel_docs)
            content_output = self.gemini_client.generate_json_response(prompt.format(sub_module_name = val, module_name = module_name, profile= profile, context=context, course_name=course_name))
            print("Thread 1: Module Generated: ",key,"!")   
            content_output['subject_name'] = val
            print(content_output)
            all_content.append(content_output)

        return all_content
    
    async def generate_explanation_from_images(self, images, sub_module_name):
        prompt = f"""I am providing you with two images that relates to {sub_module_name}. Your role is to analyze the images in great detail and provide a comprehensive explanation that another language model will use to explain {sub_module_name}. Your explanation should be structured, covering:

Descriptive Elements: Identify and describe all visible elements such as objects, people, settings, colors, and activities. Include their physical characteristics and positioning.

Contextual Analysis: Relate these elements to the topic. Explain their significance, roles, or functions in the context of the subject matter.

Symbolism & Meaning: If the image contains any symbolism or metaphorical elements, explain what they represent and how they contribute to understanding the broader topic.

Technical Breakdown: If the image involves technical or specialized content (e.g., diagrams, charts, machinery), break it down step-by-step for clarity.

Logical Flow: Ensure your explanation is organized and flows logically to make it easier for another model to use this analysis to explain the broader topic effectively.

Provide as much detail as possible and aim to enrich the understanding of the images in the context of the topic. Explain both the images separately. Here are the two images:"""
        output = self.gemini_client.explain_two_image(prompt=prompt, image1=PIL.Image.open(images[0]), image2=PIL.Image.open(images[1]))
        return output
    
    async def generate_content_from_textbook_and_images(self, course_name, module_name, submodule_name, profile, context, image_explanation):
        prompt= f"""I'm seeking your expertise on the subject of {submodule_name} which comes under the module: {module_name}. This module is part of the course: {course_name}. As a knowledgeable educational assistant, I trust in your ability to provide a comprehensive explanation of this sub-module. You will be given explanations for two images related to the topic, and you must use these explanations effectively in your final response. The image explanations are meant to enhance your content, providing visual context and aiding in understanding the sub-module.

Please think about the sub-module step by step and design the best way to explain it to me. Your response should cover essential aspects such as definitions, in-depth examples, and any details crucial for understanding the topic. You have access to the subject's information, which you should use while generating the educational content. Ensure the response is sufficiently detailed, covering all relevant topics related to the sub-module. Structure the course according to my needs as provided.

SUBJECT INFORMATION:
{context}

Image Explanations:
{image_explanation}

<INSTRUCTIONS>
MY COURSE REQUIREMENTS:
{profile}
</INSTRUCTIONS>

In your response, organize the information into subsections for clarity, and elaborate on each subsection with suitable examples if and only if necessary. Make sure to integrate the image explanations into your content, explaining how they relate to and support the sub-module. If any image explanation is irrelevant, do not include them in the response. If applicable, incorporate real-world examples, applications, or use-cases to illustrate the relevance of the topic in various contexts. Additionally, incorporate anything that helps me better understand the topic. Please format your output as valid JSON, with the following keys: title_for_the_content (suitable title for the sub-module), content(the main content of the sub-module), subsections (a list of dictionaries with keys - title and content). Be a good educational assistant and craft the best way to explain the sub-module following my course requirement. Strictly follow the course requirements and output format provided to you.
    """


        content_output = self.gemini_client.generate_json_response(prompt) 
        content_output['subject_name'] = submodule_name
        print(content_output)

        return content_output
    
    async def generate_single_content_from_textbook(self, course_name, module_name, submodule_name, profile, context):
        prompt= f"""I'm seeking your expertise on the subject of {submodule_name} which comes under the module: {module_name}. This module is a part of the course: {course_name}. As a knowledgeable educational assistant, I trust in your ability to provide a comprehensive explanation of this sub-module. Think about the sub-module step by step and design the best way to explain the sub-module to me. Your response should cover essential aspects such as definition, in-depth examples, and any details crucial for understanding the topic. You have access to the subject's information which you have to use while generating the educational content. Please generate quality content on the sub-module ensuring the response is sufficiently detailed covering all the relevant topics related to the sub-module. You will also be provided with my course requirements and needs inside <INSTRUCTIONS>. Structure the course according to my needs.
    
    SUBJECT INFORMATION : ```{context}```

    <INSTRUCTIONS>
    MY COURSE REQUIREMENTS : {profile}
    </INSTRUCTIONS>

    In your response, organize the information into subsections for clarity and elaborate on each subsection with suitable examples if and only if it is necessary. If applicable, incorporate real-world examples, applications or use-cases to illustrate the relevance of the topic in various contexts. Additionally, incorporate anything that helps me to better understand the topic. Please format your output as valid JSON, with the following keys: title_for_the_content (suitable title for the sub-module), content(the main content of the sub-module), subsections (a list of dictionaries with keys - title and content).
    Be a good educational assistant and craft the best way to explain the sub-module following my course requirement. Strictly follow the course requirements and output format provided to you.
    """

        content_output = self.gemini_client.generate_json_response(prompt) 
        content_output['subject_name'] = submodule_name
        print(content_output)

        return content_output
    
    async def generate_content_from_textbook_and_images_with_web(self, course_name, module_name, submodule_name, profile, context, image_explanation, web_context):
        prompt = f"""I'm seeking your expertise on the subject of {submodule_name} which comes under the module: {module_name}. This module is a part ofthe course: {course_name}. As a knowledgeable educational assistant, I trust in your ability to provide a comprehensive explanation of this sub-module. You will be given explanations for two images and some web context related to the topic, and you must use these effectively in your final response. The image explanations and web context are meant to enhance your content, providing additional visual and contextual understanding for the sub-module.

    Please think about the sub-module step by step and design the best way to explain it to me. Your response should cover essential aspects such as definitions, in-depth examples, and any details crucial for understanding the topic. You have access to the subject's information from the textbook, images, and web context, which you should use while generating the educational content. Ensure the response is sufficiently detailed, covering all relevant topics related to the sub-module. Structure the course according to my needs as provided.

    **SUBJECT INFORMATION**:
    {context}

    **Image Explanations**:
    {image_explanation}

    **Web Context**:
    {web_context}

    <INSTRUCTIONS>
    - Follow the course requirements so I can better understand the topic.
    **Course Requirements**:
    {profile}
    </INSTRUCTIONS>

    In your response, organize the information into subsections for clarity, and elaborate on each subsection with suitable examples if and only if necessary. Make sure to integrate the image explanations and web context into your content, explaining how they relate to and support the sub-module. If applicable, incorporate real-world examples, applications, or use-cases to illustrate the relevance of the topic in various contexts. Additionally, incorporate anything that helps me better understand the topic. Please format your output as valid JSON, with the following keys: title_for_the_content (suitable title for the sub-module), content(the main content of the sub-module), subsections (a list of dictionaries with keys - title and content). Be a good educational assistant and craft the best way to explain the sub-module following my course requirement. Strictly follow the course requirements and output format provided to you.
        """
        content_output = self.gemini_client.generate_json_response(prompt) 
        content_output['subject_name'] = submodule_name
        print(content_output)

        return content_output

    async def generate_single_content_from_textbook_with_web(self, course_name, module_name, submodule_name, profile, context, web_context):
        prompt = f"""I'm seeking your expertise on the subject of {submodule_name} which comes under the module: {module_name}. This module is a part of the course: {course_name}. As a knowledgeable educational assistant, I trust in your ability to provide a comprehensive explanation of this sub-module. You will have access to subject information from the textbook and relevant web-based context to create a well-rounded educational response. Think about the sub-module step by step and design the best way to explain it to me.

    Your response should cover essential aspects such as definition, in-depth examples, and any details crucial for understanding the topic. Use both the textbook information and web context effectively while generating the educational content. Please ensure that your response is sufficiently detailed, covering all relevant topics. Structure the course content according to my specific needs provided in <INSTRUCTIONS>.

    SUBJECT INFORMATION:
    {context}

    WEB CONTEXT:
    {web_context}

    <INSTRUCTIONS>
    MY COURSE REQUIREMENTS:
    {profile}
    </INSTRUCTIONS>

    In your response, organize the information into subsections for clarity, and elaborate on each subsection with suitable examples only if necessary. Where applicable, include real-world examples, applications, or use-cases to illustrate the topic's relevance in various contexts. Additionally, incorporate any explanations that help me better understand the topic. Please format your output as valid JSON, with the following keys: title_for_the_content (a suitable title for the sub-module), content (the main content of the sub-module), and subsections (a list of dictionaries with keys - title and content). 

    Be a good educational assistant and craft the best way to explain the sub-module following my course requirements. Strictly follow the course requirements and output format provided to you.
    """

        content_output = self.gemini_client.generate_json_response(prompt)
        content_output['subject_name'] = submodule_name
        print(content_output)

        return content_output
