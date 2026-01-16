import React from 'react';
import QuizForm from '../../components/quiz/QuizForm';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CreateQuiz() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <Link to="/teacher/quizzes" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
                <p className="mt-2 text-gray-600">Design a new assessment or use AI to generate questions.</p>
            </div>

            <QuizForm />
        </div>
    );
}
