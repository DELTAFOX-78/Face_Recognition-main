import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { quizService } from '../../services/quizService';
import { Loader2, CheckCircle, XCircle, Home, RotateCcw } from 'lucide-react';
import DashboardLayout from '../../components/layouts/DashboardLayout';

export default function QuizResult() {
    const { id } = useParams<{ id: string }>();

    const { data: submission, isLoading } = useQuery({
        queryKey: ['quizSubmission', id],
        queryFn: () => quizService.getSubmission(id!),
        enabled: !!id
    });

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            </DashboardLayout>
        );
    }

    if (!submission) {
        return (
            <DashboardLayout>
                <div className="text-center p-8">Submission not found</div>
            </DashboardLayout>
        );
    }

    const quiz = submission.quiz as any;
    const percentage = submission.totalMarks > 0 ? Math.round((submission.score / submission.totalMarks) * 100) : 0;

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Score Header */}
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
                    <p className="text-gray-600 mb-6">{quiz?.title}</p>

                    <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-4xl font-bold ${percentage >= 70 ? 'bg-green-100 text-green-700' :
                        percentage >= 40 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                        {percentage}%
                    </div>

                    <p className="text-2xl font-semibold mt-4">
                        <span className={percentage >= 70 ? 'text-green-600' : percentage >= 40 ? 'text-yellow-600' : 'text-red-600'}>
                            {submission.score}
                        </span>
                        <span className="text-gray-400"> / {submission.totalMarks}</span>
                    </p>

                    <p className="text-gray-500 mt-2">
                        {percentage >= 70 ? 'Excellent work! 🎉' :
                            percentage >= 40 ? 'Good effort! Keep practicing.' :
                                'Keep learning, you\'ll do better next time!'}
                    </p>
                </div>

                {/* Review Section */}
                <h2 className="text-xl font-bold text-gray-900 mb-4">Review Your Answers</h2>

                <div className="space-y-6">
                    {quiz?.questions?.map((q: any, idx: number) => {
                        const userAnswer = submission.answers?.find((a: any) => a.questionId === q._id)?.answer;
                        const isCorrect = userAnswer === q.correctAnswer;

                        return (
                            <div key={q._id} className="bg-white p-6 rounded-lg border border-gray-200">
                                <div className="flex gap-3 items-start mb-4">
                                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {idx + 1}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-lg font-medium text-gray-900">{q.question}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {q.marks} mark{q.marks > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    {isCorrect ? (
                                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                                    )}
                                </div>

                                {/* Options for MCQ */}
                                {q.type === 'MCQ' && (
                                    <div className="space-y-2 mt-4">
                                        {q.options?.map((opt: string, optIdx: number) => {
                                            const isThisCorrect = opt === q.correctAnswer;
                                            const isThisSelected = opt === userAnswer;

                                            let className = 'p-3 rounded-lg border flex items-center justify-between ';

                                            if (isThisCorrect) {
                                                className += 'bg-green-50 border-green-500 text-green-800 ring-1 ring-green-500';
                                            } else if (isThisSelected && !isThisCorrect) {
                                                className += 'bg-red-50 border-red-500 text-red-800 ring-1 ring-red-500';
                                            } else {
                                                className += 'bg-gray-50 border-gray-200 text-gray-600';
                                            }

                                            return (
                                                <div key={optIdx} className={className}>
                                                    <span>{opt}</span>
                                                    <span className="text-sm font-medium">
                                                        {isThisCorrect && '✓ Correct'}
                                                        {isThisSelected && !isThisCorrect && '✗ Your Answer'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* True/False */}
                                {q.type === 'TRUE_FALSE' && (
                                    <div className="flex gap-4 mt-4">
                                        {['True', 'False'].map((opt) => {
                                            const isThisCorrect = opt === q.correctAnswer;
                                            const isThisSelected = opt === userAnswer;

                                            let className = 'flex-1 p-4 rounded-lg border text-center font-medium ';

                                            if (isThisCorrect) {
                                                className += 'bg-green-50 border-green-500 text-green-800';
                                            } else if (isThisSelected && !isThisCorrect) {
                                                className += 'bg-red-50 border-red-500 text-red-800';
                                            } else {
                                                className += 'bg-gray-50 border-gray-200 text-gray-600';
                                            }

                                            return (
                                                <div key={opt} className={className}>
                                                    {opt}
                                                    {isThisCorrect && <span className="ml-2">✓</span>}
                                                    {isThisSelected && !isThisCorrect && <span className="ml-2">✗</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Short Answer */}
                                {q.type === 'SHORT_ANSWER' && (
                                    <div className="mt-4 space-y-3">
                                        <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                            <p className="text-sm text-gray-500">Your Answer:</p>
                                            <p className="font-medium">{userAnswer || '(No answer provided)'}</p>
                                        </div>
                                        {!isCorrect && (
                                            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                                                <p className="text-sm text-gray-500">Correct Answer:</p>
                                                <p className="font-medium text-green-700">{q.correctAnswer}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-4 mt-8 pb-8">
                    <Link
                        to="/student/quizzes"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                    >
                        <RotateCcw className="w-5 h-5" />
                        More Quizzes
                    </Link>
                    <Link
                        to="/student"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                    >
                        <Home className="w-5 h-5" />
                        Dashboard
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
