import cv2
import face_recognition
import numpy as np
import os

# Directory containing images of faces
image_dir = '../server/uploads/'

# Prepare data
encodings = []
names = []

# Supported image extensions (case-insensitive)
image_extensions = ('.jpg', '.jpeg', '.png', '.bmp', '.gif', '.webp')

for file in os.listdir(image_dir):
    file_lower = file.lower()
    
    # Check if it's a valid image file by extension OR try to load files without extension
    is_image_by_ext = file_lower.endswith(image_extensions)
    has_no_extension = '.' not in file
    
    if is_image_by_ext or has_no_extension:
        try:
            image_path = os.path.join(image_dir, file)
            image = face_recognition.load_image_file(image_path)
            face_encodings_list = face_recognition.face_encodings(image)
            
            if len(face_encodings_list) > 0:
                encoding = face_encodings_list[0]
                # Get name from filename (without extension)
                name = os.path.splitext(file)[0]
                encodings.append(encoding)
                names.append(name)
                print(f"Encoded: {name}")
            else:
                print(f"Warning: No face found in {file}")
        except Exception as e:
            # Skip files that can't be loaded as images
            print(f"Skipped {file}: {str(e)}")
            continue

# Save encodings to the current directory (when run from ai folder)
np.savez('./encodings.npz', encodings=encodings, names=names)
print(f"Encodings saved! Total: {len(names)} faces")
