import { useState, useEffect } from 'react';
import { Send, Trash2, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { announcementService, Announcement, BranchClassSection } from '../../services/announcementService';
import toast from 'react-hot-toast';

const TeacherAnnouncements = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [options, setOptions] = useState<BranchClassSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Form state
    const [message, setMessage] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');

    // Derived options for dropdowns
    const classOptions = options.find(o => o.branch === selectedBranch)?.classes || [];
    const sectionOptions = classOptions.find(c => c.className === selectedClass)?.sections || [];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [announcementsData, optionsData] = await Promise.all([
                announcementService.getTeacherAnnouncements(),
                announcementService.getBranchClassSection()
            ]);
            setAnnouncements(announcementsData);
            setOptions(optionsData);
        } catch (error) {
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleBranchChange = (branch: string) => {
        setSelectedBranch(branch);
        setSelectedClass('');
        setSelectedSection('');
    };

    const handleClassChange = (className: string) => {
        setSelectedClass(className);
        setSelectedSection('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim() || !selectedBranch || !selectedClass || !selectedSection) {
            toast.error('Please fill all fields');
            return;
        }

        setSubmitting(true);
        try {
            await announcementService.createAnnouncement({
                message: message.trim(),
                branch: selectedBranch,
                class: selectedClass,
                section: selectedSection
            });
            toast.success('Announcement sent successfully!');
            setMessage('');
            setSelectedBranch('');
            setSelectedClass('');
            setSelectedSection('');
            fetchData();
        } catch (error) {
            toast.error('Failed to send announcement');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return;

        try {
            await announcementService.deleteAnnouncement(id);
            toast.success('Announcement deleted');
            setAnnouncements(prev => prev.filter(a => a._id !== id));
        } catch (error) {
            toast.error('Failed to delete announcement');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-6 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-6 max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Announcements</h2>

                {/* Create Announcement Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4">Create New Announcement</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Message
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Type your announcement message..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Branch
                                </label>
                                <select
                                    value={selectedBranch}
                                    onChange={(e) => handleBranchChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Select Branch</option>
                                    {options.map((opt) => (
                                        <option key={opt.branch} value={opt.branch}>
                                            {opt.branch}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Class
                                </label>
                                <select
                                    value={selectedClass}
                                    onChange={(e) => handleClassChange(e.target.value)}
                                    disabled={!selectedBranch}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                                >
                                    <option value="">Select Class</option>
                                    {classOptions.map((opt) => (
                                        <option key={opt.className} value={opt.className}>
                                            {opt.className}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Section
                                </label>
                                <select
                                    value={selectedSection}
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                    disabled={!selectedClass}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                                >
                                    <option value="">Select Section</option>
                                    {sectionOptions.map((section) => (
                                        <option key={section} value={section}>
                                            {section}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="h-4 w-4" />
                            {submitting ? 'Sending...' : 'Send Announcement'}
                        </button>
                    </form>
                </div>

                {/* Announcements List */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Sent Announcements</h3>

                    {announcements.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                            No announcements yet. Create your first announcement above!
                        </div>
                    ) : (
                        announcements.map((announcement) => (
                            <div key={announcement._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <p className="text-gray-800 whitespace-pre-wrap">{announcement.message}</p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                                                    {announcement.branch}
                                                </span>
                                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                                    {announcement.class}
                                                </span>
                                                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                                    Section {announcement.section}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">{formatDate(announcement.createdAt)}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(announcement._id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                                            title="Delete announcement"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Replies Toggle */}
                                    <button
                                        onClick={() => setExpandedId(expandedId === announcement._id ? null : announcement._id)}
                                        className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 mt-3"
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                        {announcement.replies.length} {announcement.replies.length === 1 ? 'Reply' : 'Replies'}
                                        {expandedId === announcement._id ? (
                                            <ChevronUp className="h-4 w-4" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>

                                {/* Replies Section */}
                                {expandedId === announcement._id && announcement.replies.length > 0 && (
                                    <div className="border-t bg-gray-50 p-4 space-y-3">
                                        {announcement.replies.map((reply) => (
                                            <div key={reply._id} className="bg-white rounded-md p-3 shadow-sm">
                                                <div className="flex justify-between items-start">
                                                    <span className="font-medium text-gray-800">{reply.studentName}</span>
                                                    <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                                                </div>
                                                <p className="text-gray-600 mt-1">{reply.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TeacherAnnouncements;
