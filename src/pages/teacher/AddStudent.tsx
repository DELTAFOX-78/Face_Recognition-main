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
  ArrowLeft,
  Phone,
} from "lucide-react";
import api from "../../utils/api.ts";
import { showNotification } from "../../utils/notification/notification.ts";

interface Student {
  id: string;
  name: string;
  photo: string;
  class: string;
  branch: string;
  section: string;
  registerNo: string;
  username: string;
  mobileNumber?: string;
}

const AddStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    branch: "",
    section: "",
    registerNo: "",
    username: "",
    password: "",
    mobileNumber: "",
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
      formDataToSend.append("mobileNumber", formData.mobileNumber);
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
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
            <UserPlus className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Add New Student
            </h2>
            <p className="text-gray-500">
              Enter student details to create a new account
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    required
                    className="pl-12 block w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white/80 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                    placeholder="John Doe"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Class */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Class</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    name="class"
                    value={formData.class}
                    required
                    className="pl-12 block w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white/80 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                    placeholder="1st Year, 2nd Year, etc."
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Branch */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Branch</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    required
                    className="pl-12 block w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white/80 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                    placeholder="CSE, ECE, MECH, etc."
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Section */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Section</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    required
                    className="pl-12 block w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white/80 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                    placeholder="A"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Register Number */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Register Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    name="registerNo"
                    value={formData.registerNo}
                    required
                    className="pl-12 block w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white/80 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                    placeholder="RVCE24BCS___"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Mobile Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    className="pl-12 block w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white/80 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                    placeholder="10-digit mobile number"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    required
                    className="pl-12 block w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white/80 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                    placeholder="johndoe"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    required
                    className="pl-12 block w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-white/80 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                    placeholder="••••••••"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Student Photo
              </label>
              <div className="mt-2 flex items-center space-x-6">
                <div className="flex-shrink-0">
                  {preview ? (
                    <div className="relative group">
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-28 w-28 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <Camera className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 w-28 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center border-2 border-dashed border-gray-300">
                      <Camera className="h-10 w-10 text-gray-400" />
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
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-indigo-50 file:to-purple-50 file:text-indigo-700 hover:file:from-indigo-100 hover:file:to-purple-100 file:cursor-pointer file:transition-all file:duration-200"
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Upload a clear photo of the student. JPG, PNG formats accepted.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl animate-slide-down">
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
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/teacher/dashboard")}
                className="group flex items-center space-x-2 px-6 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-200/50 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform duration-200" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border border-transparent rounded-xl text-sm font-semibold text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/30 shadow-lg shadow-indigo-300/40 hover:shadow-xl hover:shadow-indigo-300/50 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
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
