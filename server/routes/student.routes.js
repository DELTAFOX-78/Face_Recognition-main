import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { login, getAttendance } from '../controllers/student.controller.js';

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes
router.get('/attendance', verifyToken, getAttendance);

export default router;