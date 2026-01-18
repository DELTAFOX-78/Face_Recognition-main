import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { quizService } from '../../services/quizService';
import { Loader2, CheckCircle, XCircle, Home, RotateCcw, Trophy } from 'lucide-react';
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
                <div className="min-h-screen bg-slate-900 flex justify-center items-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            </DashboardLayout>
        );
    }

    if (!submission) {
        return (
            <DashboardLayout>
                <div className="min-h-screen bg-slate-900 text-center p-8 text-slate-300">Submission not found</div>
            </DashboardLayout>
        );
    }

    const quiz = submission.quiz as any;
    const percentage = submission.totalMarks > 0 ? Math.round((submission.score / submission.totalMarks) * 100) : 0;
    
    const getScoreColor = () => {
        if (percentage >= 70) return { bg: 'from-emerald-500/20 to-teal-600/20 border-emerald-400/30', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-300' };
        if (percentage >= 40) return { bg: 'from-yellow-500/20 to-orange-600/20 border-yellow-400/30', text: 'text-yellow-400', badge: 'bg-yellow-500/20 text-yellow-300' };
        return { bg: 'from-red-500/20 to-red-600/20 border-red-400/30', text: 'text-red-400', badge: 'bg-red-500/20 text-red-300' };
    };

    const scoreColor = getScoreColor();

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

                <div className="max-w-4xl mx-auto relative z-10">
                    {/* Score Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-gradient-to-br ${scoreColor.bg} p-8 rounded-xl border backdrop-blur-sm mb-8 text-center shadow-xl`}
                    >
                        <motion.div 
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Trophy className={`w-12 h-12 mx-auto mb-4 ${scoreColor.text}`} />
                        </motion.div>
                        
                        <h1 className="text-3xl font-bold text-white mb-2">Quiz Completed!</h1>
                        <p className="text-slate-300 mb-6">{quiz?.title}</p>

                        <motion.div 
                            className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-4xl font-bold ${scoreColor.badge} border-2 border-current`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                        >
                            {percentage}%
                        </motion.div>

                        <p className="text-2xl font-semibold mt-4 text-white">
                            <span className={scoreColor.text}>
                                {submission.score}
                            </span>
                            <span className="text-slate-400"> / {submission.totalMarks}</span>
                        </p>

                        <motion.p 
                            className="text-slate-300 mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {percentage >= 70 ? '🎉 Excellent work!' :
                                percentage >= 40 ? '👍 Good effort! Keep practicing.' :
                                    '📚 Keep learning, you\'ll do better next time!'}
                        </motion.p>
                    </motion.div>

                    {/* Review Section */}
                    <motion.h2 
                        className="text-xl font-bold text-white mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        Review Your Answers
                    </motion.h2>

                    <motion.div 
                        className="space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, staggerChildren: 0.1 }}
                    >
                        {quiz?.questions?.map((q: any, idx: number) => {
                            const userAnswer = submission.answers?.find((a: any) => a.questionId === q._id)?.answer;
                            const isCorrect = userAnswer === q.correctAnswer;

                            return (
                                <motion.div 
                                    key={q._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`bg-gradient-to-br ${isCorrect ? 'from-emerald-500/20 to-teal-600/20 border-emerald-400/30' : 'from-red-500/20 to-red-600/20 border-red-400/30'} p-6 rounded-lg border backdrop-blur-sm`}
                                    whileHover={{ y: -4 }}
                                >
                                    <div className="flex gap-3 items-start mb-4">
                                        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${isCorrect ? 'bg-emerald-500/30 text-emerald-200' : 'bg-red-500/30 text-red-200'}`}>
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1">
                                            <p className="text-lg font-medium text-white">{q.question}</p>
                                            <p className="text-sm text-slate-300 mt-1">
                                                {q.marks} mark{q.marks > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                        <motion.div 
                                            initial={{ rotate: -180, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            {isCorrect ? (
                                                <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                                            ) : (
                                                <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                                            )}
                                        </motion.div>
                                    </div>

                                    {/* Options for MCQ */}
                                    {q.type === 'MCQ' && (
                                        <div className="space-y-2 mt-4">
                                            {q.options?.map((opt: string, optIdx: number) => {
                                                const isThisCorrect = opt === q.correctAnswer;
                                                const isThisSelected = opt === userAnswer;

                                                let className = 'p-3 rounded-lg border flex items-center justify-between backdrop-blur ';

                                                if (isThisCorrect) {
                                                    className += 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200';
                                                } else if (isThisSelected && !isThisCorrect) {
                                                    className += 'bg-red-500/20 border-red-400/50 text-red-200';
                                                } else {
                                                    className += 'bg-slate-700/30 border-white/10 text-slate-300';
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

                                                let className = 'flex-1 p-4 rounded-lg border text-center font-medium backdrop-blur ';

                                                if (isThisCorrect) {
                                                    className += 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200';
                                                } else if (isThisSelected && !isThisCorrect) {
                                                    className += 'bg-red-500/20 border-red-400/50 text-red-200';
                                                } else {
                                                    className += 'bg-slate-700/30 border-white/10 text-slate-300';
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
                                            <div className={`p-3 rounded-lg backdrop-blur ${isCorrect ? 'bg-emerald-500/20 border border-emerald-400/30' : 'bg-red-500/20 border border-red-400/30'}`}>
                                                <p className="text-sm text-slate-300">Your Answer:</p>
                                                <p className="font-medium text-white">{userAnswer || '(No answer provided)'}</p>
                                            </div>
                                            {!isCorrect && (
                                                <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-400/30 backdrop-blur">
                                                    <p className="text-sm text-slate-300">Correct Answer:</p>
                                                    <p className="font-medium text-emerald-300">{q.correctAnswer}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Actions */}
                    <motion.div 
                        className="flex justify-center gap-4 mt-8 pb-8 flex-wrap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Link
                            to="/student/quizzes"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-800 text-white rounded-lg border border-white/10 font-medium transition-all hover:shadow-lg hover:shadow-blue-500/20"
                        >
                            <RotateCcw className="w-5 h-5" />
                            More Quizzes
                        </Link>
                        <Link
                            to="/student"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 font-medium transition-all"
                        >
                            <Home className="w-5 h-5" />
                            Dashboard
                        </Link>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}
