import React, { useState } from "react";
import { Calendar } from "lucide-react";
import Modal from "../common/Modal";

interface DateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (date: string) => void;
}

const DateRangeModal: React.FC<DateRangeModalProps> = ({
  isOpen,
  onClose,
  onDownload,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");

  const getLast10Days = () => {
    const dates = [];
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Date">
      <div className="p-4">
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

        <div className="mt-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onDownload(selectedDate);
              onClose();
            }}
            disabled={!selectedDate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Download
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DateRangeModal;
