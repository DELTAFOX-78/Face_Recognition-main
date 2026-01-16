import QuizSubmission from "../models/QuizSubmission.js";
import Quiz from "../models/Quiz.js";

export const startQuiz = async (req, res) => {
    try {
        const { quizId } = req.body;
        const studentId = req.user.id;

        // Check if submission already exists
        const existingSubmission = await QuizSubmission.findOne({
            quiz: quizId,
            student: studentId
        });

        if (existingSubmission) {
            if (existingSubmission.status !== 'STARTED') {
                return res.status(400).json({ message: "You have already attempted this quiz." });
            }
            // If it exists but is just STARTED (maybe page reload), return it
            return res.json(existingSubmission);
        }

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Check if quiz is open
        if (quiz.status !== 'PUBLISHED') {
            return res.status(400).json({ message: "Quiz is not currently active." });
        }

        // Check due date
        if (new Date() > new Date(quiz.dueDate)) {
            return res.status(400).json({ message: "Quiz due date has passed." });
        }

        // Create new submission
        const submission = new QuizSubmission({
            quiz: quizId,
            student: studentId,
            totalMarks: quiz.questions.reduce((sum, q) => sum + q.marks, 0),
            status: 'STARTED',
            startedAt: new Date()
        });

        await submission.save();
        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: "Error starting quiz", error: error.message });
    }
};

export const submitQuiz = async (req, res) => {
    try {
        const { id } = req.params; // submissionId
        const { answers } = req.body; // Array of { questionId, answer }

        const submission = await QuizSubmission.findById(id).populate('quiz');

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        if (submission.status === 'SUBMITTED' || submission.status === 'GRADED') {
            return res.status(400).json({ message: "Quiz already submitted." });
        }

        const quiz = submission.quiz;
        let score = 0;

        // Auto-grading logic
        const evaluatedAnswers = answers.map(submittedAnswer => {
            const question = quiz.questions.id(submittedAnswer.questionId);

            let isCorrect = false;

            if (question) {
                // Case insensitive comparison for text
                if (question.type === 'MCQ' || question.type === 'TRUE_FALSE') {
                    if (submittedAnswer.answer === question.correctAnswer) {
                        isCorrect = true;
                        score += question.marks;
                    }
                } else if (question.type === 'SHORT_ANSWER') {
                    // Basic exact match for now, or teacher manual grade later.
                    // For MVP, letting auto-grade handles it if exact match
                    if (submittedAnswer.answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
                        isCorrect = true;
                        score += question.marks;
                    }
                }
            }

            return {
                ...submittedAnswer,
            };
        });

        submission.answers = answers;
        submission.score = score;
        submission.status = 'GRADED'; // Assuming all auto-graded for now
        submission.submittedAt = new Date();

        await submission.save();

        // Return result
        res.json(submission);

    } catch (error) {
        console.error("Submit Error:", error);
        res.status(500).json({ message: "Error submitting quiz", error: error.message });
    }
};

export const getSubmissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const submission = await QuizSubmission.findById(id)
            .populate('quiz') // Populate full quiz including questions with correctAnswer for review
            .populate('student', 'name registerNo');

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        // Ensure student can only see their own
        if (req.user.role === 'student' && submission.student._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // For submitted quizzes, students can see correct answers
        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: "Error fetching submission", error: error.message });
    }
};

export const getQuizSubmissions = async (req, res) => {
    try {
        const { quizId } = req.params;
        const submissions = await QuizSubmission.find({ quiz: quizId })
            .populate('student', 'name registerNo')
            .sort({ score: -1 });

        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching submissions", error: error.message });
    }
};

export const getStudentHistory = async (req, res) => {
    try {
        const studentId = req.user.id;

        const submissions = await QuizSubmission.find({
            student: studentId,
            status: { $in: ['SUBMITTED', 'GRADED'] }
        })
            .populate('quiz', 'title description dueDate config.timeLimit')
            .sort({ submittedAt: -1 });

        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching quiz history", error: error.message });
    }
};
