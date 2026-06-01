from gradio_client import Client, handle_file
import httpx
import shutil
import os

HF_TOKEN = ""       #hugging Face API Key #model: IDM-VTON

print("Connecting...")
client = Client(
    "yisol/IDM-VTON",
    headers={"Authorization": f"Bearer {HF_TOKEN}"},
    httpx_kwargs={"timeout": 300}  # 5 minutes timeout
)

print("Running try-on... (60-90 seconds)")
result = client.predict(
    dict={"background": handle_file("person.jpg"), "layers": [], "composite": None},
    garm_img=handle_file("shirt.jpg"),
    garment_des="red casual t-shirt",
    is_checked=True,
    is_checked_crop=False,
    denoise_steps=30,
    seed=42,
    api_name="/tryon"
)

print(f"Result: {result}")
shutil.copy(result[0], "tryon_result.jpg")
print("Saved: tryon_result.jpg")

from PIL import Image
Image.open("tryon_result.jpg").show()