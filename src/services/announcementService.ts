import api from './api';

export interface Reply {
    _id: string;
    student: string;
    studentName: string;
    message: string;
    createdAt: string;
}

export interface Announcement {
    _id: string;
    teacher: string;
    teacherName: string;
    message: string;
    branch: string;
    class: string;
    section: string;
    replies: Reply[];
    createdAt: string;
}

export interface BranchClassSection {
    branch: string;
    classes: {
        className: string;
        sections: string[];
    }[];
}

export const announcementService = {
    // Teacher endpoints
    createAnnouncement: async (data: { message: string; branch: string; class: string; section: string }) => {
        const response = await api.post('/announcement/teacher', data);
        return response.data;
    },

    getTeacherAnnouncements: async (): Promise<Announcement[]> => {
        const response = await api.get('/announcement/teacher');
        return response.data;
    },

    deleteAnnouncement: async (id: string) => {
        const response = await api.delete(`/announcement/teacher/${id}`);
        return response.data;
    },

    getBranchClassSection: async (): Promise<BranchClassSection[]> => {
        const response = await api.get('/announcement/teacher/options');
        return response.data;
    },

    // Student endpoints
    getStudentAnnouncements: async (): Promise<Announcement[]> => {
        const response = await api.get('/announcement/student');
        return response.data;
    },

    replyToAnnouncement: async (id: string, message: string) => {
        const response = await api.post(`/announcement/student/${id}/reply`, { message });
        return response.data;
    }
};
