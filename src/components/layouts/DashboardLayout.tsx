import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { LogOut, User, Menu, X, Home, Settings, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const isTeacher = user?.role === "teacher";
  const dashboardPath = isTeacher ? "/teacher/dashboard" : "/student/dashboard";

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Top Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left - Logo & Brand */}
            <Link
              to={dashboardPath}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">SA</span>
              </div>
              <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SmartAttend
              </span>
            </Link>

            {/* Center - Breadcrumb */}
            <div className="hidden md:flex items-center text-slate-300 text-sm">
              <Home className="w-4 h-4 mr-2" />
              <span>{isTeacher ? "Teacher" : "Student"} Dashboard</span>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Notifications */}
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors hidden sm:block"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </motion.button>

              {/* User Profile Dropdown */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileDropdown(!isProfileDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-slate-300">{user?.name}</span>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl py-2 border border-white/10 backdrop-blur"
                    >
                      <motion.button 
                        whileHover={{ x: 5 }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-blue-300 hover:bg-blue-500/10 flex items-center space-x-2 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </motion.button>
                      <motion.button 
                        whileHover={{ x: 5 }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-blue-300 hover:bg-blue-500/10 flex items-center space-x-2 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </motion.button>
                      <div className="my-2 border-t border-white/10"></div>
                      <motion.button
                        whileHover={{ x: 5 }}
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center space-x-2 transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
              >
                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/50 border-t border-white/10 py-8 px-4 mt-12 backdrop-blur">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid md:grid-cols-4 gap-8 mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg"></div>
                <span className="font-bold text-white">SmartAttend</span>
              </div>
              <p className="text-sm text-slate-400">Smart Attendance System for Modern Education</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-slate-400 hover:text-slate-300">
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Face Recognition</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Quiz Management</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Analytics</li>
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Contact Us</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">FAQ</li>
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Privacy Policy</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Terms of Service</li>
                <li className="hover:text-blue-400 cursor-pointer transition-colors">Cookie Policy</li>
              </ul>
            </motion.div>
          </motion.div>
          <motion.div 
            className="border-t border-white/10 pt-8 text-center text-sm text-slate-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p>&copy; 2026 SmartAttend. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
