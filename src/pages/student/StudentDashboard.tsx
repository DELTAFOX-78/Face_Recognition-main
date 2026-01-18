import { BarChart3, MessageCircle, ClipboardList, History, Bell, LayoutDashboard } from 'lucide-react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { DashboardCard } from '../../components/dashboard';

const StudentDashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-200/50">
            <LayoutDashboard className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-gray-500">Welcome back! Here's your overview</p>
          </div>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            icon={BarChart3}
            title="View Statistics"
            description="Check your attendance records"
            to="/student/statistics"
          />

          <DashboardCard
            icon={MessageCircle}
            title="Chat with Teacher"
            description="Communicate with your teacher"
            to="/student/chat"
          />

          <DashboardCard
            icon={ClipboardList}
            title="Take Quiz"
            description="View and attempt assigned quizzes"
            to="/student/quizzes"
          />

          <DashboardCard
            icon={History}
            title="Quiz History"
            description="View your past quiz attempts and scores"
            to="/student/quiz-history"
          />

          <DashboardCard
            icon={Bell}
            title="Announcements"
            description="View announcements from teachers"
            to="/student/announcements"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;