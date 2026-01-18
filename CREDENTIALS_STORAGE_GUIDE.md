# Credentials Storage Guide

## 📍 Where Credentials Are Stored

**Credentials are stored in MongoDB database, NOT hardcoded!**

- **Database**: `face_recognition`
- **Connection**: `mongodb://localhost:27017/face_recognition`
- **Collections**:
  - `teachers` - Stores teacher credentials
  - `students` - Stores student credentials

## 🔍 Viewing Credentials in MongoDB Compass

### 1. Connect to MongoDB
- Open MongoDB Compass
- Connect to: `mongodb://localhost:27017`
- Select database: `face_recognition`

### 2. View Teachers
- Click on `teachers` collection
- You'll see documents like:
```json
{
  "_id": ObjectId("..."),
  "username": "teacher1",
  "password": "$2a$10$...",  // Hashed password (bcrypt)
  "subject": "Mathematics",
  "students": []
}
```

### 3. View Students
- Click on `students` collection
- You'll see documents like:
```json
{
  "_id": ObjectId("..."),
  "name": "John Doe",
  "username": "student1",
  "password": "$2a$10$...",  // Hashed password (bcrypt)
  "registerNo": "STU001",
  "class": "10",
  "section": "A",
  "photo": "test-photo.jpg",
  "teachers": [],
  "attendance": []
}
```

## 🔐 Security Features

### Password Hashing
- **Passwords are NEVER stored in plain text**
- They are hashed using **bcrypt** (one-way encryption)
- Example: `password123` → `$2a$10$mtoSA046cjAid1JAaHxtD.db0SAIMi4RIF3jCflmZSL/Klzgl8m5a`
- **You cannot reverse the hash to get the original password**

### How Login Works
1. User enters username and password
2. Server finds user by username in MongoDB
3. Server compares entered password with stored hash using `bcrypt.compare()`
4. If match → Login successful
5. If no match → "Invalid credentials"

## 👥 Managing Users

### Create New Teacher (via Backend API)

**Option 1: Using the Frontend**
- Login as a teacher
- Go to "Add Student" page (teachers can add students)
- Or use the teacher registration endpoint

**Option 2: Using Script**
```bash
cd server
node scripts/createTestUsers.js
```

**Option 3: Directly in MongoDB Compass**
1. Open `teachers` collection
2. Click "ADD DATA" → "Insert Document"
3. Enter:
```json
{
  "username": "newteacher",
  "password": "NEEDS_TO_BE_HASHED",  // ⚠️ Must hash first!
  "subject": "Science",
  "students": []
}
```
⚠️ **Warning**: You must hash the password first using bcrypt!

### Create New Student (via Backend API)

**Option 1: Using the Frontend**
- Login as teacher
- Go to "Add Student" page
- Fill in student details and upload photo

**Option 2: Using Script**
```bash
cd server
node scripts/createTestUsers.js
```

## 🛠️ Available Scripts

### Check Existing Users
```bash
cd server
node scripts/checkUsers.js
```
Shows all teachers and students in the database.

### Create Test Users
```bash
cd server
node scripts/createTestUsers.js
```
Creates:
- Teacher: `teacher1` / `password123`
- Student: `student1` / `password123`

### Update Passwords
```bash
cd server
node scripts/updatePassword.js
```
Resets passwords for `teacher1` and `student1` to `password123`.

## 📊 Database Structure

### Teachers Collection Schema
```javascript
{
  username: String (unique, required),
  password: String (hashed, required),
  subject: String (required),
  students: [ObjectId] (references to Student documents)
}
```

### Students Collection Schema
```javascript
{
  name: String (required),
  class: String (required),
  section: String (required),
  registerNo: String (unique, required),
  username: String (unique, required),
  password: String (hashed, required),
  photo: String (file path, required),
  teachers: [ObjectId] (references to Teacher documents),
  attendance: [{
    date: String,
    subject: String,
    present: Boolean
  }]
}
```

## 🔄 Creating Users Programmatically

### Create Teacher via Node.js Script
```javascript
import bcrypt from "bcryptjs";
import Teacher from "./models/Teacher.js";

const hashedPassword = await bcrypt.hash("your-password", 10);
const teacher = new Teacher({
  username: "newteacher",
  password: hashedPassword,
  subject: "Physics",
  students: []
});
await teacher.save();
```

### Create Student via Node.js Script
```javascript
import bcrypt from "bcryptjs";
import Student from "./models/Student.js";

const hashedPassword = await bcrypt.hash("your-password", 10);
const student = new Student({
  name: "Jane Doe",
  class: "11",
  section: "B",
  registerNo: "STU002",
  username: "student2",
  password: hashedPassword,
  photo: "path/to/photo.jpg",
  teachers: [],
  attendance: []
});
await student.save();
```

## 🎯 Current Test Credentials

After running the setup scripts, you have:

**Teacher:**
- Username: `teacher1`
- Password: `password123`
- Subject: `Mathematics`

**Student:**
- Username: `student1`
- Password: `password123`
- Name: `John Doe`
- Class: `10-A`
- Register No: `STU001`

## ⚠️ Important Notes

1. **Never store passwords in plain text** - Always use bcrypt hashing
2. **Database is persistent** - Users remain after server restart
3. **Multiple teachers can share students** - Students have a `teachers[]` array
4. **Photos are stored as file paths** - Actual files are in `server/uploads/`
5. **Attendance is stored per student** - Each student has an `attendance[]` array

## 🔍 Verifying Storage

To verify where credentials are stored:
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select `face_recognition` database
4. Open `teachers` or `students` collection
5. You'll see all user credentials (with hashed passwords)

The credentials are **NOT hardcoded** - they're dynamically stored and retrieved from MongoDB!
