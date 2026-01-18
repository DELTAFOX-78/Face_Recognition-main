import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Student from '../models/Student.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(`[Student Login] Attempt for username: ${username}`);

    // Validate input
    if (!username || !password) {
      console.log(`[Student Login] Missing credentials`);
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not set in environment variables");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const student = await Student.findOne({ username });
    console.log(`[Student Login] Student found: ${student ? 'Yes' : 'No'}`);

    if (!student) {
      console.log(`[Student Login] Student not found: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log(`[Student Login] Comparing password...`);
    const isPasswordValid = await bcrypt.compare(password, student.password);
    console.log(`[Student Login] Password valid: ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.log(`[Student Login] Invalid password for: ${username}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: student._id, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log(`[Student Login] Success for: ${username}`);
    res.json({ token, user: { id: student._id, name: student.name } });
  } catch (error) {
    console.error("Student login error:", error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getAttendance = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Group attendance by subject and calculate statistics
    const attendanceStats = student.attendance.reduce((acc, record) => {
      if (!acc[record.subject]) {
        acc[record.subject] = { present: 0, total: 0 };
      }
      acc[record.subject].total++;
      if (record.present) {
        acc[record.subject].present++;
      }
      return acc;
    }, {});

    const formattedStats = Object.entries(attendanceStats).map(([subject, stats]) => ({
      subject,
      present: stats.present,
      total: stats.total
    }));

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};