import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <Link to="/teacher/quizzes" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2 mb-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Quizzes
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">{quiz?.title} - Submissions</h1>
                </div>
                <button
                    onClick={exportToCSV}
                    disabled={!submissions?.length}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                </button>
            </div>

            <div className="bg-white shadow overflow-hidden rounded-md border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Student
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Register No
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Score
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Submitted At
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {submissions?.map((submission) => (
                            <tr key={submission._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{submission.student.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{submission.student.registerNo}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${submission.status === 'GRADED' ? 'bg-green-100 text-green-800' :
                                        submission.status === 'SUBMITTED' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {submission.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {submission.score} / {submission.totalMarks}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {submission.submittedAt ? format(new Date(submission.submittedAt), 'MMM d, h:mm a') : '-'}
                                </td>
                            </tr>
                        ))}
                        {submissions?.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No submissions yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
