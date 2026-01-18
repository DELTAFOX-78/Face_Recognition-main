import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Student } from "../../types/student";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getImageUrl } from "../../utils/imageUtils";
import { Trash2, Save, X, ArrowLeft } from "lucide-react";
import DashboardLayout from "../../components/layouts/DashboardLayout";

const EditStudent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await api.get(`/teacher/edit-student/${id}`);
        setStudent(response.data);
        setPhotoPreview(getImageUrl(response.data.photo));
      } catch (error) {
        toast.error("Failed to fetch student data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!student) return;

    try {
      const formData = new FormData();
      formData.append("name", student.name);
      formData.append("class", student.class);
      formData.append("section", student.section);
      formData.append("registerNo", student.registerNo);
      formData.append("username", student.username);
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      await api.put(`/teacher/edit-student/${id}`, formData);
      toast.success("Student updated successfully");
      navigate("/teacher/students");
    } catch (error) {
      toast.error("Failed to update student");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/teacher/edit-student/${id}`);
      toast.success("Student deleted successfully");
      navigate("/teacher/students");
    } catch (error) {
      toast.error("Failed to delete student");
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!student) return <div>Student not found</div>;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto mb-6">
          <button
            onClick={() => navigate("/teacher/students")}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Students
          </button>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-1">
                  <div className="space-y-4">
                    <img
                      src={photoPreview}
                      alt={student.name}
                      className="w-full h-64 rounded-lg object-cover shadow-md"
                    />
                    <label className="block">
                      <span className="sr-only">Choose photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-3 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100
                          cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                <div className="col-span-2 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={student.name}
                      onChange={(e) =>
                        setStudent({ ...student, name: e.target.value })
                      }
                      className="h-12 px-4 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Class
                      </label>
                      <input
                        type="text"
                        value={student.class}
                        onChange={(e) =>
                          setStudent({ ...student, class: e.target.value })
                        }
                        className="h-12 px-4 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Section
                      </label>
                      <input
                        type="text"
                        value={student.section}
                        onChange={(e) =>
                          setStudent({ ...student, section: e.target.value })
                        }
                        className="h-12 px-4 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Register Number
                      </label>
                      <input
                        type="text"
                        value={student.registerNo}
                        onChange={(e) =>
                          setStudent({ ...student, registerNo: e.target.value })
                        }
                        className="h-12 px-4 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={student.username}
                        onChange={(e) =>
                          setStudent({ ...student, username: e.target.value })
                        }
                        className="h-12 px-4 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Delete Student
                </button>

                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate("/teacher/students")}
                    className="flex items-center px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Delete Student
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this student? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EditStudent;
