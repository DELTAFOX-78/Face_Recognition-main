import jwt from 'jsonwebtoken';
import  Student  from '../models/Student.js';
import  Teacher  from '../models/Teacher.js';

export const verifyToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const Model = decoded.role === 'student' ? Student : Teacher;
    const user = await Model.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    res.json({ valid: true, user: { id: user._id, role: decoded.role } });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Generate new token
    const newToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const logout = async (req, res) => {
  // Since we're using JWT, we don't need to do anything server-side
  // The client will remove the token
  res.json({ message: 'Logged out successfully' });
};