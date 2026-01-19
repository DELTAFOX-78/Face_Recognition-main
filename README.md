# 🎓 AI-Powered Automatic Attendance System

An intelligent, automated attendance management system that leverages face recognition technology and anti-spoofing detection to streamline attendance tracking for educational institutions.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![Python](https://img.shields.io/badge/python-%3E%3D3.9-blue)
![React](https://img.shields.io/badge/react-18.3.1-61dafb)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🔐 Authentication & Authorization
- Secure login system for teachers and students
- JWT-based authentication
- Role-based access control (Teacher/Student)

### 👤 Face Recognition Attendance
- **Real-time face detection** using OpenCV and face_recognition library
- **Anti-spoofing detection** powered by YOLO model to prevent photo/video fraud
- **Automated attendance marking** with confidence threshold
- **Live video feed** with visual feedback for recognition status
- Section-based attendance filtering (Class, Branch, Section)

### 📊 Student Management
- Multi-teacher enrollment system (students can be enrolled with multiple teachers)
- Enrollment-based student tracking
- Student profile management with photo uploads
- Bulk student import capability

### 📈 Attendance Analytics
- Real-time attendance tracking dashboard
- Date-wise and subject-wise attendance reports
- **Automated Excel report generation** with customizable filters
- **Scheduled attendance reports** via cron jobs
- Attendance statistics and visualizations

### 📝 Quiz & Assessment Module (QuizCrafter)
- AI-powered quiz generation using Google Gemini API
- Manual quiz creation with customizable questions
- Multiple-choice quiz support
- Student quiz submission and grading
- Quiz results and analytics
- PDF text extraction for quiz generation

### 📢 Announcements & Communication
- Teacher-to-student announcements
- Real-time chat system using Socket.IO
- Branch/Class/Section-specific announcements
- Notification system

### 📅 Additional Features
- Automated daily attendance report scheduling
- Export attendance data to Excel
- Beautiful, responsive UI with Framer Motion animations
- Dark mode support via Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API calls
- **Socket.IO Client** for real-time communication
- **Zustand** for state management
- **React Webcam** for camera access
- **ExcelJS** for report generation

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.IO** for WebSocket communication
- **JWT** for authentication
- **Multer** for file uploads
- **Node-cron** for scheduled tasks
- **Bcrypt** for password hashing

### AI & Machine Learning
- **Python 3.9+**
- **OpenCV** (cv2) for computer vision
- **face_recognition** library for facial recognition
- **YOLO (Ultralytics)** for anti-spoofing detection
- **NumPy** for numerical operations
- **Google Gemini API** for AI-powered quiz generation

### QuizCrafter Module
- **FastAPI** (Python backend)
- **React** with Vite (Frontend)
- **MongoDB** for quiz storage
- **PDF parsing** for text extraction

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (React + TypeScript)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Teacher    │  │   Student    │  │  QuizCrafter │     │
│  │  Dashboard   │  │  Dashboard   │  │    Module    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Node.js + Express)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │     Auth     │  │  Attendance  │  │     Quiz     │     │
│  │   Service    │  │   Service    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              AI Engine (Python + OpenCV)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │     Face     │  │    YOLO      │  │    Gemini    │     │
│  │ Recognition  │  │Anti-Spoofing │  │  Quiz Gen    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Database (MongoDB)                       │
│    Students | Teachers | Attendance | Quizzes | Chats      │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
- **Python** (v3.9 or higher)
- **MongoDB** (v4.4 or higher)
- **Webcam** for face recognition
- **Git** for version control

### Python Dependencies
- OpenCV (`cv2`)
- face_recognition
- ultralytics (YOLO)
- numpy
- FastAPI (for QuizCrafter)
- uvicorn

### Hardware Requirements
- Webcam (minimum 720p recommended)
- Minimum 4GB RAM
- GPU recommended for faster YOLO inference (optional)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/DELTAFOX-78/Face_Recognition-main.git
cd Face_Recognition-main
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### 4. Set Up Python Environment
```bash
cd ai
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

# Install Python dependencies
pip install opencv-python face_recognition ultralytics numpy torch
cd ..
```

### 5. Set Up QuizCrafter Module
```bash
cd QuizCrafter/backend
pip install -r requirements.txt

cd ../frontend
npm install
cd ../..
```

### 6. Download YOLO Model
- Place the YOLO anti-spoofing model (`best.pt`) in the `ai/models/` directory
- Ensure you have the trained face encodings in `ai/encodings.npz`

### 7. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/attendance_system

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=3000
CLIENT_URL=http://localhost:5173

# Google Gemini API (for Quiz Generation)
GEMINI_API_KEY=your_gemini_api_key_here
```

Create a `.env` file in the `server/` directory with the same content.

## ⚙️ Configuration

### Generate Face Encodings

Before using the face recognition system, you need to generate encodings for registered students:

1. Place student photos in the designated folder (ensure proper naming convention)
2. Run the encoding generator:

```bash
cd ai
python EncodeGenerator.py
```

This will create an `encodings.npz` file containing face encodings.

## 🎯 Usage

### Start the Application

You need to run multiple services simultaneously:

#### 1. Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

#### 2. Start Backend Server
```bash
cd server
node index.js
```

#### 3. Start Frontend Development Server
```bash
# In the root directory
npm run dev
```

#### 4. Start QuizCrafter Backend (Optional)
```bash
cd QuizCrafter/backend
uvicorn main:app --reload
```

#### 5. Start QuizCrafter Frontend (Optional)
```bash
cd QuizCrafter/frontend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **QuizCrafter Backend**: http://localhost:8000
- **QuizCrafter Frontend**: http://localhost:5174

### Default Access

#### Teacher Login
- Create a teacher account through the registration page
- Login to access teacher dashboard
- Features: Start attendance, view reports, manage students, create quizzes

#### Student Login
- Students are registered by teachers
- Use provided credentials to login
- Features: View attendance, take quizzes, receive announcements

## 📁 Project Structure

```
Face_Recognition-main/
├── ai/                           # Python AI module
│   ├── main.py                  # Face recognition script
│   ├── EncodeGenerator.py       # Generate face encodings
│   ├── generate_quiz.py         # AI quiz generation
│   ├── encodings.npz            # Stored face encodings
│   ├── models/                  # YOLO anti-spoofing model
│   └── background.png           # UI background for camera feed
│
├── server/                       # Node.js backend
│   ├── index.js                 # Express server entry point
│   ├── controllers/             # Route controllers
│   ├── models/                  # MongoDB schemas
│   │   ├── Student.js
│   │   ├── Teacher.js
│   │   ├── Enrollment.js
│   │   ├── Quiz.js
│   │   ├── Announcement.js
│   │   └── Chat.js
│   ├── routes/                  # API routes
│   ├── middleware/              # Auth & Socket middleware
│   ├── services/                # Business logic
│   ├── utils/                   # Helper functions
│   ├── cron/                    # Scheduled tasks
│   ├── uploads/                 # Student photos
│   └── reports/                 # Generated Excel reports
│
├── src/                          # React frontend
│   ├── components/              # Reusable components
│   ├── pages/                   # Page components
│   │   ├── teacher/             # Teacher pages
│   │   └── student/             # Student pages
│   ├── services/                # API services
│   ├── stores/                  # Zustand stores
│   ├── types/                   # TypeScript types
│   ├── utils/                   # Utility functions
│   ├── routes/                  # Route definitions
│   └── App.tsx                  # Main app component
│
├── QuizCrafter/                 # Quiz generation module
│   ├── backend/                 # FastAPI backend
│   │   ├── main.py
│   │   └── requirements.txt
│   └── frontend/                # React frontend
│       └── src/
│
├── package.json                 # Frontend dependencies
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
└── tsconfig.json               # TypeScript config
```

## 📡 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new teacher account
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### POST `/api/auth/login`
Login for teachers and students
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Attendance Endpoints

#### POST `/api/teacher/start-attendance`
Start attendance session for a specific class/section

#### POST `/api/teacher/stop-attendance`
Stop ongoing attendance session

#### GET `/api/attendance/report`
Generate attendance report with filters (date, branch, class, section)

### Student Management

#### POST `/api/teacher/add-student`
Add a new student with enrollment details

#### GET `/api/teacher/students`
Get all students for the logged-in teacher

#### PUT `/api/teacher/update-student/:id`
Update student information

#### DELETE `/api/teacher/delete-student/:id`
Delete a student

### Quiz Endpoints

#### POST `/api/quiz/create`
Create a new quiz (manual or AI-generated)

#### POST `/api/quiz/publish/:id`
Publish a quiz to students

#### POST `/api/quiz/submit`
Submit quiz answers

#### GET `/api/quiz/student/:studentId`
Get all quizzes for a student

### Announcement Endpoints

#### POST `/api/announcement/create`
Create a new announcement

#### GET `/api/announcement/student`
Get announcements for a student

## 🔒 Security Features

- **Password Hashing**: Bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Anti-Spoofing**: YOLO model prevents photo/video fraud
- **Confidence Threshold**: Multiple consecutive detections required
- **Role-Based Access**: Separate teacher and student permissions

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**DELTAFOX-78**

- GitHub: [@DELTAFOX-78](https://github.com/DELTAFOX-78)

## 🙏 Acknowledgments

- **face_recognition** library by Adam Geitgey
- **Ultralytics YOLO** for anti-spoofing detection
- **Google Gemini API** for AI-powered quiz generation
- **OpenCV** community for computer vision tools

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the repository owner.

---

<div align="center">
  <strong>⭐ If you find this project useful, please consider giving it a star! ⭐</strong>
</div>
