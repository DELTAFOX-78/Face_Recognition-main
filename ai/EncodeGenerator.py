import cv2
import face_recognition
import numpy as np
import os

# Directory containing images of faces
image_dir = '../uploads/'

# Prepare data
encodings = []
names = []

for file in os.listdir(image_dir):
    if file.endswith('.jpg') or file.endswith('.png'):
        name = os.path.splitext(file)[0]
        image_path = os.path.join(image_dir, file)
        image = face_recognition.load_image_file(image_path)
        encoding = face_recognition.face_encodings(image)[0]
        encodings.append(encoding)
        names.append(name)

# Save encodings to a file
np.savez('ai/encodings.npz', encodings=encodings, names=names)
print("Encodings saved!")
