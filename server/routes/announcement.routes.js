import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
    createAnnouncement,
    getTeacherAnnouncements,
    deleteAnnouncement,
    getTeacherBranchClassSection,
    getStudentAnnouncements,
    replyToAnnouncement
} from '../controllers/announcement.controller.js';

const router = express.Router();

// Teacher routes
router.post('/teacher', verifyToken, createAnnouncement);
router.get('/teacher', verifyToken, getTeacherAnnouncements);
router.delete('/teacher/:id', verifyToken, deleteAnnouncement);
router.get('/teacher/options', verifyToken, getTeacherBranchClassSection);

// Student routes
router.get('/student', verifyToken, getStudentAnnouncements);
router.post('/student/:id/reply', verifyToken, replyToAnnouncement);

export default router;
