from TTS.api import TTS
# import torch

# device = "cuda" if torch.cuda.is_available() else "cpu"
tts=TTS("tts_models/multilingual/multi-dataset/xtts_v2").to("cpu")

tts.tts_to_file(text="Hello, world!", 
                speaker_wav="og_sound.wav",
                file_path="output.wav",
                language="en",
                split_sentences=True,
                )