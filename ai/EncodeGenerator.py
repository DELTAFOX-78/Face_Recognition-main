import cv2
import face_recognition
import numpy as np
import os
import sys

# Get absolute base directory (this file's folder)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Absolute paths
image_dir = os.path.join(BASE_DIR, "../uploads")
output_file = os.path.join(BASE_DIR, "encodings.npz")

# Prepare data
encodings = []
names = []

if not os.path.exists(image_dir):
    print(f"ERROR: Uploads folder not found: {image_dir}", file=sys.stderr)
    sys.exit(1)

print(f"Processing images from: {image_dir}", file=sys.stderr)

for file in os.listdir(image_dir):
    if file.lower().endswith((".jpg", ".png", ".jpeg")):
        name = os.path.splitext(file)[0]
        image_path = os.path.join(image_dir, file)

        try:
            # Use face_recognition's loader (automatically handles RGB)
            image = face_recognition.load_image_file(image_path)
            face_encs = face_recognition.face_encodings(image)

            if len(face_encs) == 0:
                print(f"[WARNING] No face found in {file}", file=sys.stderr)
                continue

            encodings.append(face_encs[0])
            names.append(name)
            print(f"[SUCCESS] Encoded face for: {name}", file=sys.stderr)
            
        except Exception as e:
            print(f"[ERROR] Failed to process {file}: {str(e)}", file=sys.stderr)
            continue

if len(encodings) == 0:
    print("ERROR: No faces were successfully encoded!", file=sys.stderr)
    sys.exit(1)

# Save encodings
np.savez(output_file, encodings=encodings, names=names)
print(f"✅ SUCCESS: Encodings saved at: {output_file}")
print(f"📊 Total faces encoded: {len(names)}")
sys.exit(0)