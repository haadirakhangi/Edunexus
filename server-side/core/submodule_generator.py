from api.openai_client import OpenAIProvider
from api.tavily_client import TavilyProvider

class SubModuleGenerator:
    def __init__(self):
        self.openai_client = OpenAIProvider()
        self.tavily_client = TavilyProvider()

    def generate_submodules(self, module_name):
        prompt_submodules = """You are an educational assistant having knowledge in various domains. You will be provided with a module name and your task is to generate suitable number of 'Sub-Modules' names that are related to the module. The output should be in json format where each key corresponds to the sub-module number and the values are the sub-module names.
    Module Name: {module_name}
    """
        output = self.openai_client.generate_json_response(prompt_submodules.format(module_name = module_name))
        return output
    
    def generate_submodules_from_web(self, module_name, summary):
        topic = module_name + summary
        search_result = self.tavily_client.search_context(topic)

        sub_module_generation_prompt= """You are an educational assistant named ISAAC. You will be provided with a module name and information on that module from the internet. Your task is to generate a suitable number of 'Sub-Modules' names that are related to the modules. The output should be in json format where each key corresponds to the sub-module number and the values are the sub-module names.

    Module Name: {module_name}

    Search Results: {search_result}

    Follow the provided JSON format diligently.
        """

        output = self.openai_client.generate_json_response(sub_module_generation_prompt.format(module_name = module_name, search_result = search_result))
        return output
    
    def generate_submodules_from_textbook(self, topic, vectordb):
        relevant_docs = vectordb.similarity_search('Important modules or topics on '+ topic)
        rel_docs = [doc.page_content for doc in relevant_docs]
        context = '\n'.join(rel_docs)
        module_generation_prompt = """You are an educational assistant with knowledge in various domains. A student is seeking your expertise to learn a given topic. You will be provided with context from their textbook and your task is to design course modules to complete all the major concepts about the topic in the textbook. Craft a suitable number of module names for the student to learn the topic they wish. Ensure the module names are relevant to the topic using the context provided to you. You MUST only use the knowledge provided in the context to craft the module names. The output should be in json format where each key corresponds to the sub-module number and the values are the sub-module names. Do not consider summary or any irrelevant topics as module names.

        Topic: {topic}

        Context: {context}

        Follow the provided JSON format diligently."""

        output = self.openai_client.generate_json_response(module_generation_prompt.format(topic= topic, context = context))
        return output