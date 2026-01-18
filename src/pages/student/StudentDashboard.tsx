import { BarChart3, MessageCircle, ClipboardList, History, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { DashboardCard } from '../../components/dashboard';

const StudentDashboard = () => {
  const stats = [
    { label: 'Attendance Rate', value: 92, icon: TrendingUp, color: 'from-emerald-600 to-emerald-700', suffix: '%' },
    { label: 'Quizzes Completed', value: 8, icon: ClipboardList, color: 'from-blue-600 to-blue-700', suffix: '' },
    { label: 'Average Score', value: 85, icon: BarChart3, color: 'from-purple-600 to-purple-700', suffix: '%' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-900 overflow-hidden relative">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-40 -left-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          ></motion.div>
          <motion.div 
            animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          ></motion.div>
        </div>

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-white/5 backdrop-blur-xl p-8"
        >
          <div className="flex items-center space-x-4">
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-8 h-8 text-blue-400" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">Welcome Back, Student!</h1>
              <p className="text-slate-300">Let's continue your learning journey</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="relative z-10 p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }}
                  className={`group relative bg-gradient-to-br ${stat.color} rounded-2xl overflow-hidden p-8 border border-white/10 cursor-pointer transition-all duration-300`}
                >
                  {/* Card glow effect */}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                  
                  <div className="relative flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm font-medium mb-3 uppercase tracking-wider">{stat.label}</p>
                      <motion.p 
                        className="text-5xl font-bold text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {stat.value}{stat.suffix}
                      </motion.p>
                    </div>
                    <motion.div 
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="opacity-30 group-hover:opacity-50 transition-opacity"
                    >
                      <StatIcon className="w-16 h-16 text-white" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Access Section */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full"></div>
              <span>Quick Access</span>
            </h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <DashboardCard
                icon={BarChart3}
                title="View Statistics"
                description="Check your attendance records and performance"
                to="/student/statistics"
              />

              <DashboardCard
                icon={MessageCircle}
                title="Chat with Teacher"
                description="Communicate and get help from your teacher"
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
            </motion.div>
          </motion.div>

          {/* Motivational Section */}
          <motion.div 
            className="group relative bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-2xl p-8 border border-white/10 backdrop-blur overflow-hidden"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center space-x-2">
              <span>Keep Learning! 🎯</span>
            </h3>
            <p className="text-slate-300 max-w-2xl leading-relaxed relative z-10">
              You're doing great! Keep up with your attendance and complete more quizzes to improve your scores. 
              Your dedication will pay off!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;