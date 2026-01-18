import { spawn } from "child_process";
import { execSync } from "child_process";
import { existsSync } from "fs";
import { normalize } from "path";
import Student from "../models/Student.js";
import { io } from "../index.js";

let pythonProcess = null;
let count = 0;
let present_students = [];

// Function to find Python executable
function findPythonCommand() {
  // On Windows, try to get the full path first
  if (process.platform === "win32") {
    const userProfile = process.env.USERPROFILE || "";
    const localAppData = process.env.LOCALAPPDATA || "";
    const commonPaths = [
      // Anaconda Python (common location) - check first
      userProfile + "\\anaconda3\\python.exe",
      userProfile + "\\Anaconda3\\python.exe",
      // Standard Python installations
      localAppData + "\\Programs\\Python\\Python312\\python.exe",
      localAppData + "\\Programs\\Python\\Python311\\python.exe",
      localAppData + "\\Programs\\Python\\Python310\\python.exe",
      "C:\\Python312\\python.exe",
      "C:\\Python311\\python.exe",
      "C:\\Python310\\python.exe",
    ];
    
    // Try full paths first (more reliable on Windows)
    for (const path of commonPaths) {
      const normalizedPath = normalize(path);
      if (existsSync(normalizedPath)) {
        try {
          execSync(`"${normalizedPath}" --version`, { stdio: "ignore" });
          console.log(`[Python] Found at: ${normalizedPath}`);
          return normalizedPath;
        } catch (error) {
          continue;
        }
      }
    }
    
    // Try to find Python using 'where' command on Windows
    try {
      const whereOutput = execSync("where.exe python", { encoding: "utf-8" });
      const paths = whereOutput.trim().split("\n").map(p => p.trim());
      for (const path of paths) {
        if (path.endsWith(".exe")) {
          const normalizedPath = normalize(path);
          if (existsSync(normalizedPath)) {
            try {
              execSync(`"${normalizedPath}" --version`, { stdio: "ignore" });
              console.log(`[Python] Found via 'where': ${normalizedPath}`);
              return normalizedPath;
            } catch (error) {
              continue;
            }
          }
        }
      }
    } catch (error) {
      // 'where' command failed, continue
    }
  }
  
  // Try command names (works if in PATH)
  const commands = ["python3", "python", "py"];
  
  for (const cmd of commands) {
    try {
      execSync(`${cmd} --version`, { stdio: "ignore" });
      // On Windows, try to get full path
      if (process.platform === "win32") {
        try {
          const fullPath = execSync(`where.exe ${cmd}`, { encoding: "utf-8" })
            .trim()
            .split("\n")[0]
            .trim();
          if (fullPath && fullPath.endsWith(".exe")) {
            console.log(`[Python] Found command '${cmd}' at: ${fullPath}`);
            return fullPath;
          }
        } catch (error) {
          // If where fails, use command name
        }
      }
      console.log(`[Python] Using command: ${cmd}`);
      return cmd;
    } catch (error) {
      // Command not found, try next
      continue;
    }
  }
  
  throw new Error(
    "Python not found! Please install Python 3.8+ and ensure it's in your PATH, " +
    "or set PYTHON_PATH environment variable."
  );
}

async function executePythonScript(scriptPath, processOutput = false, sub) {
  count++;
  return new Promise((resolve, reject) => {
    try {
      // Find Python command
      const pythonCmd = findPythonCommand();
      
      // Construct absolute path for the Python script
      const basePath = process.cwd();
      const absoluteScriptPath = normalize(`${basePath}/../${scriptPath}`);
      // Change to the AI directory to ensure relative paths in Python scripts work
      const options = { 
        cwd: normalize(`${basePath}/../ai`),
        shell: process.platform === "win32" // Use shell on Windows for better PATH access
      };
      
      console.log(`[Python] Executing: ${pythonCmd} -u ${absoluteScriptPath}`);
      console.log(`[Python] Working directory: ${options.cwd}`);
      
      // Verify Python executable exists
      if (!existsSync(pythonCmd)) {
        throw new Error(`Python executable not found at: ${pythonCmd}`);
      }
      
      pythonProcess = spawn(pythonCmd, ["-u", absoluteScriptPath], options);
      
      // Add error handler for spawn failures
      pythonProcess.on("error", (error) => {
        console.error("[Python] Spawn error:", error);
        io.emit("error", `Python error: ${error.message}. Please ensure Python is installed and in PATH.`);
        reject(error);
      });

      if (processOutput) {
      pythonProcess.stdout.on("data", async (data) => {
        try {
          const registerNo = data.toString().trim();

          const student = await Student.findOne({ registerNo });
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
          } else {
            io.emit("error", "Fake face detected");
          }
        } catch (error) {
          io.emit(
            "error",
            error.message.toString().length > 100 ? "" : error.message
          );
        }
      });
    }

    pythonProcess.stderr.on("data", (data) => {
      if (!(data.toString().length > 100)) {
        io.emit("error", data.toString());
      }
    });

      pythonProcess.on("close", (code) => {
        if (count == 1) {
          io.emit("process-ended", `Images Loaded Successfully`);
        }

        pythonProcess = null;
        // Any termination is considered successful since we might kill the process intentionally
        resolve("Process completed");
      });
    } catch (error) {
      console.error("[Python] Error setting up Python process:", error);
      io.emit("error", `Python setup error: ${error.message}`);
      reject(error);
    }
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
