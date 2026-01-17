import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import api from "../../utils/api";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";
import { showNotification } from "../../utils/notification/notification.ts";

interface LogItemProps {
  message: string;
  type: "success" | "error" | "info";
}

interface ClassInfo {
  className: string;
  sections: string[];
}

const LogItem: React.FC<LogItemProps> = ({ message, type = "info" }) => {
  const variants = {
    initial: {
      x: -100,
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
      x: 100,
      opacity: 0,
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`flex items-center justify-between p-3 mb-2 rounded-lg shadow-sm
        ${type === "success"
          ? "bg-green-50 border-l-4 border-green-500"
          : type === "error"
            ? "bg-red-50 border-l-4 border-red-500"
            : "bg-gray-50 border-l-4 border-blue-500"
        }`}
    >
      <div className="flex items-center space-x-3">
        {type === "success" ? (
          <Check className="w-5 h-5 text-green-500" />
        ) : type === "error" ? (
          <AlertCircle className="w-5 h-5 text-red-500" />
        ) : null}
        <span
          className={`text-sm ${type === "success"
            ? "text-green-700"
            : type === "error"
              ? "text-red-700"
              : "text-gray-700"
            }`}
        >
          {message}
        </span>
      </div>
      {type === "success" && (
        <div className="flex items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full"
          >
            <Check className="w-3 h-3 mr-1" />
            Marked
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

const MarkAttendance = () => {
  const [capturing, setCapturing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [logs, setLogs] = useState<
    Array<{ message: string; type: "success" | "error" | "info" }>
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
    const socket = io("http://localhost:3000");

    socket.on("attendance-update", (message) => {
      setLogs((prev) => [
        ...prev,
        {
          message: message,
          type: "success",
        },
      ]);
    });

    socket.on("error", (error) => {
      setLogs((prev) => [
        ...prev,
        {
          message: error,
          type: "error",
        },
      ]);
    });

    socket.on("process-ended", (message) => {
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
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Mark Attendance</h2>
        <div className="bg-white rounded-lg shadow p-6">
          {/* Class and Section Selectors */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                disabled={capturing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">-- Select Class --</option>
                {classes.map((cls) => (
                  <option key={cls.className} value={cls.className}>
                    {cls.className}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Section
              </label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                disabled={!selectedClass || capturing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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

          {/* Attendance Buttons */}
          <div className="flex gap-4 mb-4">
            <button
              onClick={capture}
              disabled={!canStartAttendance}
              className={`flex-1 py-2 px-4 text-white rounded-md transition-colors ${canStartAttendance
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-indigo-300 cursor-not-allowed"
                }`}
            >
              {capturing ? "Processing..." : "Start Attendance"}
            </button>
            <button
              onClick={stopCapture}
              disabled={!capturing}
              className={`flex-1 py-2 px-4 text-white rounded-md transition-colors ${capturing
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-300 cursor-not-allowed"
                }`}
            >
              Stop Attendance
            </button>
          </div>

          {/* Logs Display */}
          <div
            ref={logsContainerRef}
            className="mt-4 p-4 bg-gray-50 rounded-md h-[400px] overflow-y-auto"
          >
            <AnimatePresence mode="popLayout">
              {logs.map((log, index) => (
                <LogItem key={index} message={log.message} type={log.type} />
              ))}
            </AnimatePresence>
          </div>

          {result && (
            <div
              className={`mt-4 p-4 rounded-md ${result.includes("Failed") ? "bg-red-100" : "bg-green-100"
                }`}
            >
              {result}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MarkAttendance;
