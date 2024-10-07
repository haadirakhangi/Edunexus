'''extract imgs, in class
func


'''
import os
from PIL import Image
import fitz
import io
import torch

class PDFExtractor:
    def __init__(self, device, model, processor, tokenizer):
        self.device = device
        self.model = model
        self.processor = processor
        self.tokenizer = tokenizer

    def extract_images(self, pdf_path, output_directory_path):
        if not os.path.exists(output_directory_path):
            os.makedirs(output_directory_path)
        
        pdf_document = fitz.open(pdf_path)
        
        for page_index in range(len(pdf_document)):
            page = pdf_document.load_page(page_index)
            image_list = page.get_images(full=True)

            for image_index, img in enumerate(image_list, start=1):
                xref = img[0]
                base_image = pdf_document.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                image_path = f"{output_directory_path}/image_{page_index + 1}_{image_index + 1}.{image_ext}"
                image = Image.open(io.BytesIO(image_bytes))
                image.save(image_path)

    def embed_image(self, image_path):
        image = Image.open(image_path)
        inputs = self.processor(images=image, return_tensors="pt").to(self.device)
        with torch.no_grad():
            image_features = self.model.get_image_features(**inputs)
        image_features_normalized = image_features / image_features.norm(dim=-1, keepdim=True)
        image_features_normalized = image_features_normalized.cpu().numpy()
        return image_features_normalized

    def embed_text(self, text):
        inputs = self.tokenizer([text], return_tensors="pt").to(self.device)
        with torch.no_grad():
            text_features = self.model.get_text_features(**inputs)
        text_features_normalized = text_features / text_features.norm(dim=-1, keepdim=True)
        text_features_normalized = text_features_normalized.cpu().numpy()
        return text_features_normalized




# Example usage
# Initialize the required components, such as the device, model, processor, and tokenizer.
# device = "cuda" if torch.cuda.is_available() else "cpu"
# model = ...
# processor = ...
# tokenizer = ...

# pdf_image_extractor = PDFExtractor(device, model, processor, tokenizer)
# pdf_image_extractor.extract_images("path/to/pdf", "output/directory")
# image_features = pdf_image_extractor.embed_image("path/to/image")
# text_features = pdf_image_extractor.embed_text("some text")







# def extract_images(pdf_path, output_directory_path):
#   if not os.path.exists(output_directory_path):
#     os.makedirs(output_directory_path)
#   pdf_document = fitz.open(pdf_path)
#   for page_index in range(len(pdf_document)):
#     page = pdf_document.load_page(page_index)
#     image_list = page.get_images(full=True)

#     for image_index, img in enumerate(image_list, start=1):
#         xref = img[0]
#         base_image = pdf_document.extract_image(xref)
#         image_bytes = base_image["image"]
#         image_ext = base_image["ext"]
#         image_path = f"{output_directory_path}/image_{page_index + 1}_{image_index + 1}.{image_ext}"
#         image = Image.open(io.BytesIO(image_bytes))
#         image.save(image_path)

# def embed_image(image_path):
#   image = Image.open(image_path)
#   inputs = processor(images=image, return_tensors="pt").to(device)
#   with torch.no_grad():
#       image_features = model.get_image_features(**inputs)
#   image_features_normalized = image_features / image_features.norm(dim=-1, keepdim=True)
#   image_features_normalized = image_features_normalized.cpu().numpy()
#   return image_features_normalized

# def embed_text(text):
#   inputs = tokenizer([text], return_tensors="pt").to(device)
#   with torch.no_grad():
#       text_features = model.get_text_features(**inputs)
#   text_features_normalized = text_features / text_features.norm(dim=-1, keepdim=True)
#   text_features_normalized = text_features_normalized.cpu().numpy()
#   return text_features_normalized