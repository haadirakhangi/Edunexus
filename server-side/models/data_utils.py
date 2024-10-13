import os
from PIL import Image
import fitz
import io
import torch

class PdfUtils:
    @staticmethod
    def extract_images_from_directory(documents_directory, output_directory_path):
        if not os.path.exists(output_directory_path):
            os.makedirs(output_directory_path)

        for filename in os.listdir(documents_directory):
            if filename.endswith(".pdf"):
                pdf_path = os.path.join(documents_directory, filename)
                pdf_document = fitz.open(pdf_path)
                
                pdf_output_directory = os.path.join(output_directory_path, os.path.splitext(filename)[0])
                if not os.path.exists(pdf_output_directory):
                    os.makedirs(pdf_output_directory)

                for page_index in range(len(pdf_document)):
                    page = pdf_document.load_page(page_index)
                    image_list = page.get_images(full=True)

                    for image_index, img in enumerate(image_list, start=1):
                        xref = img[0]
                        base_image = pdf_document.extract_image(xref)
                        image_bytes = base_image["image"]
                        image_ext = base_image["ext"]
                        image_path = f"{pdf_output_directory}/image_{page_index + 1}_{image_index}.{image_ext}"
                        image = Image.open(io.BytesIO(image_bytes))
                        image.save(image_path)

        print(f"Images extracted from all PDFs in {documents_directory} and saved to {output_directory_path}")


    @staticmethod
    def embed_image_with_clip(image_path, clip_model, clip_processor, device_type="cpu"):
        image = Image.open(image_path)
        inputs = clip_processor(images=image, return_tensors="pt").to(device_type)
        with torch.no_grad():
            image_features = clip_model.get_image_features(**inputs)
        image_features_normalized = image_features / image_features.norm(dim=-1, keepdim=True)
        image_features_normalized = image_features_normalized.cpu().numpy()
        return image_features_normalized

    @staticmethod
    def embed_text_with_clip(text, clip_model, clip_tokenizer, device_type="cpu"):
        inputs = clip_tokenizer([text], return_tensors="pt").to(device_type)
        with torch.no_grad():
            text_features = clip_model.get_text_features(**inputs)
        text_features_normalized = text_features / text_features.norm(dim=-1, keepdim=True)
        text_features_normalized = text_features_normalized.cpu().numpy()
        return text_features_normalized