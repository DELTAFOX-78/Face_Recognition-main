import { spawn } from "child_process";
import Student from "../models/Student.js";
import { io } from "../index.js";

let pythonProcess = null;
let count = 0;
let present_students = [];

async function executePythonScript(scriptPath, processOutput = false, sub) {
  count++;
  return new Promise((resolve, reject) => {
    // Construct absolute path for the Python script
    const basePath = process.cwd();
    const absoluteScriptPath = `${basePath}/../${scriptPath}`;
    // Change to the AI directory to ensure relative paths in Python scripts work
    const options = { cwd: `${basePath}/../ai` };
    pythonProcess = spawn("python", ["-u", absoluteScriptPath], options);

    if (processOutput) {
      pythonProcess.stdout.on("data", async (data) => {
        try {
          const output = data.toString().trim();

          // Only process if it looks like a register number (alphanumeric, typically 8-15 chars)
          // Skip Python code output, debug messages, etc.
          if (!output || output.includes('(') || output.includes('=') ||
            output.includes('[') || output.includes('{') || output.length > 20) {
            return; // Skip non-register number output
          }

          const student = await Student.findOne({ registerNo: output });
          if (student) {
            present_students.push(student._id.toString());
            io.emit(
              "attendance-update",
              `Attendance marked as Present for: ${student.name}`
            );
            const today = new Date();
            const formattedDate =
              today.getFullYear() +
              "-" +
              String(today.getMonth() + 1).padStart(2, "0") +
              "-" +
              String(today.getDate()).padStart(2, "0");

            student.attendance.push({
              date: formattedDate,
              subject: sub,
              present: true,
            });
            await student.save();
          }
          // Removed "Fake face detected" error - if no student found, just ignore
        } catch (error) {
          // Silently ignore parsing errors
          console.error("Error processing stdout:", error.message);
        }
      });
    }

    pythonProcess.stderr.on("data", (data) => {
      const errorMsg = data.toString();
      // Filter out common Python library warnings, internal messages, and code output
      const ignoredPatterns = [
        'zipfile',
        'DeprecationWarning',
        'UserWarning',
        'FutureWarning',
        'RuntimeWarning',
        'numpy',
        'np.',
        'tensorflow',
        'dlib',
        'cv2',
        'face_recognition',
        'savez',
        'encodings',
        'import',
        'from',
        '.py',
        'Traceback',
        'File "'
      ];
      const shouldIgnore = ignoredPatterns.some(pattern =>
        errorMsg.toLowerCase().includes(pattern.toLowerCase())
      );

      if (!shouldIgnore && errorMsg.length <= 100 && errorMsg.trim().length > 0) {
        io.emit("error", errorMsg);
      }
    });

    pythonProcess.on("close", (code) => {
      if (count == 1) {
        // Use 'status-update' instead of 'process-ended' to avoid disabling Stop button
        io.emit("status-update", `Images Loaded Successfully`);
      }

      pythonProcess = null;
      // Any termination is considered successful since we might kill the process intentionally
      resolve("Process completed");
    });
  });
}

export const stopPythonScript = async (students, sub) => {
  try {
    if (!pythonProcess) {
      return false;
    }

    // Process all absent students in parallel
    await Promise.all(
      students.map(async (id) => {
        if (!present_students.includes(id.toString())) {
          const student = await Student.findById(id.toString());
          if (student) {
            const today = new Date();
            const formattedDate =
              today.getFullYear() +
              "-" +
              String(today.getMonth() + 1).padStart(2, "0") +
              "-" +
              String(today.getDate()).padStart(2, "0");
            student.attendance.push({
              date: formattedDate,
              subject: sub,
              present: false,
            });
            await student.save();
            io.emit(
              "process-ended",
              `Attendance marked as Absent for: ${student.name}`
            );
          }
        }
      })
    );

    pythonProcess.kill();
    present_students = []; // Reset the array
    return true;
  } catch (error) {
    console.error("Error in stopPythonScript:", error);
    io.emit("error", "Error processing absent students");
    throw error;
  }
};

export const runPythonScripts = async (sub) => {
  try {
    // Run EncodeGenerator.py silently

    await executePythonScript("ai/EncodeGenerator.py", false);

    // Run main.py and process its output
    await executePythonScript("ai/main.py", true, sub);
  } catch (error) {
    console.error("Error executing Python scripts:", error);
    throw error;
  }
};
