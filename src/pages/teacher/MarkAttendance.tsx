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
        ${
          type === "success"
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
          className={`text-sm ${
            type === "success"
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

    return () => {
      socket.disconnect();
    };
  }, []);

  const capture = async () => {
    setCapturing(true);
    setResult(null);
    try {
      await api.post("/teacher/mark-attendance");
    } catch (error) {
      showNotification("Failed to start attendance process", "error");
      setCapturing(false);
    }
  };

  const stopCapture = async () => {
    try {
      const response = await api.post("/teacher/stop-attendance");
      setResult(response.data.message);
      setCapturing(false);
    } catch (error) {
      setResult("Failed to stop process");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Mark Attendance</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-4 mb-4">
            <button
              onClick={capture}
              disabled={capturing}
              className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md"
            >
              {capturing ? "Processing..." : "Start Attendance"}
            </button>
            <button
              onClick={stopCapture}
              className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md"
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
              className={`mt-4 p-4 rounded-md ${
                result.includes("Failed") ? "bg-red-100" : "bg-green-100"
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
