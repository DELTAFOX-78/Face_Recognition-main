# Backend Server Analysis

## 📋 Overview
The backend is a Node.js/Express server with MongoDB, Socket.io, and Python integration for face recognition attendance.

## 🏗️ Architecture

### **Server Entry Point**: `server/index.js`
- Express server with Socket.io integration
- MongoDB connection
- Cron jobs for attendance reports
- Route mounting and middleware setup

### **Key Components**

#### 1. **Routes** (`server/routes/`)
- `auth.routes.js` - Token verification, refresh, logout
- `student.routes.js` - Student login, attendance
- `teacher.routes.js` - Teacher operations (students, attendance, reports)
- `chat.routes.js` - Real-time messaging
- `attendanceRoutes.js` - Attendance statistics
- `quiz.routes.js` - Quiz CRUD and submissions

#### 2. **Controllers** (`server/controllers/`)
- `auth.controller.js` - Authentication logic
- `teacher.controller.js` - Teacher operations
- `student.controller.js` - Student operations
- `attendanceController.js` - Attendance management
- `quizController.js` - Quiz management
- `submissionController.js` - Quiz submissions
- `chat.controller.js` - Chat functionality
- `pythonScripts.js` - Python face recognition integration
- `statisticsController.js` - Student statistics

#### 3. **Models** (`server/models/`)
- `Student.js` - Student schema (name, class, section, registerNo, username, password, photo, teachers[], attendance[])
- `Teacher.js` - Teacher schema (username, password, subject, students[])
- `Quiz.js` - Quiz schema with questions
- `QuizSubmission.js` - Quiz submission tracking
- `Chat.js` - Message schema

#### 4. **Services** (`server/services/`)
- `attendanceService.js` - Attendance business logic
- `chatService.js` - Chat business logic
- `excelService.js` - Excel report generation

#### 5. **Middleware** (`server/middleware/`)
- `auth.js` - JWT verification and role checking
- `socketMiddleware.js` - Socket.io attachment to requests

#### 6. **Utilities** (`server/utils/`)
- `db.js` - MongoDB connection
- `asyncHandler.js` - Async error handling wrapper

#### 7. **Cron Jobs** (`server/cron/`)
- `attendanceReport.js` - Daily attendance report generation (5:00 PM IST)

## 🔧 Environment Variables Required

```env
MONGODB_URI=mongodb://localhost:27017/face_recognition
JWT_SECRET=your-secret-key
PORT=3000
CLIENT_URL=http://localhost:5173
QUIZCRAFTER_URL=http://localhost:8000  # Optional, for AI quiz generation
```

## 🚨 Issues Found

### **Critical Issues:**

1. **Missing Import in `attendanceController.js`**
   - Line 29: Uses `Student` but not imported
   - Line 31: Uses `teacher: teacherId` but Student model has `teachers[]` array

2. **Incorrect Query in `attendanceService.js`**
   - Line 53: Uses `teacher: teacherId` but should use `teachers: teacherId`

3. **Missing await in `teacher.controller.js`**
   - Line 172: `stopPythonScript` is async but not awaited

4. **Duplicate Response in `teacher.controller.js`**
   - Line 292: Two `res.json()` calls

### **Potential Issues:**

1. **Python Script Path**: Uses relative paths that might break in production
2. **Error Handling**: Some controllers lack comprehensive error handling
3. **Race Conditions**: `isCapturing` flag in `teacher.controller.js` might have race conditions
4. **Memory Leaks**: `present_students` array in `pythonScripts.js` might not reset properly on errors

## 📊 API Endpoints

### **Authentication**
- `POST /api/auth/verify-token` - Verify JWT token
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/logout` - Logout (client-side)

### **Student Routes**
- `POST /api/student/login` - Student login
- `GET /api/student/attendance` - Get student attendance

### **Teacher Routes**
- `POST /api/teacher/login` - Teacher login
- `POST /api/teacher/add-student` - Add student (with photo upload)
- `GET /api/teacher/students` - Get all students
- `GET /api/teacher/edit-student/:id` - Get student by ID
- `PUT /api/teacher/edit-student/:id` - Update student
- `DELETE /api/teacher/edit-student/:id` - Delete student
- `POST /api/teacher/mark-attendance` - Start face recognition attendance
- `POST /api/teacher/stop-attendance` - Stop attendance capture
- `GET /api/teacher/attendance-report` - Download attendance report
- `GET /api/teacher/classes` - Get teacher's classes
- `GET /api/teacher/get-statistics/:studentId` - Get student statistics

### **Chat Routes**
- `GET /api/chat/messages/:receiverId` - Get messages with user
- `POST /api/chat/messages` - Send message
- `GET /api/chat/teachers` - Get teachers with messages (student)
- `GET /api/chat/students` - Get students with messages (teacher)
- `POST /api/chat/mark-read/:receiverId` - Mark messages as read

### **Attendance Routes**
- `GET /api/attendance/student/stats` - Student attendance stats
- `GET /api/attendance/class/:classId/:sectionId` - Class attendance
- `POST /api/attendance/mark` - Manual attendance marking

### **Quiz Routes**
- `POST /api/quiz/create` - Create quiz (teacher)
- `POST /api/quiz/generate` - Generate quiz from AI (teacher)
- `GET /api/quiz/teacher` - Get teacher's quizzes
- `GET /api/quiz/student/pending` - Get pending quizzes (student)
- `GET /api/quiz/student/history` - Get quiz history (student)
- `GET /api/quiz/:id` - Get quiz by ID
- `PUT /api/quiz/:id/status` - Update quiz status (teacher)
- `POST /api/quiz/start` - Start quiz (student)
- `POST /api/quiz/submit/:id` - Submit quiz (student)
- `GET /api/quiz/:quizId/submissions` - Get quiz submissions (teacher)
- `GET /api/quiz/submission/:id` - Get submission details

## 🔐 Security Features

- JWT authentication with 1-day expiration
- Role-based access control (teacher/student)
- Password hashing with bcrypt
- Protected routes with middleware
- File upload validation (Multer)

## 🔄 Real-time Features (Socket.io)

- **Attendance Updates**: Real-time attendance marking notifications
- **Chat**: Real-time messaging between teachers and students
- **Process Status**: Face recognition process status updates

## 🐍 Python Integration

- **EncodeGenerator.py**: Generates face encodings from student photos
- **main.py**: Real-time face recognition with anti-spoofing (YOLO)
- Communication via stdout/stdin
- Process management with spawn

## 📈 Performance Considerations

- MongoDB indexes on frequently queried fields
- Async/await for non-blocking operations
- Parallel processing for absent students
- Aggregation pipelines for complex queries

## 🧪 Testing Recommendations

1. Test authentication flow
2. Test file uploads
3. Test Python script integration
4. Test Socket.io real-time features
5. Test error handling and edge cases
6. Test concurrent attendance marking

## 🚀 Deployment Considerations

1. Set up environment variables
2. Ensure Python dependencies are installed
3. Configure MongoDB connection
4. Set up file storage for uploads/reports
5. Configure CORS for production domain
6. Set up process manager (PM2)
7. Configure logging
8. Set up monitoring
