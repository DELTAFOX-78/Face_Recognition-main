import { useState } from "react";
import { UserPlus, Camera, Download, MessageCircle, Users, Bell, ClipboardList, LayoutDashboard } from "lucide-react";
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
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
            <LayoutDashboard className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-gray-500">Manage your classroom and students</p>
          </div>
        </div>

        {/* Dashboard Cards Grid */}
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
            icon={ClipboardList}
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
