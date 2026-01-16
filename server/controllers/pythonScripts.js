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
