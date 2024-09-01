import os
import ast
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

class OpenAIProvider:
    def __init__(self):
        self.openai_client = OpenAI()

    def generate_json_response(self, prompt):
        completion = self.openai_client.chat.completions.create(
                    model = 'gpt-4o-mini',
                    messages = [
                        {'role':'user', 'content': prompt},
                    ],
                    response_format = {'type':'json_object'},
                    seed = 42
                )
        output = ast.literal_eval(completion.choices[0].message.content)
        return output