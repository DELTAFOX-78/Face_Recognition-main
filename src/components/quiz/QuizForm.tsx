import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { quizService } from '../../services/quizService';
import { CreateQuizData, Question } from '../../types/quiz';
import QuestionEditor from './QuestionEditor';
import { Plus, Save, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function QuizForm() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [className, setClassName] = useState('');
    const [section, setSection] = useState('');
    const [timeLimit, setTimeLimit] = useState(30);
    const [dueDate, setDueDate] = useState('');
    const [questions, setQuestions] = useState<Partial<Question>[]>([]);

    // AI Generation State
    const [file, setFile] = useState<File | null>(null);
    const [topic, setTopic] = useState('');
    const [numQuestions, setNumQuestions] = useState(5);
    const [isGenerating, setIsGenerating] = useState(false);

    const { data: classes } = useQuery({
        queryKey: ['teacherClasses'],
        queryFn: quizService.getClasses
    });

    const availableSections = classes?.find(c => c.className === className)?.sections || [];

    const createMutation = useMutation({
        mutationFn: quizService.createQuiz,
        onSuccess: () => {
            toast.success('Quiz created successfully!');
            navigate('/teacher/quizzes');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create quiz');
        }
    });

    const handleAddQuestion = () => {
        setQuestions([...questions, { type: 'MCQ', options: ['', ''], marks: 1 }]);
    };

    const handleQuestionChange = (index: number, updatedQuestion: Partial<Question>) => {
        const newQuestions = [...questions];
        newQuestions[index] = updatedQuestion;
        setQuestions(newQuestions);
    };

    const handleRemoveQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleGenerateAI = async () => {
        if (!file) return toast.error("Please upload a file first");
        if (!topic.trim()) return toast.error("Please enter a topic for question generation");

        const formData = new FormData();
        formData.append('resource', file);
        formData.append('topic', topic);
        formData.append('numQuestions', numQuestions.toString());

        setIsGenerating(true);
        try {
            const data = await quizService.generateQuizAI(formData);

            // Append generated questions to existing ones
            const generatedQs = data.questions.map((q: any) => ({
                ...q,
                options: q.options || [],
            }));

            setQuestions([...questions, ...generatedQs]);
            toast.success("Questions generated successfully!");
        } catch (error) {
            toast.error("Failed to generate questions");
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!title || !className || !section || !dueDate) {
            return toast.error("Please fill all required fields");
        }
        if (questions.length === 0) {
            return toast.error("Please add at least one question");
        }

        const quizData: CreateQuizData = {
            title,
            description,
            assignedTo: { class: className, section },
            questions: questions as any,
            config: {
                timeLimit,
                shuffleQuestions: false,
                showResultsImmediately: true
            },
            dueDate: new Date(dueDate)
        };

        createMutation.mutate(quizData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-12">
            {/* Header / Basic Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-6">Quiz Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                            required
                        />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                        <select
                            value={className}
                            onChange={(e) => {
                                setClassName(e.target.value);
                                setSection(''); // Reset section when class changes
                            }}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                            required
                        >
                            <option value="">Select Class</option>
                            {classes?.map((cls) => (
                                <option key={cls.className} value={cls.className}>
                                    {cls.className}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                        <select
                            value={section}
                            onChange={(e) => setSection(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                            required
                            disabled={!className}
                        >
                            <option value="">Select Section</option>
                            {availableSections?.map((sec) => (
                                <option key={sec} value={sec}>
                                    {sec}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (Minutes)</label>
                        <input
                            type="number"
                            value={timeLimit}
                            onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input
                            type="datetime-local"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* AI Generator */}
            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                <div className="flex items-center gap-2 mb-4">
                    <Loader2 className={`w-5 h-5 text-indigo-600 ${isGenerating ? 'animate-spin' : ''}`} />
                    <h3 className="text-lg font-medium text-indigo-900">AI Question Generator</h3>
                </div>
                <div className="flex gap-4 items-end flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Resource (PDF/Text)
                        </label>
                        <input
                            type="file"
                            accept=".pdf,.txt"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                        <input
                            type="text"
                            placeholder="e.g., Machine Learning, IoT, History..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                        />
                    </div>
                    <div className="w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Questions</label>
                        <input
                            type="number"
                            min="1"
                            max="20"
                            value={numQuestions}
                            onChange={(e) => setNumQuestions(parseInt(e.target.value) || 5)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleGenerateAI}
                        disabled={!file || isGenerating}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {isGenerating ? 'Generating...' : <><Upload className="w-4 h-4" /> Generate</>}
                    </button>
                </div>
            </div>

            {/* Questions List */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Questions ({questions.length})</h2>
                    <button
                        type="button"
                        onClick={handleAddQuestion}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Question
                    </button>
                </div>

                {questions.map((q, i) => (
                    <QuestionEditor
                        key={i}
                        index={i}
                        question={q}
                        onChange={handleQuestionChange}
                        onRemove={handleRemoveQuestion}
                    />
                ))}
            </div>

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={() => navigate('/teacher/quizzes')}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="bg-green-600 text-white px-8 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
                >
                    {createMutation.isPending ? 'Saving...' : <><Save className="w-4 h-4" /> Save Quiz</>}
                </button>
            </div>
        </form>
    );
}
