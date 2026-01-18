import React, { useState } from "react";
import { Users } from "lucide-react";
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
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <p className="text-red-700">Failed to load students</p>
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
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Student Details
            </h2>
            <p className="text-sm text-gray-500">
              Manage and view student information
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard key={student._id} student={student} />
          ))}
          {filteredStudents.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No students found matching your criteria
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewStudents;
