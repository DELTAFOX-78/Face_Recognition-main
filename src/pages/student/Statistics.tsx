import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import AttendanceChart from "../../components/attendance/AttendanceChart";
import AttendanceSummary from "../../components/attendance/AttendanceSummary";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useAttendance } from "../../hooks/useAttendance";
import { ErrorMessage } from "../../components/common/ErrorMessage";

const Statistics = () => {
  const { stats, isLoading, error } = useAttendance();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-900">
          <ErrorMessage message="Failed to load attendance data" />
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-900 p-6 text-center text-slate-400">
          No attendance records found
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-900 relative overflow-hidden p-6">
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

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <motion.div 
                  className="p-3 bg-blue-500/20 rounded-lg"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white">Attendance Statistics</h2>
              </div>
              <motion.span 
                className="text-sm text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Last Updated: {new Date().toLocaleDateString()}
              </motion.span>
            </div>
          </motion.div>

          {/* Attendance Summary */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <AttendanceSummary stats={stats} />
          </motion.div>

          {/* Charts Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/10"
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-cyan-400"></div>
              <span>Subject-wise Attendance</span>
            </h3>
            <AttendanceChart data={stats.records} />
          </motion.div>

          {/* Additional Info Cards */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, staggerChildren: 0.1 }}
          >
            <motion.div 
              className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg p-6 border border-emerald-400/30 backdrop-blur"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
            >
              <p className="text-slate-300 text-sm mb-2">Overall Attendance</p>
              <p className="text-3xl font-bold text-emerald-400">{stats?.overall || 0}%</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-6 border border-blue-400/30 backdrop-blur"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
            >
              <p className="text-slate-300 text-sm mb-2">Classes Attended</p>
              <p className="text-3xl font-bold text-blue-400">{stats?.attended || 0}</p>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-400/30 backdrop-blur"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
            >
              <p className="text-slate-300 text-sm mb-2">Classes Missed</p>
              <p className="text-3xl font-bold text-pink-400">{stats?.missed || 0}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Statistics;
