from api.gemini_client import GeminiProvider
import pypandoc
from io import BytesIO
import os
from datetime import datetime



class LabManualGenerator:
    def __init__(self):
        self.gemini_client = GeminiProvider()
        

        
    def get_lab_manual_description(components):
        # Original lab_manual_components dictionary with descriptions
        lab_manual_components = {
            "Title": "The name of the experiment, providing a concise and descriptive label for the lab.",
            "Aim": "A brief statement describing the objective or purpose of the experiment.",
            "Theory": "A section that explains the fundamental principles, scientific theories, and background information relevant to the experiment.",
            "Apparatus": "A list of all equipment, tools, chemicals, and materials required to conduct the experiment.",
            "Procedure": "Step-by-step instructions outlining how the experiment is to be performed, including any safety precautions.",
            "Observations": "A section for recording observations, data collected, and any qualitative information noted during the experiment.",
            "Results": "This section includes tables, graphs, or any other format of data representation showing the outcomes obtained from the experiment.",
            "Calculations": "A detailed explanation of any mathematical calculations or formulas used to derive the results.",
            "Discussion": "An analysis of the results, explaining the significance of the findings, sources of error, and any deviations from expected outcomes.",
            "Conclusion": "A brief summary of the experiment’s outcomes, stating whether the aim was achieved and what was learned from the experiment.",
            "Precautions": "Guidelines for safely conducting the experiment and avoiding common errors.",
            "Questions": "Related questions or problems to solve, encouraging critical thinking and deeper understanding of the experiment's concepts.",
            "References": "Citations for any books, articles, or online resources used in preparing the lab manual or for further reading.",
            "Appendix": "Additional information, such as supplementary data, extra calculations, or detailed explanations that support the experiment."
            }

        # Extract the descriptions for the specified components
        result = {component: lab_manual_components.get(component, "DESCRIPTION NOT AVAILABLE") for component in components}

        # Convert the resulting dictionary to a string
        # result_string = str(result)
        return result


    def generate_lab_manual(self,aim,teacher_name,course_name,components,include_videos=False):
        today_date = datetime.now().date()
        prompt = f"""Given the aim for {course_name} and the components of the lab manual to be generated, you are to act as a lab assistant. Your task is to create lab manuals for students studying {course_name}. Generate the content of each component so it becomes a lab manual.
        The components of the lab manual are {components}.
        The aim of the experiment is: {aim}.
        The name of the teacher conducting the experiment is: {teacher_name}.
        Course Name is: {course_name}.
        Print the date of conducting the experiment on the right side: {today_date}.

        Structure the output in a properly formatted markdown file."""
        result = self.gemini_client.generate_json_response(prompt=prompt,markdown=True)
        return result
    

    @staticmethod
    def convert_markdown_to_docx(input_file, course_name, exp_num, reference_docx=None):
        extra_args = [
            '--standalone',
            '--from=markdown+hard_line_breaks+yaml_metadata_block+header_attributes'
        ]
        
        if reference_docx:
            extra_args.extend(['--reference-doc', reference_docx])
        
        current_dir = os.path.dirname(__file__)
        output_dir = os.path.join(current_dir, "Documents")
        os.makedirs(output_dir, exist_ok=True)
        
        doc=f"{course_name}_{exp_num}.docx"
        output_file = os.path.join(output_dir, doc)
        pypandoc.convert_text(input_file, 'docx', format='markdown', outputfile=output_file, extra_args=extra_args)
        
        return output_file
            
