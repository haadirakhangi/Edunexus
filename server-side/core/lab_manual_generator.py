from api.gemini_client import GeminiProvider
from api.serper_client import SerperProvider
import pypandoc
import os
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor


class LabManualGenerator:
    def __init__(self):
        self.gemini_client = GeminiProvider()
        
    @staticmethod
    def get_lab_manual_description(components):
        lab_manual_components = {
            "Theory": "A section that explains the theoretical aspects for example (but not limited to): fundamental principles, scientific theories, and background information relevant to the experiment.",
            "Apparatus": "A list of all equipment, tools, chemicals, and materials required to conduct the experiment.",
            "Requirements": "A list of all equipment, tools, chemicals, and materials required to conduct the experiment.",
            "Technologies Used": "A list of all the technologies, software or system requirements required to conduct the experiment.",
            "Procedure": "Step-by-step instructions outlining how the experiment is to be performed.",
            "Code":"A sample code snippet that helps to guides on how to perform the experiment",
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

        result = {component: lab_manual_components.get(component, "DESCRIPTION NOT AVAILABLE") for component in components}
        return result


    def generate_lab_manual(self, experiment_aim, experiment_num, teacher_name, course_name, components, include_videos=False):
        components = LabManualGenerator.get_lab_manual_description(components)
        today_date = datetime.now().date()
        lab_headers = (
            f"# {course_name}\n\n"               
            f"**Experiment No: {experiment_num}**\n\n"  
            f"**Instructor:** {teacher_name}  \n\n  "   
            f"**Date:** {today_date}\n\n"           
            f"**Aim:** {experiment_aim}\n\n"
        )
        prompt = f"""Act as a lab assistant creating a lab manual for students based on the course: **{course_name}** and the experiment aim: **{experiment_aim}**. Using this context, generate content only for each of the specified components in markdown format, ensuring a logical instructional flow where any concluding sections (e.g., conclusions, evaluations) appear at the end.
        ## Components:\n{components}
        Use {course_name} and {experiment_aim} for context only; do not include them in the generated output. The output should be limited strictly to these components and in a properly formatted markdown. You may use headers for each component or the title of each components as section labels  (such as "## Technologies Used") but do not include any overarching section headers like "## Components:" in the response. Ensure that the order of components follows a natural flow, with concluding or evaluative content placed at the end if applicable."""

        if include_videos:
            with ThreadPoolExecutor() as executor:
                future_result = executor.submit(self.gemini_client.generate_json_response, prompt, None, True)
                future_video_links = executor.submit(SerperProvider.search_videos_from_web, experiment_aim)
            result = future_result.result()
            video_links = future_video_links.result()
        else:
            result = self.gemini_client.generate_json_response(prompt=prompt, markdown=True)
        
        final_manual_markdown = lab_headers + result
        if include_videos:
            final_manual_markdown += "\n\n## Videos References:\n"
            for link in video_links:
                final_manual_markdown += f"* [{link}]({link})\n"
        return final_manual_markdown
    
    @staticmethod
    def convert_markdown_to_docx(input_file, course_name, exp_num, reference_docx=None):
        extra_args = [
            '--standalone',
            '--from=markdown+hard_line_breaks+yaml_metadata_block+header_attributes'
        ]
        
        if reference_docx:
            extra_args.extend(['--reference-doc', reference_docx])
        
        current_dir = os.path.dirname(__file__)
        output_dir = os.path.join(current_dir, "lab-manuals")
        os.makedirs(output_dir, exist_ok=True)
        
        doc=f"{course_name} Experiment {exp_num}.docx"
        output_file = os.path.join(output_dir, doc)
        pypandoc.convert_text(input_file, 'docx', format='markdown', outputfile=output_file, extra_args=extra_args)
        
        return output_file
            
