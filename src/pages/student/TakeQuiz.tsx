import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { quizService } from '../../services/quizService';
import { Loader2, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TakeQuiz() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [submissionId, setSubmissionId] = useState<string | null>(null);

    // 1. Start Quiz (create submission record)
    const { data: submission, isLoading: isStarting } = useQuery({
        queryKey: ['startQuiz', id],
        queryFn: () => quizService.startQuiz(id!),
        enabled: !!id,
        retry: false
    });

    // 2. Fetch Quiz Details (questions)
    const { data: quiz, isLoading: isLoadingQuiz } = useQuery({
        queryKey: ['quiz', id],
        queryFn: () => quizService.getQuiz(id!),
        enabled: !!id
    });

    useEffect(() => {
        if (submission && quiz) {
            setSubmissionId(submission._id);
            // Calculate time left based on startedAt + config.timeLimit
            const startTime = new Date(submission.startedAt).getTime();
            const limitMs = quiz.config.timeLimit * 60 * 1000;
            const endTime = startTime + limitMs;

            const interval = setInterval(() => {
                const now = Date.now();
                const diff = Math.ceil((endTime - now) / 1000);

                if (diff <= 0) {
                    clearInterval(interval);
                    setTimeLeft(0);
                    handleSubmit(true); // Auto submit
                } else {
                    setTimeLeft(diff);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [submission, quiz]);

    const submitMutation = useMutation({
        mutationFn: (payload: { id: string, answers: any[] }) =>
            quizService.submitQuiz(payload.id, payload.answers),
        onSuccess: (data) => {
            toast.success('Quiz submitted successfully!');
            // Navigate to result page to show correct answers
            navigate(`/student/quiz-result/${data._id}`);
        },
        onError: () => {
            toast.error('Failed to submit quiz');
        }
    });

    const handleSubmit = (auto = false) => {
        if (!submissionId || !quiz) return;

        const formattedAnswers = Object.entries(answers).map(([qId, ans]) => ({
            questionId: qId,
            answer: ans
        }));

        submitMutation.mutate({ id: submissionId, answers: formattedAnswers });
        if (auto) toast('Time is up! Quiz auto-submitted.', { icon: '⏰' });
    };

    if (isStarting || isLoadingQuiz) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>;
    }

    if (!quiz) return <div className="text-center p-8">Quiz not found</div>;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6 sticky top-4 z-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold">{quiz.title}</h1>
                        <p className="text-sm text-gray-500">Question {Object.keys(answers).length} of {quiz.questions.length} Answered</p>
                    </div>
                    {timeLeft !== null && (
                        <div className={`flex items-center gap-2 text-xl font-mono font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-indigo-600'}`}>
                            <Clock className="w-6 h-6" />
                            {formatTime(timeLeft)}
                        </div>
                    )}
                </div>
            </div>

            {/* Questions */}
            <div className="space-y-8 pb-20">
                {quiz.questions.map((q, i) => (
                    <div key={q._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex gap-4">
                            <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-gray-600">
                                {i + 1}
                            </span>
                            <div className="flex-1">
                                <p className="text-lg font-medium text-gray-900 mb-4">{q.question}</p>

                                {q.type === 'MCQ' && (
                                    <div className="space-y-3">
                                        {q.options?.map((opt, idx) => (
                                            <label key={idx} className={`flex items-center p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${answers[q._id!] === opt ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-200'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name={q._id}
                                                    value={opt}
                                                    checked={answers[q._id!] === opt}
                                                    onChange={(e) => setAnswers({ ...answers, [q._id!]: e.target.value })}
                                                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                                />
                                                <span className="ml-3 text-gray-700">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {q.type === 'TRUE_FALSE' && (
                                    <div className="flex gap-4">
                                        {['True', 'False'].map((opt) => (
                                            <label key={opt} className={`flex-1 flex items-center justify-center p-4 rounded-lg border cursor-pointer hover:bg-gray-50 ${answers[q._id!] === opt ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' : 'border-gray-200'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name={q._id}
                                                    value={opt}
                                                    checked={answers[q._id!] === opt}
                                                    onChange={(e) => setAnswers({ ...answers, [q._id!]: e.target.value })}
                                                    className="sr-only"
                                                />
                                                <span className={`font-medium ${answers[q._id!] === opt ? 'text-indigo-700' : 'text-gray-700'}`}>
                                                    {opt}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {q.type === 'SHORT_ANSWER' && (
                                    <textarea
                                        rows={3}
                                        value={answers[q._id!] || ''}
                                        onChange={(e) => setAnswers({ ...answers, [q._id!]: e.target.value })}
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
                                        placeholder="Type your answer here..."
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                        {Object.keys(answers).length < quiz.questions.length &&
                            <span className="flex items-center text-amber-600 gap-1"><AlertTriangle className="w-4 h-4" /> {quiz.questions.length - Object.keys(answers).length} questions unanswered</span>
                        }
                    </p>
                    <button
                        onClick={() => handleSubmit(false)}
                        disabled={submitMutation.isPending}
                        className="bg-green-600 text-white px-8 py-2 rounded-md hover:bg-green-700 font-medium flex items-center gap-2 shadow-sm"
                    >
                        {submitMutation.isPending ? 'Submitting...' : <><CheckCircle className="w-5 h-5" /> Submit Quiz</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
