import { BarChart3, MessageCircle, ClipboardList, History, Bell } from 'lucide-react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { DashboardCard } from '../../components/dashboard';

const StudentDashboard = () => {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
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