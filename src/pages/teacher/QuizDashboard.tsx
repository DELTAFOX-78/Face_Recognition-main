import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizService } from '../../services/quizService';
import QuizCard from '../../components/quiz/QuizCard';
import { Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layouts/DashboardLayout';

export default function QuizDashboard() {
    const queryClient = useQueryClient();

    // Fetch quizzes
    const { data: quizzes, isLoading } = useQuery({
        queryKey: ['teacherQuizzes'],
        queryFn: quizService.getTeacherQuizzes
    });

    const publishMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => quizService.updateQuizStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teacherQuizzes'] });
            toast.success('Quiz status updated');
        },
        onError: () => {
            toast.error('Failed to update status');
        }
    });

    const handlePublish = (id: string) => {
        publishMutation.mutate({ id, status: 'PUBLISHED' });
    };

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
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Quiz Management</h2>
                    <Link
                        to="/teacher/quizzes/create"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Create Quiz
                    </Link>
                </div>

                {quizzes?.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500">No quizzes created yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quizzes?.map((quiz) => (
                            <QuizCard
                                key={quiz._id}
                                quiz={quiz}
                                role="teacher"
                                onPublish={handlePublish}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

