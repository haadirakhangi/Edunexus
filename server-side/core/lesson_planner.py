from api.gemini_client import GeminiProvider
import typing_extensions as typing

class Lecture(typing.TypedDict):
    lesson_name: str
    description: str

class LessonPlanner:
    def __init__(self):
        self.gemini_client = GeminiProvider()

    def generate_lesson_plan(self, course_name, context, num_lectures):
        prompt = f"""Given the syllabus context for {course_name} and the total number of lectures {num_lectures}, you are to act as an expert lesson planner. Your task is to divide the syllabus into hour-long lectures, focusing on relevant content only. Exclude any unrelated material, such as textbook names, lab experiments, or content from other subjects from the context. Use the following context:\n- **Context** (This contains the full syllabus text, including relevant and irrelevant material): \n```{context}```. \n\n Structure the output as a list of JSON objects, where the key of each JSON object is the name of the lesson and the corresponding values are a concise overview of the lecture content. Generate {num_lectures} such lecture names along with a brief description of each lecture."""
        result = self.gemini_client.generate_json_response(prompt=prompt)
        return result