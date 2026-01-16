import express from "express";
import { verifyToken, roleCheck } from "../middleware/auth.js";
import {
    createQuiz,
    getTeacherQuizzes,
    getStudentQuizzes,
    getQuizById,
    updateQuizStatus,
    generateQuizFromAI
} from "../controllers/quizController.js";
import {
    startQuiz,
    submitQuiz,
    getSubmissionById,
    getQuizSubmissions,
    getStudentHistory
} from "../controllers/submissionController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Teacher Routes
router.post("/create", verifyToken, roleCheck(["teacher"]), createQuiz);
router.post("/generate", verifyToken, roleCheck(["teacher"]), upload.single('resource'), generateQuizFromAI);
router.get("/teacher", verifyToken, roleCheck(["teacher"]), getTeacherQuizzes); // /api/quiz/teacher (uses user.id)
router.put("/:id/status", verifyToken, roleCheck(["teacher"]), updateQuizStatus);
router.get("/:quizId/submissions", verifyToken, roleCheck(["teacher"]), getQuizSubmissions);

// Student Routes
router.get("/student/pending", verifyToken, roleCheck(["student"]), getStudentQuizzes);
router.get("/student/history", verifyToken, roleCheck(["student"]), getStudentHistory);
router.post("/start", verifyToken, roleCheck(["student"]), startQuiz);
router.post("/submit/:id", verifyToken, roleCheck(["student"]), submitQuiz); // :id is submissionId

// Common Routes (Quiz Details)
router.get("/:id", verifyToken, getQuizById);
router.get("/submission/:id", verifyToken, getSubmissionById);

export default router;
