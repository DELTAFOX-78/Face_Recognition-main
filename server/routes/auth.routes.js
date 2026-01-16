import express from 'express';
import { verifyToken, refreshToken, logout } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/verify-token', verifyToken);
router.post('/refresh-token', refreshToken);
router.post('/logout', authMiddleware, logout);

export default router;