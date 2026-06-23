import os
from google import genai
from google.genai import types
from PIL import Image

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

prompt = (
    "Create a 3D iOS Memoji-style avatar based on this reference photo. "
    "Preserve the person's real features: short dark curly/wavy hair, "
    "light-medium skin tone, rounded face, dark eyebrows, friendly slight smile. "
    "Apple Memoji aesthetic: smooth glossy 3D cartoon render, soft studio lighting, "
    "large expressive eyes, clean simplified stylized features, head and shoulders, "
    "wearing a navy suit with a tie. Plain soft light-gray studio background. "
    "Centered, suitable as a professional portfolio avatar."
)

src = Image.open(r"C:\Users\alexa\Downloads\1766812067706.jpg")

resp = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=[prompt, src],
    config=types.GenerateContentConfig(
        response_modalities=["TEXT", "IMAGE"],
    ),
)

out = r"C:\portfolio\public\avatar-memoji.jpg"
for part in resp.parts:
    if part.text:
        print("MODEL:", part.text)
    elif part.inline_data:
        part.as_image().save(out)
        print("SAVED:", out)
