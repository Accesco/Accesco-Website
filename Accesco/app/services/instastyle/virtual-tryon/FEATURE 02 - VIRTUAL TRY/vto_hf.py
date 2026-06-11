from gradio_client import Client, handle_file
from PIL import Image
from pillow_heif import register_heif_opener
import pillow_avif
import sys, shutil, os, time, traceback

#  Register extra format support for heif
register_heif_opener()

#  Args 
HF_TOKEN    = os.environ.get("HF_TOKEN", "")
person_path = sys.argv[1]
shirt_path  = sys.argv[2]
output_path = sys.argv[3]

#  Logging 
def log(tag: str, msg: str):
    print(f"[vto:{tag}] {msg}", flush=True)

def die(tag: str, msg: str, exc: Exception = None):
    print(f"[vto:{tag}] FATAL: {msg}", flush=True)
    if exc:
        traceback.print_exc()
    sys.exit(1)

#  Validate inputs 
log("init", f"person={person_path}  shirt={shirt_path}  output={output_path}")
log("init", f"HF_TOKEN={'set' if HF_TOKEN else 'NOT SET — unauthenticated'}")

for label, p in [("person", person_path), ("shirt", shirt_path)]:
    if not os.path.exists(p):
        die("init", f"{label} file not found: {p}")
    if os.path.getsize(p) == 0:
        die("init", f"{label} file is empty: {p}")
    log("init", f"{label} ok — {os.path.getsize(p)} bytes")

#  Normalize 
def normalize(src_path: str, label: str) -> str:
    t0 = time.time()

    try:
        img = Image.open(src_path)
        img.load()
    except Exception as e:
        die(label, f"could not open image: {e}", e)

    log(label, f"format={img.format}  mode={img.mode}  size={img.size}")

    # Already safe to send as-is
    if img.format in ("JPEG", "PNG") and img.mode == "RGB":
        log(label, "already sendable — skipping conversion")
        return src_path

    # Flatten transparency to white
    if img.mode in ("RGBA", "LA", "PA"):
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.getchannel("A"))
        img = bg
    elif img.mode == "P":
        img = img.convert("RGBA")
        bg  = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.getchannel("A"))
        img = bg
    elif img.mode != "RGB":
        img = img.convert("RGB")  # handles CMYK, LAB, L, YCbCr, etc.

    out_path = os.path.splitext(src_path)[0] + "_norm.png"

    try:
        img.save(out_path, "PNG")
    except Exception as e:
        die(label, f"PNG save failed: {e}", e)

    log(label, f"converted png  {os.path.getsize(out_path)//1024}KB  ({time.time()-t0:.2f}s)")
    return out_path

#  Normalize both images 
person_path = normalize(person_path, "person")
shirt_path  = normalize(shirt_path,  "shirt")

#  Connect to model 
log("client", "connecting to IDM-VTON...")
t0 = time.time()

try:
    client = Client(
        "yisol/IDM-VTON",
        headers={"Authorization": f"Bearer {HF_TOKEN}"} if HF_TOKEN else {},
        httpx_kwargs={"timeout": 300}
    )
    log("client", f"connected ({time.time()-t0:.2f}s)")
except Exception as e:
    die("client", f"could not connect to IDM-VTON: {e}", e)

#  Run prediction 
log("predict", "sending to model...")
t0 = time.time()

try:
    result = client.predict(
        dict={
            "background": handle_file(person_path),
            "layers":     [],
            "composite":  None
        },
        garm_img=handle_file(shirt_path),
        garment_des="try on",
        is_checked=True,
        is_checked_crop=False,
        denoise_steps=30,
        seed=42,
        api_name="/tryon"
    )
except Exception as e:
    die("predict", f"model prediction failed: {e}", e)

log("predict", f"done ({time.time()-t0:.2f}s)")

#  Save result 
if not result or not result[0] or not os.path.exists(result[0]):
    die("output", f"model returned no output file. result={result}")

try:
    shutil.copy(result[0], output_path)
except Exception as e:
    die("output", f"could not copy result to {output_path}: {e}", e)

log("output", f"saved to {output_path}")
print(output_path)