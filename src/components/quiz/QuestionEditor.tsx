import React from 'react';
import { Plus, Trash, Check } from 'lucide-react';
import { Question } from '../../types/quiz';

interface QuestionEditorProps {
    question: Partial<Question>;
    index: number;
    onChange: (index: number, updatedQuestion: Partial<Question>) => void;
    onRemove: (index: number) => void;
}

export default function QuestionEditor({ question, index, onChange, onRemove }: QuestionEditorProps) {
    const handleOptionChange = (optIndex: number, value: string) => {
        const newOptions = [...(question.options || [])];
        newOptions[optIndex] = value;
        onChange(index, { ...question, options: newOptions });
    };

    const addOption = () => {
        const newOptions = [...(question.options || []), ''];
        onChange(index, { ...question, options: newOptions });
    };

    const removeOption = (optIndex: number) => {
        const newOptions = (question.options || []).filter((_, i) => i !== optIndex);
        onChange(index, { ...question, options: newOptions });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">Question {index + 1}</h3>
                <button
                    onClick={() => onRemove(index)}
                    className="text-red-600 hover:text-red-700 p-1"
                >
                    <Trash className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question Text
                    </label>
                    <input
                        type="text"
                        value={question.question || ''}
                        onChange={(e) => onChange(index, { ...question, question: e.target.value })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                        placeholder="Enter your question here"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                    </label>
                    <select
                        value={question.type || 'MCQ'}
                        onChange={(e) => onChange(index, { ...question, type: e.target.value as any })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                    >
                        <option value="MCQ">Multiple Choice</option>
                        <option value="TRUE_FALSE">True / False</option>
                        <option value="SHORT_ANSWER">Short Answer</option>
                    </select>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marks
                </label>
                <input
                    type="number"
                    min="1"
                    value={question.marks || 1}
                    onChange={(e) => onChange(index, { ...question, marks: parseInt(e.target.value) })}
                    className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                />
            </div>

            {question.type === 'MCQ' && (
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Options</label>
                    {question.options?.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-3">
                            <input
                                type="radio"
                                name={`correct-${index}`}
                                checked={question.correctAnswer === option && option !== ''}
                                onChange={() => onChange(index, { ...question, correctAnswer: option })}
                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(optIndex, e.target.value)}
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                                placeholder={`Option ${optIndex + 1}`}
                            />
                            <button
                                onClick={() => removeOption(optIndex)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={addOption}
                        type="button"
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                    >
                        <Plus className="w-4 h-4" /> Add Option
                    </button>
                </div>
            )}

            {question.type === 'TRUE_FALSE' && (
                <div className="flex gap-6 mt-4">
                    {['True', 'False'].map((val) => (
                        <label key={val} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name={`correct-${index}`}
                                checked={question.correctAnswer === val}
                                onChange={() => onChange(index, { ...question, correctAnswer: val })}
                                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <span className="text-gray-700">{val}</span>
                        </label>
                    ))}
                </div>
            )}

            {question.type === 'SHORT_ANSWER' && (
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correct Answer (Keyword/Phrase for Auto-grade)
                    </label>
                    <input
                        type="text"
                        value={question.correctAnswer || ''}
                        onChange={(e) => onChange(index, { ...question, correctAnswer: e.target.value })}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                        placeholder="Enter expected answer"
                    />
                </div>
            )}
        </div>
    );
}
