# compress_images.py
import os
import sys
from pathlib import Path
from PIL import Image

INPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "raw_images")
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "compressed_images")

MAX_WIDTH = 800       
QUALITY = 82          
FORMAT = "WEBP"       

os.makedirs(OUTPUT_DIR, exist_ok=True)

for filename in os.listdir(INPUT_DIR):
    if not filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
        continue

    img = Image.open(os.path.join(INPUT_DIR, filename))

    # Convert RGBA → RGB (nếu PNG có transparency)
    if img.mode == "RGBA":
        img = img.convert("RGB")

    # Resize giữ tỉ lệ
    if img.width > MAX_WIDTH:
        ratio = MAX_WIDTH / img.width
        new_size = (MAX_WIDTH, int(img.height * ratio))
        img = img.resize(new_size, Image.LANCZOS)

    output_name = os.path.splitext(filename)[0] + ".webp"
    output_path = os.path.join(OUTPUT_DIR, output_name)
    img.save(output_path, FORMAT, quality=QUALITY)

    original_size = os.path.getsize(os.path.join(INPUT_DIR, filename))
    new_size = os.path.getsize(output_path)
    reduction = (1 - new_size / original_size) * 100

    print(f"{filename} → {output_name} | {original_size//1024}KB → {new_size//1024}KB ({reduction:.0f}% reduction)")

print(f"\nDone! Output: {OUTPUT_DIR}/")