import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  School,
  Users,
  Camera,
  BarChart3,
  MessageCircle,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Zap,
} from "lucide-react";

const LandingPage = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      icon: Camera,
      title: "Face Recognition",
      description: "AI-powered facial recognition for accurate attendance marking",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Detailed attendance reports and student performance analytics",
    },
    {
      icon: BookOpen,
      title: "Quiz Management",
      description: "Create and manage interactive quizzes for students",
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Direct communication between teachers and students",
    },
    {
      icon: Zap,
      title: "Fast & Reliable",
      description: "Real-time updates and secure data management",
    },
    {
      icon: Users,
      title: "Student Management",
      description: "Easy student enrollment and profile management",
    },
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
    <div className="min-h-screen bg-slate-900 overflow-hidden">
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
        <motion.div 
          animate={{ y: [0, -100, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        ></motion.div>
      </div>

      {/* Header/Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed w-full top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SmartAttend
            </span>
          </motion.div>
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/student/login"
                className="px-4 py-2 text-slate-300 hover:text-blue-400 transition-colors font-medium"
              >
                Student Login
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/teacher/login"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg shadow-blue-500/50 transition-all font-semibold"
              >
                Teacher Login
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Left Content */}
            <motion.div className="space-y-8" variants={itemVariants}>
              <div>
                <motion.h1 
                  className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  Smart Attendance Made
                  <motion.span 
                    className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    Simple & Secure
                  </motion.span>
                </motion.h1>
                <motion.p 
                  className="text-xl text-slate-300 leading-relaxed mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  Revolutionary facial recognition attendance system combined with powerful quiz management.
                  Perfect for modern educational institutions.
                </motion.p>
              </div>

              {/* Key Benefits - Animated List */}
              <motion.div className="space-y-4" variants={containerVariants}>
                <motion.div 
                  className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-all"
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                >
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-white">No Manual Roll Calls</h3>
                    <p className="text-slate-400 text-sm">Automatic attendance via face recognition</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-all"
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                >
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}>
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-white">Real-time Analytics</h3>
                    <p className="text-slate-400 text-sm">Track attendance patterns and trends</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-all"
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                >
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}>
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-white">Secure & Encrypted</h3>
                    <p className="text-slate-400 text-sm">Enterprise-grade security for all data</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-4"
                variants={itemVariants}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/student/login"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg shadow-blue-500/50 transition-all font-semibold flex items-center justify-center space-x-2"
                  >
                    <span>Student Portal</span>
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/teacher/login"
                    className="px-8 py-3 border-2 border-purple-500 text-purple-300 rounded-lg hover:bg-purple-500/10 transition-all font-semibold flex items-center justify-center space-x-2 hover:border-purple-400"
                  >
                    <span>Teacher Portal</span>
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Visual - Animated */}
            <motion.div 
              className="hidden md:block"
              variants={itemVariants}
            >
              <motion.div 
                className="relative"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-3xl opacity-30"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                ></motion.div>
                <motion.div 
                  className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-white/10 backdrop-blur"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div 
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                  >
                    <motion.div 
                      className="h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-white/10"
                      variants={itemVariants}
                    >
                      <Camera className="w-24 h-24 text-blue-400 opacity-60" />
                    </motion.div>
                    <motion.div 
                      className="grid grid-cols-3 gap-4"
                      variants={containerVariants}
                    >
                      <motion.div 
                        className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-4 rounded-lg text-center border border-white/10 hover:border-blue-400 transition-all"
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                      >
                        <p className="text-2xl font-bold text-blue-400">99.8%</p>
                        <p className="text-xs text-slate-400 mt-1">Accuracy</p>
                      </motion.div>
                      <motion.div 
                        className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-4 rounded-lg text-center border border-white/10 hover:border-purple-400 transition-all"
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                      >
                        <p className="text-2xl font-bold text-purple-400">&lt;1s</p>
                        <p className="text-xs text-slate-400 mt-1">Detection</p>
                      </motion.div>
                      <motion.div 
                        className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-4 rounded-lg text-center border border-white/10 hover:border-green-400 transition-all"
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                      >
                        <p className="text-2xl font-bold text-green-400">24/7</p>
                        <p className="text-xs text-slate-400 mt-1">Available</p>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-400">Everything you need for modern attendance management</p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  whileHover={{ y: -10 }}
                  className="p-8 rounded-xl border border-white/10 hover:border-blue-500/50 hover:shadow-xl shadow-blue-500/20 transition-all bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur group cursor-pointer"
                >
                  <motion.div 
                    className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-6 shadow-lg"
                    animate={hoveredCard === index ? { scale: 1.1, rotate: 10 } : { scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Portal Selection Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">Choose Your Portal</h2>
            <p className="text-xl text-slate-400">Select your role to get started</p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
          >
            {/* Student Portal */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <Link
                to="/student/login"
                className="group relative overflow-hidden rounded-2xl p-12 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 hover:border-blue-500/50 transition-all hover:shadow-2xl shadow-blue-500/20 backdrop-blur flex flex-col items-center text-center"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity"
                ></motion.div>
                <div className="relative z-10 w-full">
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:shadow-lg shadow-blue-500/50 transition-all mx-auto"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Users className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-4">Student Portal</h3>
                  <motion.ul 
                    className="space-y-3 mb-8"
                    variants={containerVariants}
                  >
                    {['View attendance records', 'Take quizzes', 'Chat with teachers', 'View statistics'].map((item, i) => (
                      <motion.li 
                        key={i}
                        className="flex items-center space-x-3 text-slate-300"
                        variants={itemVariants}
                      >
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                  <motion.div 
                    className="inline-flex items-center space-x-2 text-blue-400 font-semibold group-hover:space-x-3 transition-all"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span>Login as Student</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </Link>
            </motion.div>

            {/* Teacher Portal */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <Link
                to="/teacher/login"
                className="group relative overflow-hidden rounded-2xl p-12 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 hover:border-purple-500/50 transition-all hover:shadow-2xl shadow-purple-500/20 backdrop-blur flex flex-col items-center text-center"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity"
                ></motion.div>
                <div className="relative z-10 w-full">
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:shadow-lg shadow-purple-500/50 transition-all mx-auto"
                    whileHover={{ scale: 1.1 }}
                  >
                    <School className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-4">Teacher Portal</h3>
                  <motion.ul 
                    className="space-y-3 mb-8"
                    variants={containerVariants}
                  >
                    {['Mark attendance with face recognition', 'Create & manage quizzes', 'View student reports', 'Generate analytics'].map((item, i) => (
                      <motion.li 
                        key={i}
                        className="flex items-center space-x-3 text-slate-300"
                        variants={itemVariants}
                      >
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                  <motion.div 
                    className="inline-flex items-center space-x-2 text-purple-400 font-semibold group-hover:space-x-3 transition-all"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span>Login as Teacher</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <motion.div 
          className="container mx-auto max-w-4xl text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-2xl opacity-50"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 backdrop-blur border border-white/10">
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of institutions using SmartAttend for seamless attendance management
              </p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/student/login"
                    className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-semibold flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <span>Login as Student</span>
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/teacher/login"
                    className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:bg-opacity-10 transition-all font-semibold flex items-center justify-center space-x-2"
                  >
                    <span>Login as Teacher</span>
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950/50 border-t border-white/10 text-slate-400 py-12 px-4 backdrop-blur">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            className="grid md:grid-cols-4 gap-8 mb-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
          >
            <motion.div variants={itemVariants}>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg"></div>
                <span className="font-bold text-white">SmartAttend</span>
              </div>
              <p className="text-sm">Smart Attendance System for Modern Education</p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Face Recognition</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Quiz Management</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Analytics</li>
              </ul>
            </motion.div>
            <motion.div variants={itemVariants}>
              <h4 className="font-semibold text-white mb-4">For</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Students</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Teachers</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Institutions</li>
              </ul>
            </motion.div>
            <motion.div variants={itemVariants}>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="hover:text-blue-400 transition-colors cursor-pointer">support@smartattend.com</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">+1 (555) 123-4567</li>
              </ul>
            </motion.div>
          </motion.div>
          <motion.div 
            className="border-t border-white/10 pt-8 text-center text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p>&copy; 2026 SmartAttend. All rights reserved.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;