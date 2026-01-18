import { useState } from "react";
import { UserPlus, Camera, Download, MessageCircle, Users, Sparkles, BarChart3, FileText } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { DashboardCard } from "../../components/dashboard";
import { reportService } from "../../services/report/reportService";
import { handleApiError } from "../../utils/errorHandling";
import DateRangeModal from "../../components/attendance/DateRangeModal";
import toast from "react-hot-toast";

const TeacherDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = [
    { label: 'Total Students', value: '45', icon: Users, color: 'from-blue-500 to-cyan-600' },
    { label: 'Quizzes Created', value: '12', icon: FileText, color: 'from-purple-500 to-pink-600' },
    { label: 'Attendance Rate', value: '94%', icon: BarChart3, color: 'from-green-500 to-emerald-600' },
  ];

  const handleDownloadReport = async (date: string) => {
    try {
      await reportService.downloadAttendanceReport(date);
      toast.success("Report downloaded successfully!");
      setIsModalOpen(false);
    } catch (error) {
      handleApiError(error, "Failed to download report");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-900 relative overflow-hidden">
        {/* Animated Background Globs */}
        <motion.div 
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 right-40 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div 
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 15, repeat: Infinity, delay: 1 }}
          className="absolute bottom-40 left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"
        />

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600/80 to-blue-600/80 backdrop-blur-md text-white p-8 relative overflow-hidden border-b border-white/10"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.h1 
              className="text-4xl font-bold mb-2 flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity }}>
                <Sparkles className="w-8 h-8" />
              </motion.div>
              <span>Welcome Back, Educator!</span>
            </motion.h1>
            <motion.p 
              className="text-purple-100 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Manage your classroom with ease and efficiency
            </motion.p>
          </div>
        </motion.div>

        {/* Stats Section */}
        <div className="p-8 max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {stats.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-xl backdrop-blur-sm border border-white/10`}
                  whileHover={{ y: -8 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm font-medium mb-1">{stat.label}</p>
                      <p className="text-4xl font-bold">{stat.value}</p>
                    </div>
                    <motion.div 
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <StatIcon className="w-12 h-12 opacity-30" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Main Content */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full"></div>
              <span>Management Tools</span>
            </h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={{ container: { staggerChildren: 0.1 } }}
              initial="hidden"
              animate="visible"
            >
              {[
                { icon: Camera, title: "Mark Attendance", description: "Take attendance using face recognition", to: "/teacher/mark-attendance" },
                { icon: UserPlus, title: "Add New Student", description: "Register and enroll a new student", to: "/teacher/add-student" },
                { icon: Users, title: "View Students", description: "Manage and view all your students", to: "/teacher/students" },
                { icon: Download, title: "Download Report", description: "Generate attendance reports", onClick: () => setIsModalOpen(true) },
                { icon: MessageCircle, title: "Chat with Students", description: "Communicate with your students", to: "/teacher/chat" },
                { icon: FileText, title: "Create Quiz", description: "Create a new quiz for your class", to: "/teacher/quizzes" },
              ].map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + idx * 0.1 }}
                >
                  <DashboardCard
                    icon={card.icon}
                    title={card.title}
                    description={card.description}
                    to={card.to}
                    onClick={card.onClick}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Date Range Modal */}
          <DateRangeModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onDownload={handleDownloadReport}
          />

          {/* Quick Tips Section */}
          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-8 text-white border border-blue-400/30 backdrop-blur-sm"
              whileHover={{ scale: 1.02, borderColor: "rgba(96, 165, 250, 0.5)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-2xl font-bold mb-3 flex items-center space-x-2">
                <span>📸</span>
                <span>Face Recognition Tips</span>
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-3">
                  <motion.span className="text-2xl">✓</motion.span>
                  <span>Ensure adequate lighting in the classroom</span>
                </li>
                <li className="flex items-start space-x-3">
                  <motion.span className="text-2xl">✓</motion.span>
                  <span>Position camera at eye level for best results</span>
                </li>
                <li className="flex items-start space-x-3">
                  <motion.span className="text-2xl">✓</motion.span>
                  <span>Mark attendance when all students are present</span>
                </li>
              </ul>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-8 text-white border border-purple-400/30 backdrop-blur-sm"
              whileHover={{ scale: 1.02, borderColor: "rgba(168, 85, 247, 0.5)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-2xl font-bold mb-3 flex items-center space-x-2">
                <span>📊</span>
                <span>Quiz Best Practices</span>
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-3">
                  <motion.span className="text-2xl">✓</motion.span>
                  <span>Create clear and concise questions</span>
                </li>
                <li className="flex items-start space-x-3">
                  <motion.span className="text-2xl">✓</motion.span>
                  <span>Include diverse question types</span>
                </li>
                <li className="flex items-start space-x-3">
                  <motion.span className="text-2xl">✓</motion.span>
                  <span>Review student responses regularly</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};
