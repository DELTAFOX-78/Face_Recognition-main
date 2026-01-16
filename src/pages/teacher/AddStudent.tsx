import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import Popup from "../../components/Popup/Popup.tsx";
import {
  User,
  BookOpen,
  Users,
  Hash,
  UserPlus,
  Lock,
  Camera,
} from "lucide-react";
import api from "../../utils/api.ts";
import { showNotification } from "../../utils/notification/notification.ts";

interface Student {
  id: string;
  name: string;
  photo: string;
  class: string;
  section: string;
  registerNo: string;
  username: string;
}

const AddStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    section: "",
    registerNo: "",
    username: "",
    password: "",
    photo: null as File | null,
  });
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [existingStudent, setExistingStudent] = useState<Student | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files && files[0]) {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await api.post("/teacher/add-student", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.exists) {
        setExistingStudent(response.data.student);
        setShowPopup(true);
      } else {
        showNotification("Student added successfully", "success");
        navigate("/teacher/dashboard");
      }
    } catch (err) {
      console.error("Failed to add student", err);
      setError("Failed to add student");
    }
  };

  const handleAddExistingStudent = async () => {
    if (!existingStudent) {
      setError("No existing student selected.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("class", formData.class);
      formDataToSend.append("section", formData.section);
      formDataToSend.append("registerNo", existingStudent.registerNo);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      await api.post("/teacher/add-student", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Student added to your list successfully!");
      setShowPopup(false);
      navigate("/teacher/dashboard");
    } catch (err) {
      console.error("Failed to add existing student", err);
      setError("Failed to add existing student");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center space-x-4 mb-8">
            <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Add New Student
              </h2>
              <p className="text-gray-500">
                Enter student details to create a new account
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    className="pl-10 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="John Doe"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Class Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Branch
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="class"
                    required
                    className="pl-10 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="CSE"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Section Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Section
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="section"
                    required
                    className="pl-10 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="A"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Register Number Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Register Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="registerNo"
                    required
                    className="pl-10 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="RVCE24BCS___"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    required
                    className="pl-10 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="johndoe"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    className="pl-10 block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="••••••••"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Student Photo
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-24 w-24 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    required
                    onChange={handleChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Upload a clear photo of the student. JPG, PNG formats
                    accepted.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate("/teacher/dashboard")}
                className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add Student
              </button>
            </div>
          </form>
        </div>
      </div>
      {showPopup && existingStudent && (
        <Popup
          student={existingStudent}
          onAdd={handleAddExistingStudent}
          onClose={() => setShowPopup(false)}
        />
      )}
    </DashboardLayout>
  );
};

export default AddStudent;
