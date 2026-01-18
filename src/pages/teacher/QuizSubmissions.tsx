import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { quizService } from '../../services/quizService';
import { Loader2, ArrowLeft, Download } from 'lucide-react';
import { format } from 'date-fns';
import DashboardLayout from '../../components/layouts/DashboardLayout';

export default function QuizSubmissions() {
    const { id } = useParams<{ id: string }>();

    const { data: quiz } = useQuery({
        queryKey: ['quiz', id],
        queryFn: () => quizService.getQuiz(id!)
    });

    const { data: submissions, isLoading } = useQuery({
        queryKey: ['quizSubmissions', id],
        queryFn: () => quizService.getQuizSubmissions(id!)
    });

    const exportToCSV = () => {
        if (!submissions || !quiz) return;

        const headers = ['Student Name', 'Register No', 'Score', 'Total Marks', 'Status', 'Submitted At'];
        const rows = submissions.map(sub => [
            sub.student.name,
            sub.student.registerNo,
            sub.score,
            sub.totalMarks,
            sub.status,
            sub.submittedAt ? format(new Date(sub.submittedAt), 'yyyy-MM-dd HH:mm:ss') : '-'
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${quiz.title}_submissions.csv`);
        document.body.appendChild(link);
        link.click();
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'GRADED': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30';
            case 'SUBMITTED': return 'bg-blue-500/20 text-blue-300 border border-blue-400/30';
            default: return 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30';
        }
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
                        className="mb-8 flex justify-between items-start"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div>
                            <Link to="/teacher/quizzes" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 mb-2 transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Back to Quizzes
                            </Link>
                            <h1 className="text-3xl font-bold text-white">{quiz?.title} - Submissions</h1>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={exportToCSV}
                            disabled={!submissions?.length}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/50 font-medium transition-all"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </motion.button>
                    </motion.div>

                    {/* Table */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-800/50 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 shadow-xl"
                    >
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-white/10">
                                <thead className="bg-slate-800/80">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                            Student
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                            Register No
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                            Score
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                            Submitted At
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {submissions?.map((submission, idx) => (
                                        <motion.tr 
                                            key={submission._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="hover:bg-slate-700/30 transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-white">{submission.student.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-300">{submission.student.registerNo}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(submission.status)}`}>
                                                    {submission.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                                {submission.score} / {submission.totalMarks}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                                                {submission.submittedAt ? format(new Date(submission.submittedAt), 'MMM d, h:mm a') : '-'}
                                            </td>
                                        </motion.tr>
                                    ))}
                                    {submissions?.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-400">
                                                No submissions yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}
