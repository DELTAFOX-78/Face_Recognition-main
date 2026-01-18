# 📚 Student Face Recognition & Quiz System - Complete Project Context

## 🎯 Project Overview

A full-stack web application that combines **face recognition attendance tracking** with **AI-powered quiz generation**. Teachers can mark attendance using face recognition, manage students, create quizzes, and view analytics. Students can view their attendance, take quizzes, and access chat support.

**Tech Stack**: React + TypeScript (Frontend) | Node.js + Express (Backend) | Python (Face Recognition) | MongoDB (Database)

---

## 📁 Project Structure

```
Face_Recognition-main-master/
├── src/                           # React Frontend (TypeScript)
│   ├── components/
│   │   ├── auth/                 # Login forms & authentication UI
│   │   ├── attendance/           # Attendance charts & summaries
│   │   ├── chat/                 # Chat messaging components
│   │   ├── quiz/                 # Quiz creation & taking
│   │   ├── students/             # Student management
│   │   └── common/               # Shared UI components
│   ├── pages/
│   │   ├── student/              # Student dashboard, quiz, statistics
│   │   └── teacher/              # Teacher dashboard, attendance marking
│   ├── services/
│   │   ├── api.ts                # Axios interceptor & HTTP client
│   │   ├── authService.ts        # Login/logout logic
│   │   ├── attendanceService.ts  # Attendance API calls
│   │   └── quizService.ts        # Quiz CRUD operations
│   ├── stores/                   # Zustand state management
│   ├── types/                    # TypeScript interfaces
│   └── utils/                    # Helper functions
│
├── server/                        # Node.js/Express Backend
│   ├── controllers/
│   │   ├── auth.controller.js    # Token verification & refresh
│   │   ├── teacher.controller.js # Teacher operations (attendance, students)
│   │   ├── student.controller.js # Student operations
│   │   ├── attendanceController.js
│   │   ├── quizController.js     # Quiz CRUD
│   │   ├── chat.controller.js    # Messaging
│   │   └── pythonScripts.js      # Face recognition integration
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── teacher.routes.js
│   │   ├── student.routes.js
│   │   ├── quiz.routes.js
│   │   ├── chat.routes.js
│   │   └── attendanceRoutes.js
│   ├── models/
│   │   ├── Student.js            # Student schema
│   │   ├── Teacher.js            # Teacher schema
│   │   ├── Quiz.js               # Quiz schema
│   │   ├── QuizSubmission.js      # Student quiz responses
│   │   └── Chat.js               # Messages
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── socketMiddleware.js   # Socket.io integration
│   ├── services/
│   │   ├── attendanceService.js
│   │   ├── chatService.js
│   │   └── excelService.js
│   ├── utils/
│   │   ├── db.js                 # MongoDB connection
│   │   └── asyncHandler.js
│   ├── cron/
│   │   └── attendanceReport.js   # Daily report generation
│   ├── uploads/                  # User photos storage
│   └── index.js                  # Server entry point
│
├── ai/                            # Python Face Recognition
│   ├── main.py                   # Face recognition detection
│   ├── EncodeGenerator.py        # Generate face encodings
│   ├── generate_quiz.py          # AI quiz generation
│   ├── encodings.npz             # Pre-trained face encodings
│   ├── models/
│   │   └── best.pt               # YOLOv8 model for detection
│   └── requirements.txt
│
├── QuizCrafter/                   # AI Quiz Generation (Separate Module)
│   ├── backend/
│   │   ├── main.py               # FastAPI server
│   │   └── quiz_llm.py           # AI quiz generation logic
│   └── frontend/
│       └── src/
│
├── package.json                  # Node dependencies & scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite build configuration
├── tailwind.config.js            # Tailwind CSS
├── BACKEND_ANALYSIS.md           # Backend structure documentation
├── LOGIN_FIX_SUMMARY.md          # Login troubleshooting guide
├── PYTHON_SETUP_GUIDE.md         # Python environment setup
└── CREDENTIALS_STORAGE_GUIDE.md  # Database credential storage
```

---

## 🔐 Authentication & Security

### How Authentication Works

1. **User Credentials Storage**
   - Stored in MongoDB (collections: `teachers`, `students`)
   - Passwords hashed with **bcrypt** (never stored in plain text)
   - Example: `password123` → `$2a$10$mtoSA046cjAid1JAaHxtD.db0SAIMi4RIF3jCflmZSL/Klzgl8m5a`

2. **Login Flow**
   ```
   Frontend → POST /api/teacher/login {username, password}
   ↓
   Backend finds user by username
   ↓
   bcrypt.compare(password, hashedPassword)
   ↓
   If valid → Generate JWT token
   ↓
   Return {token, user: {id, name, ...}}
   ↓
   Frontend stores token in localStorage
   ↓
   Future requests include Authorization header with token
   ```

3. **Protected Routes**
   - All API routes require JWT token in header: `Authorization: Bearer <token>`
   - Middleware: `server/middleware/auth.js` validates tokens
   - Token expiration triggers auto-redirect to login

### Default Test Credentials
```
Teacher:
  Username: teacher1
  Password: password123

Student:
  Username: student1
  Password: password123
```

---

## 🎨 Frontend Architecture

### Key Technologies
- **React 18** with TypeScript
- **Vite** for fast dev server & builds
- **React Router v6** for navigation
- **Zustand** for state management
- **React Query** for server state & caching
- **Socket.io Client** for real-time chat
- **Tailwind CSS** + **Lucide React** icons
- **Framer Motion** for animations

### Component Organization

**Auth Components** (`src/components/auth/`)
- `LoginForm.tsx` - Unified login form (router directs to teacher/student)
- `LoginHeader.tsx` - Header with branding
- `FormField.tsx` - Reusable form input

**Dashboard Pages**
- **Teacher Dashboard** (`src/pages/teacher/TeacherDashboard.tsx`)
  - View all students
  - Mark attendance (face recognition)
  - Create & manage quizzes
  - View student submissions
  - Analytics & reports

- **Student Dashboard** (`src/pages/student/StudentDashboard.tsx`)
  - View attendance records
  - Take quizzes
  - View quiz history & results
  - Access chat support
  - View statistics

**Attendance Components**
- `AttendanceChart.tsx` - Visualize attendance trends
- `AttendanceSummary.tsx` - Summary statistics
- `DateRangeModal.tsx` - Filter by date range

**Quiz Components**
- `QuizForm.tsx` - Create quiz with questions
- `QuizCard.tsx` - Display quiz listing
- `QuestionEditor.tsx` - Edit individual questions

**Real-time Chat**
- Socket.io connection for live messaging
- `ChatMessage.tsx` - Display messages
- `ChatInput.tsx` - Send messages
- `TeacherChatCard.tsx` & `StudentChatCard.tsx` - Chat preview cards

### State Management
- **Zustand Store** (`src/stores/authStore.ts`)
  - User authentication state
  - Current user info
  - Login/logout actions

- **React Query**
  - Server data caching
  - Auto refetching
  - Mutation handling

### API Service Layer
```typescript
// src/services/api.ts
- Axios instance with interceptors
- Auto-adds JWT token to requests
- Handles 401 errors (token expiry)
- Excludes login endpoints from redirect

// Individual service files
- authService.ts → Login/logout
- attendanceService.ts → Get/mark attendance
- quizService.ts → Quiz CRUD
- reportService.ts → Analytics & reports
```

---

## ⚙️ Backend Architecture

### Express Server Setup (`server/index.js`)
- **Port**: 3000 (default)
- **CORS**: Enabled for frontend at `http://localhost:5173`
- **Socket.io**: Real-time communication
- **MongoDB**: Database connection
- **Routes Mounted**:
  - `/api/auth` → Authentication
  - `/api/teacher` → Teacher operations
  - `/api/student` → Student operations
  - `/api/quiz` → Quiz management
  - `/api/chat` → Messaging
  - `/api/attendance` → Attendance stats

### Database Models

**Student Schema** (`server/models/Student.js`)
```javascript
{
  name: String,
  username: String (unique),
  password: String (hashed),
  registerNo: String,
  class: String,
  section: String,
  photo: String (filename),
  teachers: [ObjectId],     // Teachers assigned to this student
  attendance: [             // Attendance records
    {
      date: Date,
      status: 'present'|'absent',
      teacher: ObjectId
    }
  ]
}
```

**Teacher Schema** (`server/models/Teacher.js`)
```javascript
{
  username: String (unique),
  password: String (hashed),
  subject: String,
  students: [ObjectId]      // Students managed by teacher
}
```

**Quiz Schema** (`server/models/Quiz.js`)
```javascript
{
  title: String,
  description: String,
  teacher: ObjectId,
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number
    }
  ],
  createdAt: Date
}
```

**Chat Schema** (`server/models/Chat.js`)
```javascript
{
  sender: ObjectId,
  recipient: ObjectId,
  senderRole: 'teacher'|'student',
  message: String,
  timestamp: Date
}
```

### API Endpoints

#### Authentication Routes
- `POST /api/auth/verify-token` - Verify JWT validity
- `POST /api/auth/refresh-token` - Refresh expired token

#### Teacher Routes
- `POST /api/teacher/login` - Login
- `GET /api/teacher/dashboard` - Get dashboard data
- `GET /api/teacher/students` - Get assigned students
- `POST /api/teacher/attendance` - Mark attendance (face recognition)
- `GET /api/teacher/attendance/:studentId` - View attendance
- `POST /api/teacher/attendance/report` - Generate attendance report
- `GET /api/teacher/statistics` - Get student statistics

#### Student Routes
- `POST /api/student/login` - Login
- `GET /api/student/dashboard` - Get dashboard data
- `GET /api/student/attendance` - View own attendance
- `GET /api/student/statistics` - View own statistics
- `GET /api/student/teachers` - Get assigned teachers

#### Quiz Routes
- `GET /api/quiz` - List all quizzes
- `POST /api/quiz` - Create quiz (teacher only)
- `PUT /api/quiz/:id` - Update quiz (teacher only)
- `DELETE /api/quiz/:id` - Delete quiz (teacher only)
- `GET /api/quiz/:id` - Get quiz details
- `POST /api/quiz/:id/submit` - Submit quiz answers (student)
- `GET /api/quiz/:id/submissions` - View submissions (teacher)

#### Chat Routes
- `POST /api/chat/send` - Send message
- `GET /api/chat/history` - Get chat history
- `GET /api/chat/conversations` - List conversations

---

## 🐍 Python Face Recognition

### Core Modules

**main.py** - Real-time face detection & attendance marking
```python
- Loads pre-trained face encodings from encodings.npz
- Uses face_recognition library for encoding comparison
- YOLOv8 for face detection with cvzone overlay
- Tracks detections with confidence threshold
- Marks attendance after N consecutive detections
- Outputs: JSON list of present students
```

**EncodeGenerator.py** - Generate face encodings from photos
```python
- Reads student photos from uploads/
- Generates 128D face encodings using face_recognition
- Saves encodings + names to encodings.npz
- Called when new student photo is uploaded
```

**Requirements**
```
opencv-python==4.8.1.78
face-recognition==1.3.0
numpy==1.24.3
ultralytics==8.0.196
torch==2.1.0
torchvision==0.16.0
cvzone==1.5.6
```

### How Face Recognition Works

1. **Encoding Generation** (offline)
   - Teacher uploads student photo
   - Backend calls `EncodeGenerator.py`
   - Generates 128D face encoding
   - Saves to `encodings.npz`

2. **Attendance Marking** (real-time)
   - Teacher clicks "Mark Attendance"
   - Backend starts Python `main.py` process
   - Python captures webcam feed
   - Compares each detected face with known encodings
   - If match confidence > threshold (0.7) for N consecutive frames (5)
   - Backend sends attendance data to MongoDB
   - Frontend displays "Present" students

3. **Detection Thresholds**
   - `DETECTION_THRESHOLD = 5` - Consecutive frames needed
   - `CONFIDENCE_THRESHOLD = 0.7` - Minimum similarity score

---

## 🧠 AI Quiz Generation (QuizCrafter Module)

### Architecture
- **Backend**: FastAPI (Python)
- **Frontend**: React
- **Purpose**: Generate quiz questions from PDF documents

### Workflow
1. Upload PDF file
2. Specify topic/subject
3. AI extracts content and generates MCQ questions
4. Display quiz in interactive UI
5. Score tracking

### Location
```
QuizCrafter/
├── backend/
│   ├── main.py → FastAPI server
│   ├── quiz_llm.py → LLM integration for question generation
│   └── requirements.txt
└── frontend/
    └── React quiz UI
```

---

## 🔧 Environment Configuration

### Required Environment Variables

Create `server/.env`:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/face_recognition

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRY=24h

# Server
PORT=3000
NODE_ENV=development

# Frontend
CLIENT_URL=http://localhost:5173

# Optional: Python path (auto-detected if not set)
PYTHON_PATH=C:\Users\YourUsername\anaconda3\python.exe

# Optional: AI Quiz Service
QUIZCRAFTER_URL=http://localhost:8000
```

### MongoDB Connection
- **Local**: `mongodb://localhost:27017/face_recognition`
- **Ensure MongoDB is running**: `mongod` or MongoDB Compass

---

## 🚀 Running the Project

### 1. Setup & Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install server dependencies
cd server
npm install

# Install Python dependencies
cd ../ai
pip install -r requirements.txt
```

### 2. Start Services

**Terminal 1 - Backend Server**
```bash
cd server
npm run dev    # Uses nodemon for auto-reload
# or
npm start      # Standard start
```

**Terminal 2 - Frontend Dev Server**
```bash
npm run dev
# Vite dev server runs on http://localhost:5173
```

**Terminal 3 - MongoDB** (if using local)
```bash
mongod
# or use MongoDB Compass GUI
```

### 3. Access Application
- Teacher: `http://localhost:5173/teacher/login`
- Student: `http://localhost:5173/student/login`
- Default Credentials: username=`teacher1` or `student1`, password=`password123`

---

## 🐛 Troubleshooting

### Login Issues
1. Check MongoDB is running: `mongo` or MongoDB Compass
2. Check users exist: `cd server && node scripts/checkUsers.js`
3. Create test users: `cd server && node scripts/createTestUsers.js`
4. Check server logs for authentication errors

### Face Recognition Not Working
1. Ensure Python is installed: `python --version`
2. Install required packages: `cd ai && pip install -r requirements.txt`
3. Check webcam is connected and not used by another app
4. Check server logs for Python execution errors

### Database Connection Errors
1. Ensure MongoDB is running
2. Check `MONGODB_URI` in `.env`
3. Verify MongoDB credentials
4. Use MongoDB Compass to test connection

### API Errors
1. Check server console for error messages
2. Open browser DevTools → Network tab
3. Check request headers include `Authorization: Bearer <token>`
4. Verify token hasn't expired

---

## 📊 Key Features

### Teacher Features
✅ Login with credentials  
✅ View all assigned students  
✅ Mark attendance using face recognition  
✅ View attendance reports (per student, date range)  
✅ Create & manage quizzes  
✅ View student quiz submissions  
✅ Chat with students  
✅ Generate attendance reports (PDF/Excel)  
✅ View student statistics  

### Student Features
✅ Login with credentials  
✅ View personal attendance records  
✅ View attendance statistics  
✅ Take assigned quizzes  
✅ View quiz history & scores  
✅ Chat with teachers  
✅ Download quiz reports  

---

## 📦 Dependencies Overview

### Frontend (React + TS)
- `react-router-dom` - Routing
- `zustand` - State management
- `@tanstack/react-query` - Server state
- `axios` - HTTP client
- `socket.io-client` - Real-time messaging
- `framer-motion` - Animations
- `tailwindcss` - Styling
- `lucide-react` - Icons
- `react-hot-toast` - Notifications
- `react-webcam` - Camera access
- `date-fns` - Date utilities

### Backend (Node + Express)
- `express` - Web framework
- `mongoose` - MongoDB ORM
- `socket.io` - WebSocket library
- `jsonwebtoken` - JWT auth
- `bcryptjs` - Password hashing
- `cors` - Cross-origin support
- `multer` - File upload
- `node-cron` - Scheduled jobs
- `python-shell` - Python integration

### Python (ML/CV)
- `opencv-python` - Image processing
- `face-recognition` - Face encoding
- `ultralytics` - YOLOv8 detection
- `torch/torchvision` - Deep learning
- `numpy` - Numerical computing

---

## 🎯 Next Steps & Improvements

### Potential Enhancements
- [ ] Email notifications for parents
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Biometric authentication improvements
- [ ] Batch photo upload for students
- [ ] Automated quiz scheduling
- [ ] Video attendance recording
- [ ] Performance analytics for teachers

### Known Issues to Fix
- [x] Login redirect on 401 errors
- [ ] Race conditions in attendance marking
- [ ] Python path auto-detection on Windows
- [ ] Memory management in face recognition loop

---

## 📚 Documentation Files

- **BACKEND_ANALYSIS.md** - Detailed backend structure & API docs
- **LOGIN_FIX_SUMMARY.md** - Login troubleshooting guide
- **PYTHON_SETUP_GUIDE.md** - Python environment setup
- **CREDENTIALS_STORAGE_GUIDE.md** - Database & credentials info
- **FIX_DATABASE_CONNECTION.md** - Database troubleshooting

---

## 🤝 Support

For issues or questions:
1. Check the troubleshooting guides
2. Review server logs in terminal
3. Check browser DevTools (F12 → Console, Network, Application)
4. Verify all environment variables are set
5. Ensure all services are running (Node, MongoDB, Python)

---

**Last Updated**: January 18, 2026  
**Version**: 1.0.0  
**Status**: Active Development
