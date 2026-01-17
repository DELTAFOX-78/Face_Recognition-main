import { useState } from "react";
import { UserPlus, Camera, Download, MessageCircle, Users, Bell } from "lucide-react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { DashboardCard } from "../../components/dashboard";
import { reportService } from "../../services/report/reportService";
import { handleApiError } from "../../utils/errorHandling";
import DateRangeModal from "../../components/attendance/DateRangeModal";

const TeacherDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownloadReport = async (filters: { date: string; branch: string; class: string; section: string }) => {
    try {
      await reportService.downloadAttendanceReport(filters);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            icon={UserPlus}
            title="Add New Student"
            description="Register a new student"
            to="/teacher/add-student"
          />

          <DashboardCard
            icon={Users}
            title="View Students"
            description="Manage your students"
            to="/teacher/students"
          />

          <DashboardCard
            icon={Camera}
            title="Mark Attendance"
            description="Take attendance using face recognition"
            to="/teacher/mark-attendance"
          />

          <DashboardCard
            icon={Download}
            title="Download Report"
            description="Get attendance report"
            onClick={() => setIsModalOpen(true)}
          />
          <DateRangeModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onDownload={handleDownloadReport}
          />

          <DashboardCard
            icon={MessageCircle}
            title="Chat with Students"
            description="Communicate with your students"
            to="/teacher/chat"
          />
          <DashboardCard
            icon={MessageCircle}
            title="Create Quiz"
            description="Create a new quiz"
            to="/teacher/quizzes"
          />
          <DashboardCard
            icon={Bell}
            title="Announcements"
            description="Send announcements to students"
            to="/teacher/announcements"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
