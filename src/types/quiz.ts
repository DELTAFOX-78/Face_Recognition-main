export type QuestionType = 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER';

export interface Question {
    _id?: string;
    type: QuestionType;
    question: string;
    options?: string[];
    correctAnswer?: string; // Optional (not shown to student)
    marks: number;
}

export interface QuizConfig {
    timeLimit: number;
    shuffleQuestions: boolean;
    showResultsImmediately: boolean;
}

export interface QuizAssignedTo {
    branch: string;
    class: string;
    section: string;
}

export interface Quiz {
    _id: string;
    title: string;
    description?: string;
    teacher: string; // Teacher ID
    resourceFile?: string;
    assignedTo: QuizAssignedTo;
    questions: Question[];
    config: QuizConfig;
    dueDate: string;
    status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
    createdAt: string;
    updatedAt: string;
}

export interface Answer {
    questionId: string;
    answer: string;
}

export interface QuizSubmission {
    _id: string;
    quiz: Quiz | string;
    student: string | any;
    answers: Answer[];
    score: number;
    totalMarks: number;
    status: 'STARTED' | 'SUBMITTED' | 'GRADED';
    startedAt: string;
    submittedAt?: string;
}

export interface CreateQuizData {
    title: string;
    description: string;
    assignedTo: QuizAssignedTo;
    questions: Omit<Question, '_id'>[];
    config: QuizConfig;
    dueDate: Date;
    resourceFile?: File; // For upload
}
