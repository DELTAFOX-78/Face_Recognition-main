import React, { useState, useEffect, useMemo } from "react";
import { Calendar, Building, BookOpen, Users } from "lucide-react";
import Modal from "../common/Modal";
import { reportService, FilterOption } from "../../services/report/reportService";

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (filters: { date: string; branch: string; class: string; section: string }) => void;
}

const DateRangeModal: React.FC<DateRangeModalProps> = ({
  isOpen,
  onClose,
  onDownload,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchFilterOptions();
    }
  }, [isOpen]);

  const fetchFilterOptions = async () => {
    setLoading(true);
    try {
      const options = await reportService.getFilterOptions();
      setFilterOptions(options);
    } catch (error) {
      console.error("Error fetching filter options:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get available classes based on selected branch
  const availableClasses = useMemo(() => {
    const branchData = filterOptions.find(opt => opt.branch === selectedBranch);
    return branchData?.classes || [];
  }, [filterOptions, selectedBranch]);

  // Get available sections based on selected class
  const availableSections = useMemo(() => {
    const classData = availableClasses.find(c => c.className === selectedClass);
    return classData?.sections || [];
  }, [availableClasses, selectedClass]);

  // Reset dependent dropdowns when parent changes
  const handleBranchChange = (branch: string) => {
    setSelectedBranch(branch);
    setSelectedClass("");
    setSelectedSection("");
  };

  const handleClassChange = (className: string) => {
    setSelectedClass(className);
    setSelectedSection("");
  };

  const handleClose = () => {
    setSelectedDate("");
    setSelectedBranch("");
    setSelectedClass("");
    setSelectedSection("");
    onClose();
  };

  const getLast10Days = () => {
    const dates = [];
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  const canDownload = selectedDate && selectedBranch && selectedClass && selectedSection;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Download Attendance Report">
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="text-center py-4">Loading options...</div>
        ) : (
          <>
            {/* Date Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full appearance-none rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select a date</option>
                  {getLast10Days().map((date) => (
                    <option key={date} value={date}>
                      {new Date(date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Branch Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedBranch}
                  onChange={(e) => handleBranchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full appearance-none rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select a branch</option>
                  {filterOptions.map((opt) => (
                    <option key={opt.branch} value={opt.branch}>
                      {opt.branch}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Class Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  disabled={!selectedBranch}
                  className="pl-10 pr-4 py-2 w-full appearance-none rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a class</option>
                  {availableClasses.map((cls) => (
                    <option key={cls.className} value={cls.className}>
                      {cls.className}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  disabled={!selectedClass}
                  className="pl-10 pr-4 py-2 w-full appearance-none rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a section</option>
                  {availableSections.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDownload({
                date: selectedDate,
                branch: selectedBranch,
                class: selectedClass,
                section: selectedSection,
              });
              handleClose();
            }}
            disabled={!canDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DateRangeModal;
