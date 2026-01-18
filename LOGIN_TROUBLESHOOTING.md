# Login Troubleshooting Guide

## Issues Fixed

### 1. **Improved Error Handling**
- Added input validation for username and password
- Added JWT_SECRET check before token generation
- Improved error logging for debugging
- Separated password validation from user lookup for clearer error messages

### 2. **Common Login Issues & Solutions**

#### **Issue: "Invalid credentials" error**

**Possible Causes:**
1. **Username doesn't exist in database**
   - Check if teacher/student exists in MongoDB
   - Verify username spelling

2. **Password mismatch**
   - Password might not be hashed correctly when created
   - Check if password was hashed with bcrypt during registration

3. **Database connection issue**
   - Check MongoDB connection in `server/utils/db.js`
   - Verify MONGODB_URI in .env file

**Solution:**
```bash
# Check MongoDB connection
# In MongoDB shell or Compass, verify:
db.teachers.find({ username: "your-username" })
db.students.find({ username: "your-username" })
```

#### **Issue: "Server configuration error"**

**Cause:** JWT_SECRET is not set in environment variables

**Solution:**
1. Create a `.env` file in the `server/` directory
2. Add the following:
```env
JWT_SECRET=your-secret-key-change-this-in-production
MONGODB_URI=mongodb://localhost:27017/face_recognition
PORT=3000
CLIENT_URL=http://localhost:5173
```

3. Restart the server

#### **Issue: "Server error" (500)**

**Possible Causes:**
1. **JWT_SECRET missing** - Now handled with specific error message
2. **Database connection failed** - Check MongoDB is running
3. **bcrypt comparison error** - Password field might be corrupted

**Solution:**
- Check server console logs for detailed error messages
- Verify MongoDB is running: `mongod` or check MongoDB service
- Check database connection string

## Testing Login

### Manual Testing with cURL

**Teacher Login:**
```bash
curl -X POST http://localhost:3000/api/teacher/login \
  -H "Content-Type: application/json" \
  -d '{"username":"teacher1","password":"password123"}'
```

**Student Login:**
```bash
curl -X POST http://localhost:3000/api/student/login \
  -H "Content-Type: application/json" \
  -d '{"username":"student1","password":"password123"}'
```

### Check Server Logs

The improved error handling now logs:
- "JWT_SECRET is not set" - if environment variable is missing
- "Teacher login error:" / "Student login error:" - with full error details in development mode

## Database Setup

### Create a Test Teacher

```javascript
// In MongoDB shell or Node.js script
const bcrypt = require('bcryptjs');
const Teacher = require('./models/Teacher');

async function createTeacher() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  const teacher = new Teacher({
    username: 'teacher1',
    password: hashedPassword,
    subject: 'Mathematics',
    students: []
  });
  await teacher.save();
  console.log('Teacher created:', teacher);
}
```

### Create a Test Student

```javascript
const bcrypt = require('bcryptjs');
const Student = require('./models/Student');

async function createStudent() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  const student = new Student({
    name: 'John Doe',
    class: '10',
    section: 'A',
    registerNo: 'STU001',
    username: 'student1',
    password: hashedPassword,
    photo: 'path/to/photo.jpg',
    teachers: [],
    attendance: []
  });
  await student.save();
  console.log('Student created:', student);
}
```

## Frontend Debugging

### Check Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Check the request:
   - **URL**: Should be `http://localhost:3000/api/teacher/login` or `/api/student/login`
   - **Method**: POST
   - **Request Payload**: Should contain `{username: "...", password: "..."}`
   - **Response**: Check status code and response body

### Common Frontend Issues

1. **CORS Error**
   - Check `CLIENT_URL` in server .env matches frontend URL
   - Verify CORS middleware in `server/index.js`

2. **404 Not Found**
   - Verify API base URL in `src/config/constants.ts`
   - Should be `http://localhost:3000/api`

3. **Network Error**
   - Check if server is running on port 3000
   - Verify no firewall blocking the connection

## Quick Fix Checklist

- [ ] `.env` file exists in `server/` directory
- [ ] `JWT_SECRET` is set in `.env`
- [ ] `MONGODB_URI` is correct and MongoDB is running
- [ ] Server is running on port 3000
- [ ] Frontend API base URL is `http://localhost:3000/api`
- [ ] Teacher/Student exists in database
- [ ] Password is hashed with bcrypt
- [ ] Check server console for error logs
- [ ] Check browser console for frontend errors
- [ ] Check browser Network tab for API response

## Next Steps

1. **Create .env file** with required variables
2. **Restart the server** after creating .env
3. **Check server logs** for detailed error messages
4. **Test with cURL** to isolate frontend vs backend issues
5. **Verify database** has test users with hashed passwords
