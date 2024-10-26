from api.gemini_client import GeminiProvider
import typing_extensions as typing

class Lecture(typing.TypedDict):
    lesson_name: str
    description: str

class LessonPlanner:
    def __init__(self):
        self.gemini_client = GeminiProvider()

    def generate_lesson_plan(self, course_name, relevant_docs, num_lectures):
        prompt = f"""You are a lesson planner. Your job is to divide the submodules into lectures, each lecture would be of an hour each. You need to plan on what should be covered in each lecture.
        Name of the course: {course_name}
        The relevant docs might contain useless stuff, you need to filter out only the submodules that are relevant to {course_name}.
        The relevant docs are given below:
        {relevant_docs}

        List {num_lectures} lecture names with a brief description of each lecture. The description would consist of a flow on how the teacher should teach that lecture.
        """
        result = self.gemini_client.generate_json_response(prompt=prompt, response_schema=list[Lecture])
        return result