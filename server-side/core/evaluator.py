from api.openai_client import OpenAIProvider
from api.tavily_client import TavilyProvider

class Evaluator:
    def __init__(self):
        self.openai_client = OpenAIProvider()
        self.tavily_client = TavilyProvider()

    def evaluate_conversation_quiz(self, question_and_response):
        questions = [list(i.keys())[0] for i in question_and_response]
        answers = [list(i.values())[0] for i in question_and_response]
        evaluation_prompt = """ You are a strict grader. You will be given a set of questions asked by an examiner along with the corresponding set of answers that was given by the student. Your task is to provide an overall grade to the specified parameters for the answers on a scale of 1 to 10, with 0 being very bad and 10 being the best. You are supposed to provide an aggregate score to all the answers at once. Don't score each answer separately. The description of the parameters is provided to you. Here is the description of the parameters:
    ```
    Accuracy: The answer should be accurate and correct, with no factual errors or misunderstandings.
    Completeness: The answer should cover all the relevant aspects of the question and provide a comprehensive response.
    Clarity: The answer should be clear and easy to understand, with well-organized thoughts and ideas. If the question is technical, technical terms should be preferred.
    Relevance: The answer should stay focused on the question and not include irrelevant information or tangents.
    Understanding: The answer should demonstrate a deep understanding of the topic, with thoughtful analysis and insights.
    ```

    List of questions asked by the examiner: ```{questions}```
    Corresponding list of answers: ```{answers}```

    Please provide a strict overall score to the parameters accordingly as well as feedback to the user on the parts they can improve on. If the answers are short and incomplete provide a low score in the respective parameters and give an appropriate feedback. Also, specify the questions in case the user gave a wrong answer to it.

    Make sure your output is a valid json where the keys are the accuracy, completeness, clarity, relevance, understanding and feedback.
    """

        output = self.openai_client.generate_json_response(evaluation_prompt.format(questions = questions, answers = answers))
        return output