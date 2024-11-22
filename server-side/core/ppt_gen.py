#WORKING 
import os
import re
import markdown
from bs4 import BeautifulSoup
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.enum.text import MSO_VERTICAL_ANCHOR
from pptx.dml.color import RGBColor
from PIL import Image

def convert_markdown_to_formatted_content(markdown_text):

    html = markdown.markdown(markdown_text, extensions=['tables'])
    soup = BeautifulSoup(html, 'html.parser')
    
    parsed_content = {
        'paragraphs': [],
        'tables': []
    }
    
    
    for element in soup.find_all(['h1', 'h2', 'h3', 'p', 'ul', 'table']):
        if element.name in ['h1', 'h2', 'h3']:
            header_level = int(element.name[1])
            parsed_content['paragraphs'].append({
                'text': element.get_text(),
                'style': 'header',
                'level': header_level
            })
        
        elif element.name == 'p':
            parsed_content['paragraphs'].append({
                'text': element.get_text(),
                'style': 'normal',
                'level': 0
            })
        
        elif element.name == 'ul':
            for li in element.find_all('li'):
                parsed_content['paragraphs'].append({
                    'text': li.get_text(),
                    'style': 'bullet',
                    'level': 1
                })
        
        elif element.name == 'table':
            table_data = {
                'headers': [],
                'rows': []
            }
            
            headers = element.find_all('th')
            if headers:
                table_data['headers'] = [header.get_text() for header in headers]
            
            rows = element.find_all('tr')[1:] if headers else element.find_all('tr')
            for row in rows:
                row_data = [cell.get_text() for cell in row.find_all(['td', 'th'])]
                table_data['rows'].append(row_data)
            
            parsed_content['tables'].append(table_data)
    
    return parsed_content

def create_powerpoint_from_slides(slide_data_list, output_filename='presentation.pptx'):
    prs = Presentation()
    
    # Use a blank slide layout
    blank_slide_layout = prs.slide_layouts[6]
    
    def add_title(slide, title):
    
        left = Inches(0.5)
        top = Inches(0.5)
        width = Inches(9)
        height = Inches(1)
        
        txBox = slide.shapes.add_textbox(left, top, width, height)
        tf = txBox.text_frame
        p = tf.paragraphs[0]
        p.text = title
        p.alignment = PP_ALIGN.CENTER
        
        # Formatting [DO NOT REMOVE COMMENT]
        font = p.font
        font.size = Pt(32)
        font.color.rgb = RGBColor(0, 51, 102)  
        font.bold = True
    
    def add_content(slide, markdown_content):
        
        content = convert_markdown_to_formatted_content(markdown_content)
        
        
        left = Inches(0.5)
        top = Inches(1.5)
        width = Inches(9)
        height = Inches(4)
        
        txBox = slide.shapes.add_textbox(left, top, width, height)
        tf = txBox.text_frame
        
        for item in content['paragraphs']:
            p = tf.add_paragraph()
            p.text = item['text']
            
            # Formatting based on style
            if item['style'] == 'header':
                p.font.size = Pt(24 - (item['level'] * 4))
                p.font.bold = True
                p.level = item['level'] - 1  # Adjust header levels
            elif item['style'] == 'bullet':
                p.level = 1  # Bullet point
                p.font.size = Pt(16)
            else:
                p.font.size = Pt(16)
        
        # Add tables if present
        if content['tables']:
            for table_data in content['tables']:
                add_table_to_slide(slide, table_data)
    
    def add_table_to_slide(slide, table_data):

        left = Inches(0.5)
        top = Inches(5)
        width = Inches(9)
        height = Inches(2)
        
        num_columns = len(table_data['headers']) if table_data['headers'] else len(table_data['rows'][0])
        num_rows = len(table_data['rows']) + (1 if table_data['headers'] else 0)
        
        shapes = slide.shapes
        table = shapes.add_table(
            num_rows, 
            num_columns, 
            left, 
            top, 
            width, 
            height
        ).table
        
        if table_data['headers']:
            for col, header in enumerate(table_data['headers']):
                cell = table.cell(0, col)
                cell.text = header
                cell.text_frame.paragraphs[0].font.bold = True
        
        start_row = 1 if table_data['headers'] else 0
        for row_idx, row_data in enumerate(table_data['rows'], start=start_row):
            for col_idx, cell_data in enumerate(row_data):
                table.cell(row_idx, col_idx).text = str(cell_data)
   

    def add_images(slide, images):

      slide_width = Inches(10)
      slide_height = Inches(7.5)
      
      occupied_regions = [] 
      
      def is_area_free(left, top, width, height):
          """Check if a given area overlaps with any occupied region."""
          for region in occupied_regions:
              r_left, r_top, r_width, r_height = region
              if not (left + width <= r_left or  
                      left >= r_left + r_width or  
                      top + height <= r_top or  
                      top >= r_top + r_height):  
                  return False
          return True

      def find_free_position(width, height):
          """Find a position within the slide where the image can fit."""
          padding = Inches(0.2)
          for y in range(0, int(slide_height - height), int(height + padding)):
              for x in range(0, int(slide_width - width), int(width + padding)):
                  if is_area_free(x, y, width, height):
                      return x, y
          return None, None  

      max_width = Inches(3)
      max_height = Inches(2.5)

      for image_path in images:
          try:
              with Image.open(image_path) as img:

                  aspect_ratio = img.width / img.height
                  img_width = min(max_width, slide_width - Inches(1))
                  img_height = img_width / aspect_ratio

                  if img_height > max_height:
                      img_height = max_height
                      img_width = img_height * aspect_ratio
                  
                  left, top = find_free_position(img_width, img_height)
                  if left is not None and top is not None:
                      add_image_to_slide(slide, image_path, left, top, img_width, img_height)
                      occupied_regions.append((left, top, img_width, img_height))
                  else:
                      print(f"Not enough space for image: {image_path}")
          except FileNotFoundError:
              print(f"Image not found: {image_path}")
          except Exception as e:
              print(f"Error adding image {image_path}: {e}")

    def add_image_to_slide(slide, image_path, left, top, width, height):
        """Add a single image to the slide with error handling."""
        try:
            slide.shapes.add_picture(image_path, left, top, width, height)
        except FileNotFoundError:
            print(f"Image not found: {image_path}")
        except Exception as e:
            print(f"Error adding image {image_path}: {e}")

        for slide_data in slide_data_list:
            slide = prs.slides.add_slide(blank_slide_layout)
            add_title(slide, slide_data.get('title', 'Untitled'))
            add_content(slide, slide_data.get('content', ''))
            add_images(slide, slide_data.get('images', []))
        
        
        prs.save(output_filename)
        print(f"Presentation saved as {output_filename}")

# # Example usage with rich markdown content
# slide_data = [
#     {
#         'title': 'Introduction to Machine Learning',
#         'content': '''# Overview of Machine Learning

# Machine Learning is a powerful subset of Artificial Intelligence (AI).

# ## Key Characteristics
# - Enables computers to learn from data
# - Adapts without explicit programming
# - Improves performance over time

# ## Applications
# - Image Recognition
# - Natural Language Processing
# - Predictive Analytics

# ## Performance Comparison

# | Technique | Accuracy | Speed | Complexity |
# |-----------|----------|-------|------------|
# | Linear Regression | 70% | Fast | Low |
# | Random Forest | 85% | Medium | High |
# | Deep Neural Networks | 95% | Slow | Very High |
# ''',
#         'images': ['ml_diagram.png']
#     },
#     {
#         'title': 'Types of Machine Learning',
#         'content': '''# Learning Approaches

# ## Supervised Learning
# - Uses labeled training data
# - Predicts outcomes for new data
# - Examples: Classification, Regression

# ## Unsupervised Learning
# - Works with unlabeled data
# - Finds hidden patterns
# - Examples: Clustering, Dimensionality Reduction

# ## Reinforcement Learning
# - Learn through interaction with environment
# - Receives rewards/penalties
# - Used in robotics, game playing
# ''',
#         'images': ['Screenshot (1).png', 'Screenshot (2).png']
#     }
# ]
# #create_powerpoint_from_slides(slide_data)
