# 🎓 AI-Powered Automatic Attendance System

<div align="center">

An intelligent, automated attendance management system that leverages **face recognition technology** and **anti-spoofing detection** to streamline attendance tracking for educational institutions.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![Python](https://img.shields.io/badge/python-%3E%3D3.9-blue)
![React](https://img.shields.io/badge/react-18.3.1-61dafb)
![MongoDB](https://img.shields.io/badge/mongodb-8.1.3-47A248)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [System Architecture](#️-system-architecture)
- [Screenshots](#-screenshots)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Security Features](#-security-features)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Secure login system** for teachers and students
- **JWT-based authentication** with token refresh
- **Role-based access control** (Teacher/Student)
- Password hashing with Bcrypt

### 👤 Face Recognition Attendance
- **Real-time face detection** using OpenCV and face_recognition library
- **Anti-spoofing detection** powered by YOLO model to prevent photo/video fraud
- **Automated attendance marking** with confidence threshold (5 consecutive detections required)
- **Live video feed** with visual feedback for recognition status
- **Section-based attendance filtering** (Branch, Class, Section)
- **Activity logging** with real-time status updates

### 📊 Multi-Teacher Enrollment System
- Students can be enrolled with **multiple teachers** across different subjects
- **Enrollment-based student tracking** for accurate management
- Student profile management with photo uploads
- Independent associations per teacher (no data overwrites)

### 📈 Attendance Analytics & Reporting
- **Real-time attendance tracking dashboard**
- Date-wise and subject-wise attendance reports
- **Automated Excel report generation** with customizable filters (Date, Branch, Class, Section)
- **Scheduled attendance reports** via cron jobs
- Attendance statistics and visualizations

### 📝 Quiz & Assessment Module (QuizCrafter)
- **AI-powered quiz generation** using Google Gemini API
- **Configurable question count** set by teachers
- Manual quiz creation with customizable questions
- Multiple-choice quiz support
- Student quiz submission and automatic grading
- **Quiz results with answer review** showing correct answers
- PDF text extraction for quiz generation
- Quiz publishing to specific branches/classes/sections

### 📢 Announcements & Communication
- **Teacher-to-student announcements**
- Real-time chat system using **Socket.IO**
- Branch/Class/Section-specific announcements
- Notification system for students

### 📅 Additional Features
- Automated daily attendance report scheduling
- Export attendance data to Excel
- Beautiful, responsive UI with **Framer Motion** animations
- Dark mode support via Tailwind CSS
- Student dashboard with personal attendance statistics

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18.3.1** | UI Framework with TypeScript |
| **Vite** | Fast development and building |
| **Tailwind CSS** | Styling and dark mode |
| **Framer Motion** | Smooth animations |
| **React Router** | Navigation |
| **Axios** | API calls |
| **Socket.IO Client** | Real-time communication |
| **Zustand** | State management |
| **React Webcam** | Camera access |
| **ExcelJS** | Report generation |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **MongoDB** | Database with Mongoose ODM |
| **Socket.IO** | WebSocket communication |
| **JWT** | Authentication |
| **Multer** | File uploads |
| **Node-cron** | Scheduled tasks |
| **Bcrypt** | Password hashing |

### AI & Machine Learning
| Technology | Purpose |
|------------|---------|
| **Python 3.9+** | AI processing |
| **OpenCV (cv2)** | Computer vision |
| **face_recognition** | Facial recognition |
| **YOLO (Ultralytics)** | Anti-spoofing detection |
| **NumPy** | Numerical operations |
| **Google Gemini API** | AI-powered quiz generation |

### QuizCrafter Module
| Technology | Purpose |
|------------|---------|
| **FastAPI** | Python backend |
| **LangChain** | AI orchestration |
| **PyMuPDF** | PDF parsing |
| **React + Vite** | Frontend |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Client (React + TypeScript)                  │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │
│  │    Teacher    │  │    Student    │  │   QuizCrafter │       │
│  │   Dashboard   │  │   Dashboard   │  │     Module    │       │
│  │  • Attendance │  │  • View Stats │  │  • AI Quizzes │       │
│  │  • Students   │  │  • Take Quiz  │  │  • PDF Upload │       │
│  │  • Quizzes    │  │  • Announce.  │  └───────────────┘       │
│  └───────────────┘  └───────────────┘                          │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP / WebSocket
┌────────────────────────────▼────────────────────────────────────┐
│                  Backend (Node.js + Express)                    │
│  ┌──────────┐  ┌──────────────┐  ┌─────────┐  ┌───────────┐    │
│  │   Auth   │  │  Attendance  │  │  Quiz   │  │ Announce. │    │
│  │ Service  │  │   Service    │  │ Service │  │  Service  │    │
│  └──────────┘  └──────────────┘  └─────────┘  └───────────┘    │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│              AI Engine (Python + OpenCV)                        │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │
│  │     Face      │  │     YOLO      │  │    Gemini     │       │
│  │  Recognition  │  │ Anti-Spoofing │  │   Quiz Gen    │       │
│  │  • Encodings  │  │  • Fake/Real  │  │  • AI MCQs    │       │
│  └───────────────┘  └───────────────┘  └───────────────┘       │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    Database (MongoDB)                           │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐ ┌───────────────────┐│
│  │ Students │ │ Teachers │ │ Enrollment │ │ Quizzes/Announce. ││
│  └──────────┘ └──────────┘ └────────────┘ └───────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## 📸 Screenshots

> Add screenshots of your application here for better documentation.

<!-- 
Example:
![Login Page](./screenshots/login.png)
![Teacher Dashboard](./screenshots/teacher-dashboard.png)
![Face Recognition](./screenshots/face-recognition.png)
-->

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version |
|-------------|---------|
| **Node.js** | v16.0.0 or higher |
| **Python** | v3.9 or higher |
| **MongoDB** | v4.4 or higher |
| **Git** | Latest |
| **Webcam** | Minimum 720p |

### Hardware Requirements
- **Webcam**: Minimum 720p recommended
- **RAM**: Minimum 4GB (8GB recommended)
- **GPU**: Optional (for faster YOLO inference)

---

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

### 3. Set Up Python Environment
```bash
cd ai
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate

# Install Python dependencies
pip install opencv-python face_recognition ultralytics numpy torch cvzone

cd ..
```

### 4. Set Up QuizCrafter Module
```bash
cd QuizCrafter/backend
pip install -r requirements.txt

cd ../frontend
npm install
cd ../..
```

### 5. Download YOLO Model
- Place the YOLO anti-spoofing model (`best.pt`) in the `ai/models/` directory
- Ensure you have the trained face encodings in `ai/encodings.npz`

### 6. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB
VITE_MONGODB_URI=mongodb://localhost:27017/attendance_system

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Server Configuration
PORT=3000
CLIENT_URL=http://localhost:5173

# Google Gemini API (for Quiz Generation)
GEMINI_API_KEY=your_gemini_api_key_here
```

Create a `.env` file in the `server/` directory with similar configuration.

---

## ⚙️ Configuration

### Generate Face Encodings

Before using the face recognition system, generate encodings for registered students:

1. Add student photos through the teacher dashboard (photo upload during student registration)
2. Run the encoding generator:

```bash
cd ai
python EncodeGenerator.py
```

This creates an `encodings.npz` file containing face encodings for all registered students.

---

## 🎯 Usage

### Start All Services

You need to run multiple services simultaneously:

#### Terminal 1: MongoDB
```bash
mongod
```

#### Terminal 2: Backend Server
```bash
cd server
node index.js
```
> Server runs at http://localhost:3000

#### Terminal 3: Frontend Development Server
```bash
npm run dev
```
> Frontend runs at http://localhost:5173

#### Terminal 4: QuizCrafter Backend (Optional)
```bash
cd QuizCrafter/backend
uvicorn main:app --reload
```
> QuizCrafter API runs at http://localhost:8000

#### Terminal 5: QuizCrafter Frontend (Optional)
```bash
cd QuizCrafter/frontend
npm run dev
```
> QuizCrafter UI runs at http://localhost:5174

### Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| QuizCrafter Backend | http://localhost:8000 |
| QuizCrafter Frontend | http://localhost:5174 |

### User Workflows

#### 👩‍🏫 Teacher Workflow
1. **Register/Login** through the teacher portal
2. **Add Students** with photos (Branch, Class, Section, Subject)
3. **Start Attendance** - Select class, branch, section to begin face recognition
4. **View Reports** - Download Excel reports with date/branch/class filters
5. **Create Quizzes** - Manually or using AI (Gemini) with PDF uploads
6. **Publish Announcements** - Send messages to specific student groups

#### 👨‍🎓 Student Workflow
1. **Login** with credentials provided by teacher
2. **View Dashboard** - Check personal attendance statistics
3. **Take Quizzes** - Attempt published quizzes
4. **View Results** - See quiz scores and correct answers
5. **Read Announcements** - Get updates from teachers

---

## 📁 Project Structure

```
Face_Recognition-main/
├── 📂 ai/                           # Python AI module
│   ├── main.py                      # Face recognition + anti-spoofing script
│   ├── EncodeGenerator.py           # Generate face encodings
│   ├── generate_quiz.py             # AI quiz generation helper
│   ├── encodings.npz                # Stored face encodings
│   ├── background.png               # UI background for camera feed
│   └── 📂 models/
│       └── best.pt                  # YOLO anti-spoofing model
│
├── 📂 server/                        # Node.js backend
│   ├── index.js                     # Express server entry point
│   ├── 📂 controllers/
│   │   ├── teacher.controller.js    # Student/Attendance management
│   │   ├── auth.controller.js       # Authentication logic
│   │   ├── quizController.js        # Quiz CRUD operations
│   │   ├── announcement.controller.js # Announcements
│   │   └── ...
│   ├── 📂 models/
│   │   ├── Student.js               # Student schema
│   │   ├── Teacher.js               # Teacher schema
│   │   ├── Enrollment.js            # Multi-teacher enrollment
│   │   ├── Quiz.js                  # Quiz schema
│   │   ├── QuizSubmission.js        # Quiz answers
│   │   ├── Announcement.js          # Announcements
│   │   └── Chat.js                  # Chat messages
│   ├── 📂 routes/                   # API route definitions
│   ├── 📂 middleware/               # Auth & Socket middleware
│   ├── 📂 services/                 # Business logic
│   ├── 📂 utils/                    # Helper functions
│   ├── 📂 cron/                     # Scheduled tasks
│   └── 📂 uploads/                  # Student photos
│
├── 📂 src/                           # React frontend
│   ├── App.tsx                      # Main app component
│   ├── 📂 components/               # Reusable UI components
│   ├── 📂 pages/
│   │   ├── LandingPage.tsx          # Home page
│   │   ├── 📂 teacher/
│   │   │   ├── TeacherDashboard.tsx
│   │   │   ├── MarkAttendance.tsx   # Face recognition UI
│   │   │   ├── AddStudent.tsx
│   │   │   ├── ViewStudents.tsx
│   │   │   ├── CreateQuiz.tsx
│   │   │   ├── QuizSubmissions.tsx
│   │   │   └── TeacherAnnouncements.tsx
│   │   └── 📂 student/
│   │       ├── StudentDashboard.tsx
│   │       ├── StudentQuizList.tsx
│   │       ├── TakeQuiz.tsx
│   │       ├── QuizResult.tsx
│   │       └── StudentAnnouncements.tsx
│   ├── 📂 services/                 # API service functions
│   ├── 📂 stores/                   # Zustand state stores
│   ├── 📂 types/                    # TypeScript types
│   └── 📂 utils/                    # Utility functions
│
├── 📂 QuizCrafter/                   # AI Quiz generation module
│   ├── 📂 backend/
│   │   ├── main.py                  # FastAPI server
│   │   └── requirements.txt         # Python dependencies
│   └── 📂 frontend/
│       └── src/                     # React frontend
│
├── package.json                     # Frontend dependencies
├── vite.config.ts                   # Vite configuration
├── tailwind.config.js               # Tailwind CSS config
├── tsconfig.json                    # TypeScript config
└── README.md                        # This file
```

---

## 📡 API Documentation

### Authentication Endpoints

#### `POST /api/auth/register`
Register a new teacher account
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### `POST /api/auth/login`
Login for teachers and students
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

### Attendance Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/teacher/start-attendance` | Start attendance session |
| `POST` | `/api/teacher/stop-attendance` | Stop ongoing session |
| `GET` | `/api/attendance/report` | Generate filtered report |

### Student Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/teacher/add-student` | Add student with enrollment |
| `GET` | `/api/teacher/students` | Get all teacher's students |
| `PUT` | `/api/teacher/update-student/:id` | Update student info |
| `DELETE` | `/api/teacher/delete-student/:id` | Delete student |
| `GET` | `/api/teacher/classes` | Get teacher's classes |
| `GET` | `/api/teacher/branch-class-section` | Get enrollment details |

### Quiz Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/quiz/create` | Create quiz (manual/AI) |
| `POST` | `/api/quiz/publish/:id` | Publish to students |
| `POST` | `/api/quiz/submit` | Submit quiz answers |
| `GET` | `/api/quiz/student/:studentId` | Get student's quizzes |

### Announcement Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/announcement/create` | Create announcement |
| `GET` | `/api/announcement/student` | Get student announcements |

---

## 🔒 Security Features

| Feature | Description |
|---------|-------------|
| **Password Hashing** | Bcrypt for secure password storage |
| **JWT Authentication** | Secure token-based authentication |
| **Anti-Spoofing** | YOLO model prevents photo/video fraud |
| **Confidence Threshold** | 5 consecutive detections required for attendance |
| **Role-Based Access** | Separate teacher and student permissions |
| **Enrollment Isolation** | Multi-teacher enrollments are independent |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a new branch (`git checkout -b feature/YourFeature`)
3. **Commit** your changes (`git commit -m 'Add some feature'`)
4. **Push** to the branch (`git push origin feature/YourFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation if needed

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**DELTAFOX-78**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/DELTAFOX-78)

---

## 🙏 Acknowledgments

- **[face_recognition](https://github.com/ageitgey/face_recognition)** library by Adam Geitgey
- **[Ultralytics YOLO](https://github.com/ultralytics/ultralytics)** for anti-spoofing detection
- **[Google Gemini API](https://ai.google.dev/)** for AI-powered quiz generation
- **[OpenCV](https://opencv.org/)** community for computer vision tools
- **[LangChain](https://www.langchain.com/)** for AI orchestration

---

## 📞 Support

For issues, questions, or suggestions:
- 📧 Open an issue on GitHub
- ⭐ Star this repo if you find it useful

---

<div align="center">
  <strong>⭐ If you find this project useful, please consider giving it a star! ⭐</strong>
  
  <br><br>
  
  Made with ❤️ for educational institutions
</div>
