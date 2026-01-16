import { useQuery } from '@tanstack/react-query';
import { quizService } from '../../services/quizService';
import QuizCard from '../../components/quiz/QuizCard';
import { Loader2, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';

export default function StudentQuizList() {
    const navigate = useNavigate();
    const { data: quizzes, isLoading } = useQuery({
        queryKey: ['studentQuizzes'],
        queryFn: quizService.getStudentQuizzes
    });

    const { data: history } = useQuery({
        queryKey: ['studentQuizHistory'],
        queryFn: quizService.getStudentHistory
    });

    // Create a set of attempted quiz IDs for quick lookup
    const attemptedQuizIds = new Set(
        history?.map((sub: any) => sub.quiz?._id || sub.quiz) || []
    );

    const handleStartQuiz = (id: string) => {
        if (attemptedQuizIds.has(id)) {
            return; // Already attempted
        }
        navigate(`/student/quiz/${id}`);
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Assigned Quizzes</h1>

                {quizzes?.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500">No pending quizzes at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quizzes?.map((quiz) => {
                            const isAttempted = attemptedQuizIds.has(quiz._id);

                            return (
                                <div key={quiz._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isAttempted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {isAttempted ? 'Completed' : 'Pending'}
                                            </span>
                                            <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-1">{quiz.title}</h3>
                                        </div>
                                    </div>

                                    <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-2">
                                        {quiz.description || 'No description provided.'}
                                    </p>

                                    <div className="space-y-2 text-sm text-gray-600 mb-6">
                                        <div>⏱ {quiz.config?.timeLimit || 30} Minutes</div>
                                        <div>📝 {quiz.questions?.length || 0} Questions</div>
                                    </div>

                                    <div className="mt-auto">
                                        {isAttempted ? (
                                            <div className="flex items-center justify-center gap-2 py-2 px-4 border border-green-300 rounded-md text-green-700 bg-green-50">
                                                <CheckCircle className="w-4 h-4" />
                                                <span className="font-medium">Already Attempted</span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleStartQuiz(quiz._id)}
                                                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                                            >
                                                Start Quiz
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

