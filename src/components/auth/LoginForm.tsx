import React from "react";
import { LoginFormProps } from "./types";
import { LoginHeader } from "./LoginHeader";
import { LoginFormFields } from "./LoginFormFields";
import { ErrorMessage } from "../common/ErrorMessage";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  error,
  role,
}) => {
  const isTeacher = role === "teacher";
  
  return (
    <div className="min-h-screen bg-slate-900 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        ></motion.div>
        <motion.div 
          animate={{ x: [0, -80, 0], y: [0, -40, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        ></motion.div>
      </div>
      
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20"
      >
        <Link 
          to="/" 
          className="absolute top-6 left-6 flex items-center space-x-2 text-slate-300 hover:text-blue-400 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>
      </motion.div>

      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div 
          className="max-w-md w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Card with Glassmorphism */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl shadow-2xl overflow-hidden border border-white/10 backdrop-blur-xl">
            {/* Header with gradient */}
            <motion.div 
              className={`h-32 bg-gradient-to-r ${isTeacher ? 'from-purple-600 to-pink-600' : 'from-blue-600 to-cyan-600'} relative overflow-hidden`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <motion.div 
                className="absolute inset-0 opacity-20 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="text-8xl font-bold">{isTeacher ? '👨‍🏫' : '👨‍🎓'}</div>
              </motion.div>
              <div className="relative h-full flex items-end p-6">
                <h1 className="text-2xl font-bold text-white">
                  {isTeacher ? 'Teacher' : 'Student'} Portal
                </h1>
              </div>
            </motion.div>

            {/* Form Content */}
            <motion.div 
              className="p-8 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div>
                <p className="text-slate-300 text-center mb-2 font-medium">
                  {isTeacher 
                    ? 'Welcome back, educator! Access your teaching dashboard.' 
                    : 'Welcome back, student! Access your learning hub.'}
                </p>
              </div>

              <LoginFormFields onSubmit={onSubmit} />
              
              {error && (
                <motion.div 
                  className="bg-red-500/20 border-l-4 border-red-500 p-4 rounded backdrop-blur"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <p className="text-red-300 text-sm font-medium">{error}</p>
                </motion.div>
              )}

              {/* Help & Support Section */}
              <motion.div 
                className={`rounded-lg p-4 border backdrop-blur ${isTeacher ? 'bg-purple-500/10 border-purple-400/30' : 'bg-blue-500/10 border-blue-400/30'}`}
                whileHover={{ scale: 1.02 }}
              >
                <p className={`text-xs font-semibold mb-2 ${isTeacher ? 'text-purple-300' : 'text-blue-300'}`}>🔒 Secure Login</p>
                <p className="text-xs text-slate-300">Your credentials are encrypted and secure. Two-factor authentication available in settings.</p>
              </motion.div>

              {/* Support Link */}
              <div className="text-center text-sm">
                <p className="text-slate-400">
                  Trouble logging in? <a href="#" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Get help</a>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Switch Portal Link */}
          <motion.div 
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <p className="text-slate-400 text-sm mb-3">
              {isTeacher ? 'Are you a student?' : 'Are you a teacher?'}
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={isTeacher ? '/student/login' : '/teacher/login'}
                className={`inline-block px-6 py-2 rounded-lg transition-all font-medium border ${isTeacher ? 'bg-blue-600/20 border-blue-400/50 text-blue-300 hover:bg-blue-600/30 hover:border-blue-400/70' : 'bg-purple-600/20 border-purple-400/50 text-purple-300 hover:bg-purple-600/30 hover:border-purple-400/70'}`}
              >
                Switch to {isTeacher ? 'Student' : 'Teacher'} Portal
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
