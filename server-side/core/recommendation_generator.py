from api.gemini_client import GeminiProvider
from models.student_schema import Module
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.decomposition import PCA
from sklearn.metrics.pairwise import cosine_similarity
import os
import csv

class RecommendationGenerator:
    def __init__(self):
        self.gemini_client = GeminiProvider()
        self.current_dir = os.path.dirname(__file__)
        self.data_dir = os.path.join(self.current_dir, 'recommendation_data', 'modules.csv')
        self.df_module = pd.read_csv(self.data_dir)
        self.X = np.array(self.df_module.summary)
        self.model = SentenceTransformer('all-distilroberta-v1')
        self.vec_embed = self.model.encode(self.X)
        self.df_module['embeddings'] = self.vec_embed.tolist()

    def generate_recommendations_with_interests(self, user_course, user_interest):
        recc_prompt = '''You will be given a student's area of interest and the current course the student is enrolled in . Your task is to suggest or recommend similar courses for the student. Generate 10 module names along with their summary. The output should be in json format where each key corresponds to the recommended course name and the value is a short description about the recommeded course.
        Student's Current Course: {user_course}
        Student's Interests: {user_interest}

        Example output:
        ```json
        course name here : course summary here
        ```
        '''
        
        output = self.gemini_client.generate_json_response(recc_prompt.format(user_course = user_course, user_interest=user_interest))
        return output
    
    def generate_recommendations_with_summary(self, module_summary, top_n=5):
        embeddings = self.model.encode([module_summary])
        self.df_module["similarities"] = self.df_module["embeddings"].apply(lambda x: cosine_similarity([x], embeddings))
        sorted_df = self.df_module.sort_values(by="similarities", ascending=False)
        top_similar_df = sorted_df.head(top_n)
        print(top_similar_df['module_name'])
        output = {row['module_name']: row['summary'] for _, row in top_similar_df.iterrows()}
        print("OUTPUT",output)
        return output
