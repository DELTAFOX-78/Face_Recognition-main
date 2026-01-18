import React, { useState } from "react";
import { Users, Search } from "lucide-react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useStudents } from "../../hooks/useStudents";
import StudentCard from "../../components/students/StudentCard";
import ClassFilter from "../../components/students/ClassFilter";
import SearchBar from "../../components/students/SearchBar";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const ViewStudents = () => {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const { students, classes, isLoading, error } = useStudents();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl">
            <p className="text-red-700 font-medium">Failed to load students</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesClass = !selectedClass || student.class === selectedClass;
    const matchesSection =
      !selectedSection || student.section === selectedSection;
    return matchesSearch && matchesClass && matchesSection;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
            <Users className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Student Details
            </h2>
            <p className="text-gray-500">
              Manage and view student information
            </p>
          </div>
        </div>

        {/* Filters Card */}
        <div className="glass-card p-6 space-y-6 animate-fade-in">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          <div className="border-t border-gray-100 pt-6">
            <ClassFilter
              classes={classes}
              selectedClass={selectedClass}
              selectedSection={selectedSection}
              onClassChange={setSelectedClass}
              onSectionChange={setSelectedSection}
            />
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student, index) => (
            <div
              key={student._id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <StudentCard student={student} />
            </div>
          ))}
          {filteredStudents.length === 0 && (
            <div className="col-span-full">
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-lg font-medium text-gray-500">No students found</p>
                <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewStudents;
