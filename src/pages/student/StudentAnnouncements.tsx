import { useState, useEffect } from 'react';
import { Send, ChevronDown, ChevronUp, Bell } from 'lucide-react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { announcementService, Announcement } from '../../services/announcementService';
import toast from 'react-hot-toast';

const StudentAnnouncements = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const data = await announcementService.getStudentAnnouncements();
            setAnnouncements(data);
        } catch (error) {
            toast.error('Failed to load announcements');
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (announcementId: string) => {
        if (!replyMessage.trim()) {
            toast.error('Please enter a reply message');
            return;
        }

        setSubmitting(true);
        try {
            const result = await announcementService.replyToAnnouncement(announcementId, replyMessage.trim());
            toast.success('Reply sent successfully!');
            setReplyMessage('');
            setReplyingTo(null);

            // Update announcement with new reply
            setAnnouncements(prev => prev.map(a =>
                a._id === announcementId ? result.announcement : a
            ));
        } catch (error) {
            toast.error('Failed to send reply');
        } finally {
            setSubmitting(false);
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
                <div className="flex items-center gap-3 mb-6">
                    <Bell className="h-6 w-6 text-indigo-600" />
                    <h2 className="text-2xl font-bold">Announcements</h2>
                </div>

                {announcements.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-700">No Announcements</h3>
                        <p className="text-gray-500 mt-2">You don't have any announcements yet. Check back later!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {announcements.map((announcement) => (
                            <div key={announcement._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-5">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <span className="font-semibold text-indigo-600">{announcement.teacherName}</span>
                                            <p className="text-xs text-gray-500 mt-1">{formatDate(announcement.createdAt)}</p>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <p className="text-gray-800 whitespace-pre-wrap mb-4">{announcement.message}</p>

                                    {/* Replies Toggle */}
                                    <div className="flex items-center gap-4 border-t pt-3">
                                        <button
                                            onClick={() => setExpandedId(expandedId === announcement._id ? null : announcement._id)}
                                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600"
                                        >
                                            {announcement.replies.length} {announcement.replies.length === 1 ? 'Reply' : 'Replies'}
                                            {expandedId === announcement._id ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            )}
                                        </button>

                                        <button
                                            onClick={() => setReplyingTo(replyingTo === announcement._id ? null : announcement._id)}
                                            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800"
                                        >
                                            <Send className="h-4 w-4" />
                                            Reply
                                        </button>
                                    </div>
                                </div>

                                {/* Reply Form */}
                                {replyingTo === announcement._id && (
                                    <div className="border-t bg-indigo-50 p-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={replyMessage}
                                                onChange={(e) => setReplyMessage(e.target.value)}
                                                placeholder="Type your reply..."
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleReply(announcement._id);
                                                    }
                                                }}
                                            />
                                            <button
                                                onClick={() => handleReply(announcement._id)}
                                                disabled={submitting}
                                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                                            >
                                                <Send className="h-4 w-4" />
                                                {submitting ? 'Sending...' : 'Send'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Replies List */}
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
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default StudentAnnouncements;
