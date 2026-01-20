import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import api from "../../utils/api";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Camera, Info, Play, Square } from "lucide-react";
import { showNotification } from "../../utils/notification/notification.ts";

interface LogItemProps {
  message: string;
  type: "success" | "warning" | "error" | "info";
}

interface ClassInfo {
  className: string;
  sections: string[];
}

const LogItem = React.forwardRef<HTMLDivElement, LogItemProps>(({ message, type = "info" }, ref) => {
  const variants = {
    initial: {
      x: -20,
      opacity: 0,
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
    exit: {
      x: 20,
      opacity: 0,
    },
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-emerald-50/80 border-emerald-500 backdrop-blur-sm";
      case "warning":
        return "bg-orange-50/80 border-orange-500 backdrop-blur-sm";
      case "error":
        return "bg-red-50/80 border-red-500 backdrop-blur-sm";
      default:
        return "bg-blue-50/80 border-blue-500 backdrop-blur-sm";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <Check className="w-5 h-5 text-emerald-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-emerald-700";
      case "warning":
        return "text-orange-700";
      case "error":
        return "text-red-700";
      default:
        return "text-blue-700";
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`flex items-center justify-between p-4 mb-3 rounded-xl border-l-4 ${getStyles()}`}
    >
      <div className="flex items-center space-x-3">
        {getIcon()}
        <span className={`text-sm font-medium ${getTextColor()}`}>
          {message}
        </span>
      </div>
      {(type === "success" || type === "warning") && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`flex items-center px-3 py-1 text-xs font-semibold rounded-full ${type === "warning"
            ? "text-orange-700 bg-orange-100"
            : "text-emerald-700 bg-emerald-100"
            }`}
        >
          <Check className="w-3 h-3 mr-1" />
          Marked
        </motion.div>
      )}
    </motion.div>
  );
});

const MarkAttendance = () => {
  const [capturing, setCapturing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [logs, setLogs] = useState<
    Array<{ message: string; type: "success" | "warning" | "error" | "info" }>
  >([]);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Section selection state
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [availableSections, setAvailableSections] = useState<string[]>([]);

  // Fetch classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get("/teacher/classes");
        setClasses(response.data);
      } catch (error) {
        showNotification("Failed to fetch classes", "error");
      }
    };
    fetchClasses();
  }, []);

  // Update available sections when class changes
  useEffect(() => {
    if (selectedClass) {
      const classInfo = classes.find((c) => c.className === selectedClass);
      setAvailableSections(classInfo?.sections || []);
      setSelectedSection(""); // Reset section when class changes
    } else {
      setAvailableSections([]);
      setSelectedSection("");
    }
  }, [selectedClass, classes]);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTo({
        top: logsContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [logs]);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    socket.on("attendance-update", (message) => {
      console.log("Received attendance-update:", message);
      // Detect if message is about absent student and use warning (orange) type
      const isAbsent = message.toLowerCase().includes("absent");
      setLogs((prev) => [
        ...prev,
        {
          message: message,
          type: isAbsent ? "warning" : "success",
        },
      ]);
    });

    // Silently log errors to console but don't show in Activity Log
    socket.on("error", (error) => {
      console.log("Received error (hidden):", error);
    });

    socket.on("process-ended", (message) => {
      console.log("Received process-ended:", message);
      setLogs((prev) => [
        ...prev,
        {
          message: message,
          type: "info",
        },
      ]);
      setCapturing(false);
    });

    // Status updates that don't stop the capturing process
    socket.on("status-update", (message) => {
      console.log("Received status-update:", message);
      setLogs((prev) => [
        ...prev,
        {
          message: message,
          type: "info",
        },
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const capture = async () => {
    if (!selectedClass || !selectedSection) {
      showNotification("Please select a class and section first", "error");
      return;
    }
    setCapturing(true);
    setResult(null);
    setLogs([]); // Clear previous logs
    try {
      await api.post("/teacher/mark-attendance", {
        class: selectedClass,
        section: selectedSection,
      });
    } catch (error) {
      showNotification("Failed to start attendance process", "error");
      setCapturing(false);
    }
  };

  const stopCapture = async () => {
    try {
      const response = await api.post("/teacher/stop-attendance", {
        class: selectedClass,
        section: selectedSection,
      });
      setResult(response.data.message);
      setCapturing(false);
    } catch (error) {
      setResult("Failed to stop process");
    }
  };

  const canStartAttendance = selectedClass && selectedSection && !capturing;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
            <Camera className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Mark Attendance</h2>
            <p className="text-gray-500">Use AI-powered face recognition</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="glass-card p-8 animate-fade-in">
          {/* Class and Section Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                disabled={capturing}
                className="select-modern"
              >
                <option value="">-- Select Class --</option>
                {classes.map((cls) => (
                  <option key={cls.className} value={cls.className}>
                    {cls.className}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Select Section
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                disabled={!selectedClass || capturing}
                className="select-modern"
              >
                <option value="">-- Select Section --</option>
                {availableSections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={capture}
              disabled={!canStartAttendance}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${canStartAttendance
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-300/40 hover:shadow-xl hover:shadow-indigo-300/50 transform hover:scale-[1.02]"
                : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              <Play className="h-5 w-5" />
              <span>{capturing ? "Processing..." : "Start Attendance"}</span>
            </button>
            <button
              onClick={stopCapture}
              disabled={!capturing}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${capturing
                ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 shadow-lg shadow-red-300/40 hover:shadow-xl hover:shadow-red-300/50 transform hover:scale-[1.02]"
                : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              <Square className="h-5 w-5" />
              <span>Stop Attendance</span>
            </button>
          </div>

          {/* Status Indicator */}
          {capturing && (
            <div className="mb-6 flex items-center justify-center space-x-3 p-4 rounded-xl bg-indigo-50/80 border border-indigo-200">
              <div className="relative">
                <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse" />
                <div className="absolute inset-0 h-3 w-3 rounded-full bg-indigo-400 animate-ping" />
              </div>
              <span className="text-sm font-medium text-indigo-700">
                Camera is active - Recognizing faces...
              </span>
            </div>
          )}

          {/* Logs Display */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Activity Log</h3>
            <div
              ref={logsContainerRef}
              className="p-4 bg-gray-50/80 rounded-xl h-[350px] overflow-y-auto custom-scrollbar border border-gray-100"
            >
              <AnimatePresence mode="popLayout">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <LogItem key={index} message={log.message} type={log.type} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Camera className="h-12 w-12 mb-3 opacity-50" />
                    <p className="text-sm">No activity yet</p>
                    <p className="text-xs">Start attendance to see recognition logs</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Result Message */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-6 p-4 rounded-xl font-medium ${result.includes("Failed")
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
            >
              {result}
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MarkAttendance;
