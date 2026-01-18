#

import cv2
import face_recognition
import numpy as np
import sqlite3
from datetime import datetime
from ultralytics import YOLO
import cvzone
import math
import time
import os
import torch


# Database connection
# def mark_attendance(name):
#     conn = sqlite3.connect('attendance.db')
#     c = conn.cursor()
#     c.execute('''CREATE TABLE IF NOT EXISTS attendance (name TEXT, date_time TEXT)''')
#     now = datetime.now()
#     timestamp = now.strftime('%Y-%m-%d %H:%M:%S')
#     c.execute("INSERT INTO attendance (name, date_time) VALUES (?, ?)", (name, timestamp))
#     conn.commit()
#     conn.close()


# Load encoded faces and names
data = np.load('./encodings.npz')
known_face_encodings = data['encodings']
known_face_names = data['names']

marked_attendance = {}  # Track detections per student
attendance_marked = set()  # Track students whose attendance is already marked
DETECTION_THRESHOLD = 5  # Number of consecutive detections needed
CONFIDENCE_THRESHOLD = 0.7  # Minimum confidence for detection 


# Load custom background for camera feed
background_img = cv2.imread('./background.png')
if background_img is None:
    print("Error: Unable to load background image. Check file path.")
    exit()
bg_height, bg_width, _ = background_img.shape


# Camera feed dimensions
cam_width, cam_height = 625, 433  # Updated dimensions


# Initialize YOLO model for anti-spoofing
model = YOLO("./models/best.pt")
# results = model.predict(source=0, device='cuda:0', stream=True)
# results = model.predict(source=0)
classNames = {0: "Fake", 1: "Real"}


# Initialize webcam
cap = cv2.VideoCapture(0)  # Use DirectShow backend for Windows
# if not cap.isOpened():
#     print("Error: Unable to access webcam. Ensure it's connected and not in use by another app.")
#     exit()


cap.set(3, 1280)
cap.set(4, 720)


# Initialize time tracking for FPS
prev_frame_time = 0
new_frame_time = 0

#create an empty dictionary


while True:
    new_frame_time = time.time()
    ret, frame = cap.read()
    if not ret:
        print("Error: Unable to read frame from webcam.")
        break


    # Resize frame for faster processing
    small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)


    # Detect faces and compare with known faces
    face_locations = face_recognition.face_locations(small_frame)
    face_encodings = face_recognition.face_encodings(small_frame, face_locations)


    for face_encoding, face_location in zip(face_encodings, face_locations):
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        name = "Unknown"
        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)


        if matches:
            best_match_index = np.argmin(face_distances)
            if matches[best_match_index]:
                name = known_face_names[best_match_index]


        # Mark attendance if identified
        # if name != "Unknown":
        #     # mark_attendance(name)
        #     print("Attendance marked for",name)


        # Draw a rectangle around the face
        top, right, bottom, left = [v * 4 for v in face_location]
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.putText(frame, name, (left, top - 40), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)


    # YOLO Anti-spoofing detection
    results = model(frame, stream=True, verbose=False)
    for r in results:
        boxes = r.boxes
        for box in boxes:
            # Bounding Box
            x1, y1, x2, y2 = box.xyxy[0]
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
            w, h = x2 - x1, y2 - y1
            cvzone.cornerRect(frame, (x1, y1, w, h))


            # Confidence
            conf = math.ceil((box.conf[0] * 100)) / 100
            # Class Name (Fake or Real)
            cls = int(box.cls[0])
            cvzone.putTextRect(frame, f'{classNames[cls]} {conf}', (max(0, x1), max(35, y1)), scale=2, thickness=2)
            if cls == 1 and name != "Unknown":
                if name not in marked_attendance:
                    marked_attendance[name] = 1
                else:
                    marked_attendance[name] += 1
        
        # Mark attendance after consecutive detections
                    if marked_attendance[name] >= DETECTION_THRESHOLD and name not in attendance_marked:
                        print(name)  # Send to Node.js for DB update
                        attendance_marked.add(name)  # Prevent duplicate marking
            else:
    # Reset counter if detection fails or confidence is low
                if (name or 'unknown') in marked_attendance:
                    marked_attendance[name] = 0
                


    # Calculate FPS
    # fps = 120 / (new_frame_time - prev_frame_time)
    # prev_frame_time = new_frame_time
    # # print(f"FPS: {fps:.2f}")


    # Resize camera frame
    resized_frame = cv2.resize(frame, (cam_width, cam_height))


    # Overlay background
    blended_frame = cv2.addWeighted(background_img, 0.3, background_img, 0.7, 0)


    # Show the main display with background
    cv2.namedWindow("Attendance System", cv2.WINDOW_NORMAL)
    cv2.imshow('Attendance System', resized_frame)


    if cv2.waitKey(1) & 0xFF == ord('q'):
        break


cap.release()
cv2.destroyAllWindows()
