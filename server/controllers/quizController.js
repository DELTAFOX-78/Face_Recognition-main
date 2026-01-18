import Quiz from "../models/Quiz.js";
import Student from "../models/Student.js";
import { PythonShell } from "python-shell";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createQuiz = async (req, res) => {
    try {
        const { title, description, assignedTo, questions, config, dueDate, resourceFile } = req.body;
        const teacherId = req.user.id; // Added by authMiddleware

        const newQuiz = new Quiz({
            title,
            description,
            teacher: teacherId,
            assignedTo,
            questions,
            config,
            dueDate,
            resourceFile,
            status: "DRAFT" // Default to DRAFT
        });

        await newQuiz.save();
        res.status(201).json(newQuiz);
    } catch (error) {
        console.error("Error creating quiz:", error);
        res.status(500).json({ message: "Error creating quiz", error: error.message });
    }
};

export const getTeacherQuizzes = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const quizzes = await Quiz.find({ teacher: teacherId }).sort({ createdAt: -1 });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching quizzes", error: error.message });
    }
};

export const getStudentQuizzes = async (req, res) => {
    try {
        const studentId = req.user.id;
        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Find quizzes assigned to student's class and section
        // And that are PUBLISHED or CLOSED (to see history)
        const quizzes = await Quiz.find({
            "assignedTo.class": student.class,
            "assignedTo.section": student.section,
            status: { $in: ["PUBLISHED", "CLOSED"] }
        }).select("-questions.correctAnswer"); // Don't send correct answers

        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching assigned quizzes", error: error.message });
    }
};

export const getQuizById = async (req, res) => {
    try {
        const quizId = req.params.id;
        const role = req.user.role; // 'teacher' or 'student'

        let quiz;
        if (role === 'teacher') {
            quiz = await Quiz.findById(quizId);
        } else {
            quiz = await Quiz.findById(quizId).select("-questions.correctAnswer");
        }

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: "Error fetching quiz", error: error.message });
    }
};

export const updateQuizStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const quiz = await Quiz.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // TODO: Emit socket notification if status is PUBLISHED

        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: "Error updating quiz status", error: error.message });
    }
};

export const generateQuizFromAI = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { topic, numQuestions } = req.body;
        if (!topic) {
            return res.status(400).json({ message: "Topic is required for AI generation" });
        }

        // Read the uploaded file
        const fileBuffer = fs.readFileSync(req.file.path);

        // Create FormData for QuizCrafter FastAPI
        const FormData = (await import('form-data')).default;
        const formData = new FormData();
        formData.append('file', fileBuffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });
        formData.append('topic', topic);
        formData.append('numQuestions', numQuestions || '5');

        // Call QuizCrafter FastAPI backend
        const QUIZCRAFTER_URL = process.env.QUIZCRAFTER_URL || 'http://localhost:8000';

        const axios = (await import('axios')).default;
        const response = await axios.post(
            `${QUIZCRAFTER_URL}/generate-quiz-for-db/`,
            formData,
            {
                headers: {
                    ...formData.getHeaders()
                },
                timeout: 120000 // 2 minutes timeout for AI generation
            }
        );

        const { questions, resourceFile } = response.data;

        // Clean up the temporarily uploaded file
        // fs.unlinkSync(req.file.path);

        res.json({ questions, resourceFile });

    } catch (error) {
        console.error("Error in AI generation:", error);

        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({
                message: "QuizCrafter AI service is not running. Please start the FastAPI backend.",
                error: "Connection refused to QuizCrafter service"
            });
        }

        if (error.response) {
            return res.status(error.response.status).json({
                message: "AI generation failed",
                error: error.response.data?.detail || error.message
            });
        }

        res.status(500).json({ message: "Error generating quiz", error: error.message });
    }
};
