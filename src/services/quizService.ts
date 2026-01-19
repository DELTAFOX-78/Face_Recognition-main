import api from './api';
import { Quiz, CreateQuizData, QuizSubmission } from '../types/quiz';

export const quizService = {
    // Teacher Methods
    createQuiz: async (data: any) => {
        const response = await api.post<Quiz>('/quiz/create', data);
        return response.data;
    },

    getClasses: async () => {
        const response = await api.get<{ branch: string, classes: { className: string, sections: string[] }[] }[]>('/teacher/filter-options');
        return response.data;
    },

    generateQuizAI: async (formData: FormData) => {
        const response = await api.post<{ questions: any[], resourceFile: string }>('/quiz/generate', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    },

    getTeacherQuizzes: async () => {
        const response = await api.get<Quiz[]>('/quiz/teacher');
        return response.data;
    },

    updateQuizStatus: async (id: string, status: string) => {
        const response = await api.put<Quiz>(`/quiz/${id}/status`, { status });
        return response.data;
    },

    getQuizSubmissions: async (quizId: string) => {
        const response = await api.get<QuizSubmission[]>(`/quiz/${quizId}/submissions`);
        return response.data;
    },

    // Student Methods
    getStudentQuizzes: async () => {
        const response = await api.get<Quiz[]>('/quiz/student/pending');
        return response.data;
    },

    startQuiz: async (quizId: string) => {
        const response = await api.post<QuizSubmission>('/quiz/start', { quizId });
        return response.data;
    },

    submitQuiz: async (submissionId: string, answers: { questionId: string, answer: string }[]) => {
        const response = await api.post<QuizSubmission>(`/quiz/submit/${submissionId}`, { answers });
        return response.data;
    },

    getStudentHistory: async () => {
        const response = await api.get<QuizSubmission[]>('/quiz/student/history');
        return response.data;
    },

    // Common Methods
    getQuiz: async (id: string) => {
        const response = await api.get<Quiz>(`/quiz/${id}`);
        return response.data;
    },

    getSubmission: async (id: string) => {
        const response = await api.get<QuizSubmission>(`/quiz/submission/${id}`);
        return response.data;
    }
};
