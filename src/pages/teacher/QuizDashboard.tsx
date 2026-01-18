import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { quizService } from '../../services/quizService';
import QuizCard from '../../components/quiz/QuizCard';
import { Plus, Loader2, FileText } from 'lucide-react';
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
                <div className="min-h-screen bg-slate-900 flex justify-center items-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-slate-900 relative overflow-hidden p-6">
                {/* Animated Background Globs */}
                <motion.div 
                    animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute top-20 right-40 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"
                />
                <motion.div 
                    animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
                    transition={{ duration: 15, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-40 left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"
                />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div 
                        className="flex justify-between items-center mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center space-x-3">
                            <motion.div 
                                className="p-3 bg-purple-500/20 rounded-lg"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <FileText className="w-6 h-6 text-purple-400" />
                            </motion.div>
                            <h2 className="text-3xl font-bold text-white">Quiz Management</h2>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/teacher/quizzes/create"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-purple-500/50 font-medium transition-all"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Create Quiz
                            </Link>
                        </motion.div>
                    </motion.div>

                    {quizzes?.length === 0 ? (
                        <motion.div 
                            className="text-center py-12 bg-slate-800/50 rounded-xl border border-white/10 backdrop-blur"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
                            <p className="text-slate-300">No quizzes created yet.</p>
                        </motion.div>
                    ) : (
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ staggerChildren: 0.1 }}
                        >
                            {quizzes?.map((quiz, idx) => (
                                <motion.div
                                    key={quiz._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <QuizCard
                                        quiz={quiz}
                                        role="teacher"
                                        onPublish={handlePublish}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

