import os
import time
from api.openai_client import OpenAIProvider
from api.tavily_client import TavilyProvider

class ContentGenerator:
    def __init__(self):
        self.openai_client = OpenAIProvider()

    def generate_content(self, output, module_name, api_key_to_use):
        prompt_content_gen = """I'm seeking your expertise on the sub-module : {sub_module_name} \which comes under the module: {module_name}. As a knowledgeable educational assistant, I trust in your ability to provide a comprehensive explanation of this sub-module. Think about the sub-module step by step and design the best way to explain the sub-module to a student. Your response should cover essential aspects such as definition, in-depth examples, and any details crucial for understanding the topic. Please generate quality content on the sub-module ensuring the response is sufficiently detailed covering all the relevant topics related to the sub-module. In your response, organize the information into subsections for clarity and elaborate on each subsection with suitable examples if and only if it is necessary. Include specific hypothetical scenario-based examples(only if it is necessary) or important sub-sections related to the subject to enhance practical understanding. If applicable, incorporate real-world examples, applications or use-cases to illustrate the relevance of the topic in various contexts. Additionally, incorporate anything that helps the student to better understand the topic. Ensure all the relevant aspects and topics related to the sub-module is covered in your response. Conclude your response by suggesting relevant URLs for further reading to empower users with additional resources on the subject. Please format your output as valid JSON, with the following keys: title_for_the_content (suitable title for the sub-module), content(an introduction of the sub-module), subsections (a list of dictionaries with keys - title and content), and urls (a list). Be a good educational assistant and craft the best way to explain the sub-module.
    """
        all_content = []
        flag = 1 if api_key_to_use== 'first' else (2 if api_key_to_use=='second' else 3 )
        print(f'THREAD {flag} RUNNING...')
        for key,val in output.items():
            content_output = self.openai_client.generate_json_response(prompt_content_gen.format(sub_module_name = val, module_name = module_name))
            print("Thread 1: Module Generated: ",key,"!")   
            content_output['subject_name'] = val
            print(content_output)
            all_content.append(content_output)
        return all_content
    
    def generate_content_from_web(self, sub_module_name, module_name, api_key_to_use):
        content_generation_prompt = """I'm seeking your expertise on the subject of {sub_module_name} which comes under the module: {module_name}. As a knowledgeable educational assistant, I trust in your ability to provide a comprehensive explanation of this sub-module. Think about the sub-module step by step and design the best way to explain the sub-module to a student. Your response should cover essential aspects such as definition, in-depth examples, and any details crucial for understanding the topic. You have access to the subject's information which you have to use while generating the educational content. Please generate quality content on the sub-module ensuring the response is sufficiently detailed covering all the relevant topics related to the sub-module.

    SUBJECT INFORMATION : ```{search_result}```

    --------------------------------
    In your response, organize the information into subsections for clarity and elaborate on each subsection with suitable examples if and only if it is necessary. Include specific hypothetical scenario-based examples (only if it is necessary) or important sub-sections related to the subject to enhance practical understanding. If applicable, incorporate real-world examples, applications or use-cases to illustrate the relevance of the topic in various contexts. Additionally, incorporate anything that helps the student to better understand the topic. Ensure all the relevant aspects and topics related to the sub-module is covered in your response.Conclude your response by suggesting relevant URLs for further reading to empower users with additional resources on the subject.    Please format your output as valid JSON, with the following keys: title_for_the_content (suitable title for the sub-module), content(an introduction of the sub-module), subsections (a list of dictionaries with keys - title and content), and urls (a list).
    Be a good educational assistant and craft the best way to explain the sub-module.
        """
        flag = 1 if api_key_to_use== 'first' else (2 if api_key_to_use=='second' else 3 )
        print(f'THREAD {flag} RUNNING...')
        tavily_client = TavilyProvider(flag)        
        all_content = []
        for key, val in sub_module_name.items():    
            print('Searching content for module:', key)
            search_result = tavily_client.search_context(val)
            output = self.openai_client.generate_json_response(content_generation_prompt.format(sub_module_name = val, search_result = search_result, module_name=module_name))
            print('Module Generated:', key, '!')
            output['subject_name'] = val
            print(output)
            all_content.append(output)
            time.sleep(3)

        return all_content
    
    def generate_content_from_textbook(self, module_name, output, profile, vectordb, api_key_to_use):
        prompt= """I'm seeking your expertise on the subject of {sub_module_name} which comes under the module: {module_name}. As a knowledgeable educational assistant, I trust in your ability to provide a comprehensive explanation of this sub-module. Think about the sub-module step by step and design the best way to explain the sub-module to me. Your response should cover essential aspects such as definition, in-depth examples, and any details crucial for understanding the topic. You have access to the subject's information which you have to use while generating the educational content. Please generate quality content on the sub-module ensuring the response is sufficiently detailed covering all the relevant topics related to the sub-module. You will also be provided with my course requirements and needs. Structure the course according to my needs.

    MY COURSE REQUIREMENTS : {profile}

    SUBJECT INFORMATION : {context}

    --------------------------------
    In your response, organize the information into subsections for clarity and elaborate on each subsection with suitable examples if and only if it is necessary. If applicable, incorporate real-world examples, applications or use-cases to illustrate the relevance of the topic in various contexts. Additionally, incorporate anything that helps the student to better understand the topic. Please format your output as valid JSON, with the following keys: title_for_the_content (suitable title for the sub-module), content(the main content of the sub-module), subsections (a list of dictionaries with keys - title and content).
    Be a good educational assistant and craft the best way to explain the sub-module following my course requirement strictly..
    """

        all_content = []
        flag = 1 if api_key_to_use== 'first' else (2 if api_key_to_use=='second' else 3 )
        print(f'THREAD {flag} RUNNING...')
        for key,val in output.items():
            relevant_docs = vectordb.similarity_search(val)
            rel_docs = [doc.page_content for doc in relevant_docs]
            context = '\n'.join(rel_docs)
            content_output = self.openai_client.generate_json_response(prompt.format(sub_module_name = val, module_name = module_name, profile= profile, context=context))
            print("Thread 1: Module Generated: ",key,"!")   
            content_output['subject_name'] = val
            print(content_output)
            all_content.append(content_output)

        return all_content