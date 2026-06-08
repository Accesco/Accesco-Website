
from gradio_client import Client, handle_file
import sys
import shutil
import os

# Read token from environment variable (set HF_TOKEN in .env.local)
HF_TOKEN = os.environ.get("HF_TOKEN", "")

person_path = sys.argv[1]
shirt_path  = sys.argv[2]
output_path = sys.argv[3]

client = Client(
    "yisol/IDM-VTON",
    headers={"Authorization": f"Bearer {HF_TOKEN}"} if HF_TOKEN else {},
    httpx_kwargs={"timeout": 300}
)

result = client.predict(
    dict={
        "background": handle_file(person_path),
        "layers": [],
        "composite": None
    },
    garm_img=handle_file(shirt_path),
    garment_des="try on",
    is_checked=True,
    is_checked_crop=False,
    denoise_steps=30,
    seed=42,
    api_name="/tryon"
)

shutil.copy(result[0], output_path)
print(output_path)