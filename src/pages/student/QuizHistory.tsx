import { useQuery } from '@tanstack/react-query';
import { quizService } from '../../services/quizService';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';

export default function QuizHistory() {
    const { data: submissions, isLoading } = useQuery({
        queryKey: ['studentQuizHistory'],
        queryFn: quizService.getStudentHistory
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

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Quiz History</h1>

                {submissions?.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500">No quiz attempts yet.</p>
                        <Link
                            to="/student/quizzes"
                            className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block"
                        >
                            Take a quiz now →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {submissions?.map((submission: any) => (
                            <div
                                key={submission._id}
                                className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {submission.quiz?.title || 'Unknown Quiz'}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {submission.quiz?.description?.slice(0, 100) || 'No description'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-2xl font-bold ${(submission.score / submission.totalMarks) >= 0.7
                                                ? 'text-green-600'
                                                : (submission.score / submission.totalMarks) >= 0.4
                                                    ? 'text-yellow-600'
                                                    : 'text-red-600'
                                            }`}>
                                            {submission.score} / {submission.totalMarks}
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {Math.round((submission.score / submission.totalMarks) * 100)}%
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>
                                            {new Date(submission.submittedAt).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                    <div className={`flex items-center gap-1 ${submission.status === 'GRADED' ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                        {submission.status === 'GRADED' ? (
                                            <><CheckCircle className="w-4 h-4" /> Graded</>
                                        ) : (
                                            <><XCircle className="w-4 h-4" /> {submission.status}</>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <Link
                                        to={`/student/quiz-result/${submission._id}`}
                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                    >
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
