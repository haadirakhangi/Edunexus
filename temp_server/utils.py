from dotenv import load_dotenv
import os
import openai
import ast
from openai import OpenAI
import time
from tavily import TavilyClient
from reportlab.lib.pagesizes import letter
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Image
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import mm
from serpapi import GoogleSearch
import requests
import json

load_dotenv()
openai_api_key1 = os.environ.get('OPENAI_API_KEY1')
openai_api_key2 = os.environ.get('OPENAI_API_KEY2')
openai_api_key3 = os.environ.get('OPENAI_API_KEY3')
tavily_api_key1 = os.environ.get('TAVILY_API_KEY1')
tavily_api_key2 = os.environ.get('TAVILY_API_KEY2')
tavily_api_key3 = os.environ.get('TAVILY_API_KEY3')
serper_api_key1 = os.environ.get('SERPER_API_KEY1')
serper_api_key2 = os.environ.get('SERPER_API_KEY2')
print('OPENAI API KEYS: ', openai_api_key1, openai_api_key2, openai_api_key3)
google_serp_api_key = os.environ.get('GOOGLE_SERP_API_KEY')


def module_image_from_web(submodules):
    print('FETCHING IMAGES...')
    keys_list = list(submodules.keys())
    images_list=[]
    for key in keys_list:
        url = "https://google.serper.dev/images"
        payload = json.dumps({
            "q": submodules[key]
        })
        headers = {
            'X-API-KEY': serper_api_key1,
            'Content-Type': 'application/json'
        }

        response = requests.request("POST", url, headers=headers, data=payload)
        json_response = json.loads(response.text)
        image_results = json_response["images"]
        image_links = [i["imageUrl"] for i in image_results]
        images_list.append(image_links)
    return images_list

def module_videos_from_web(submodules):
    print('FETCHING VIDEOS...')
    keys_list = list(submodules.keys())
    videos_list=[]
    for key in keys_list:
        params = {
        "q": submodules[key],
        "engine": "google_videos",
        "ijn": "0",
        "api_key": google_serp_api_key
        }

        search = GoogleSearch(params)
        results = search.get_dict()
        video_results = results["video_results"]
        yt_links = [i['link'] for i in video_results[:10]]
        videos_list.append(yt_links)
    return videos_list

def generate_module_from_textbook(topic, vectordb):
  relevant_docs = vectordb.similarity_search('Important modules or topics on '+ topic)
  rel_docs = [doc.page_content for doc in relevant_docs]
  context = '\n'.join(rel_docs)
  module_generation_prompt = """You are an educational assistant with knowledge in various domains. A student is seeking your expertise \
  to learn a given topic. You will be provided with context from their textbook \
  and your task is to design course modules to complete all the major concepts about the topic in the textbook. Craft a suitable number of \
  module names for the student to learn the topic they wish. \
  Ensure the module names are relevant to the topic using the context provided to you. \
  You MUST only use the knowledge provided in the context to craft the module names. \
  The output should be in json format where each key corresponds to the \
  sub-module number and the values are the sub-module names. Do not consider summary or any irrelevant topics as module names.

Topic: {topic}

Context: {context}

Follow the provided JSON format diligently."""

  client = OpenAI(api_key=openai_api_key1)
  completion = client.chat.completions.create(
          model = 'gpt-3.5-turbo-1106',
          messages = [
              {'role':'user', 'content': module_generation_prompt.format(topic= topic, context = context)},
          ],
          response_format = {'type':'json_object'},
          seed = 42,
)
  output = ast.literal_eval(completion.choices[0].message.content)

  return output

def generate_content_from_textbook(module_name, output, profile, vectordb, api_key_to_use):
    prompt= """I'm seeking your expertise on the subject of {sub_module_name} which comes under the module: {module_name}.\
As a knowledgeable educational assistant, I trust in your ability to provide \
a comprehensive explanation of this sub-module. Think about the sub-module step by step and design the best way to explain the sub-module to me. \
Your response should cover essential aspects such as definition, in-depth examples, and any details crucial for understanding the topic. \
You have access to the subject's information which you have to use while generating the educational content. \
Please generate quality content on the sub-module ensuring the response is sufficiently detailed covering all the relevant topics related to the sub-module. You will also \
be provided with my course requirements and needs. Structure the course according to my needs.

MY COURSE REQUIREMENTS : {profile}

SUBJECT INFORMATION : {context}

--------------------------------
In your response, organize the information into subsections for clarity and elaborate on each subsection with suitable examples if and only if it is necessary. \
If applicable, incorporate real-world examples, applications or use-cases to illustrate the relevance of the topic in various contexts. Additionally, incorporate anything \
that helps the student to better understand the topic. \
Please format your output as valid JSON, with the following keys: title_for_the_content (suitable title for the sub-module), \
content(the main content of the sub-module), subsections (a list of dictionaries with keys - title and content).
Be a good educational assistant and craft the best way to explain the sub-module following my course requirement strictly..
  """

    all_content = []
    flag = 1 if api_key_to_use== 'first' else (2 if api_key_to_use=='second' else 3 )
    print(f'THREAD {flag} RUNNING...')
    openai_api_key = openai_api_key1 if flag == 1 else(openai_api_key2 if flag == 2 else openai_api_key3)
    for key,val in output.items():
        relevant_docs = vectordb.similarity_search(val)
        rel_docs = [doc.page_content for doc in relevant_docs]
        context = '\n'.join(rel_docs)

        client = OpenAI(api_key= openai_api_key)

        completion = client.chat.completions.create(
                    model = 'gpt-3.5-turbo-1106',   
                    messages = [
                        {'role':'user', 'content': prompt.format(sub_module_name = val, module_name = module_name, profile= profile, context=context)},
                    ],
                    response_format = {'type':'json_object'},
                    seed = 42
        )
        print("Thread 1: Module Generated: ",key,"!")   
        content_output = ast.literal_eval(completion.choices[0].message.content)
        content_output['subject_name'] = val
        print(content_output)
        all_content.append(content_output)

    return all_content