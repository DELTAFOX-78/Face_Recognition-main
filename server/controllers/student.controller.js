import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Student from '../models/Student.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const student = await Student.findOne({ username });

    if (!student || !await bcrypt.compare(password, student.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: student._id, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user: { id: student._id, name: student.name } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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