import React from 'react';
import { Quiz } from '../../types/quiz';
import { Calendar, Clock, FileText, CheckCircle, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface QuizCardProps {
    quiz: Quiz;
    onPublish: (id: string) => void;
    role: 'teacher' | 'student';
    onStart?: (id: string) => void;
}

export default function QuizCard({ quiz, onPublish, role, onStart }: QuizCardProps) {
    const isTeacher = role === 'teacher';

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${quiz.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                        quiz.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {quiz.status}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-1">{quiz.title}</h3>
                </div>
            </div>

            <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-2">
                {quiz.description || 'No description provided.'}
            </p>

            <div className="space-y-2 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{quiz.config.timeLimit} Minutes</span>
                </div>
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>{quiz.questions.length} Questions</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Due: {format(new Date(quiz.dueDate), 'MMM d, h:mm a')}</span>
                </div>
            </div>

            <div className="mt-auto">
                {isTeacher && quiz.status === 'DRAFT' && (
                    <button
                        onClick={() => onPublish(quiz._id)}
                        className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        <CheckCircle className="w-4 h-4" /> Publish Now
                    </button>
                )}

                {isTeacher && quiz.status === 'PUBLISHED' && (
                    <Link
                        to={`/teacher/quizzes/${quiz._id}/submissions`}
                        className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <Eye className="w-4 h-4" />
                        View Submissions
                    </Link>
                )}

                {!isTeacher && (
                    <button
                        onClick={() => onStart && onStart(quiz._id)}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                        Start Quiz
                    </button>
                )}
            </div>
        </div>
    );
}

