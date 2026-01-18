import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { quizService } from '../../services/quizService';
import { Loader2, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
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
                <div className="min-h-screen bg-slate-900 flex justify-center items-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            </DashboardLayout>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

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
                    {/* Header */}
                    <motion.div 
                        className="mb-8"
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
                            <h1 className="text-3xl font-bold text-white">Quiz History</h1>
                        </div>
                    </motion.div>

                    {submissions?.length === 0 ? (
                        <motion.div 
                            className="text-center py-12 bg-slate-800/50 rounded-xl border border-white/10 backdrop-blur"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
                            <p className="text-slate-300 mb-4">No quiz attempts yet.</p>
                            <Link
                                to="/student/quizzes"
                                className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                            >
                                Take a quiz now →
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div 
                            className="space-y-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {submissions?.map((submission: any, idx: number) => {
                                const percentage = (submission.score / submission.totalMarks) * 100;
                                let scoreColor = 'text-red-400';
                                let gradeBg = 'from-red-500/20 to-red-600/20 border-red-400/30';
                                
                                if (percentage >= 70) {
                                    scoreColor = 'text-emerald-400';
                                    gradeBg = 'from-emerald-500/20 to-teal-600/20 border-emerald-400/30';
                                } else if (percentage >= 40) {
                                    scoreColor = 'text-yellow-400';
                                    gradeBg = 'from-yellow-500/20 to-orange-600/20 border-yellow-400/30';
                                }

                                return (
                                    <motion.div
                                        key={submission._id}
                                        variants={itemVariants}
                                        className={`bg-gradient-to-br ${gradeBg} p-6 rounded-lg border backdrop-blur-sm hover:shadow-xl transition-all`}
                                        whileHover={{ y: -4 }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-white">
                                                    {submission.quiz?.title || 'Unknown Quiz'}
                                                </h3>
                                                <p className="text-sm text-slate-300 mt-1">
                                                    {submission.quiz?.description?.slice(0, 100) || 'No description'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-2xl font-bold ${scoreColor}`}>
                                                    {submission.score} / {submission.totalMarks}
                                                </div>
                                                <p className={`text-sm ${scoreColor} font-medium`}>
                                                    {Math.round(percentage)}%
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mt-4 text-sm text-slate-300 flex-wrap">
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
                                            <div className={`flex items-center gap-1 ${submission.status === 'GRADED' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                                                {submission.status === 'GRADED' ? (
                                                    <><CheckCircle className="w-4 h-4" /> Graded</>
                                                ) : (
                                                    <><XCircle className="w-4 h-4" /> {submission.status}</>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <Link
                                                to={`/student/quiz-result/${submission._id}`}
                                                className="text-blue-400 hover:text-blue-300 text-sm font-medium inline-flex items-center space-x-1 transition-colors"
                                            >
                                                <span>View Details</span>
                                                <span>→</span>
                                            </Link>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
