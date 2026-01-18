import React from "react";
import { GraduationCap, Users } from "lucide-react";

interface ClassFilterProps {
  classes: Array<{ class: string; sections: string[] }>;
  selectedClass: string;
  selectedSection: string;
  onClassChange: (value: string) => void;
  onSectionChange: (value: string) => void;
}

const SelectWrapper = ({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon: any;
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    {children}
  </div>
);

const ClassFilter: React.FC<ClassFilterProps> = ({
  classes,
  selectedClass,
  selectedSection,
  onClassChange,
  onSectionChange,
}) => {
  const sections =
    classes.find((c) => c.class === selectedClass)?.sections || [];

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <SelectWrapper icon={GraduationCap}>
        <select
          value={selectedClass}
          onChange={(e) => onClassChange(e.target.value)}
          className="pl-10 pr-4 py-2 w-full sm:w-48 appearance-none rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
        >
          <option value="">All Classes</option>
          {classes.map((c) => (
            <option key={c.class} value={c.class}>
              Class {c.class}
            </option>
          ))}
        </select>
      </SelectWrapper>

      <SelectWrapper icon={Users}>
        <select
          value={selectedSection}
          onChange={(e) => onSectionChange(e.target.value)}
          disabled={!selectedClass}
          className="pl-10 pr-4 py-2 w-full sm:w-48 appearance-none rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-500"
        >
          <option value="">All Sections</option>
          {sections.map((section) => (
            <option key={section} value={section}>
              Section {section}
            </option>
          ))}
        </select>
      </SelectWrapper>
    </div>
  );
};

export default ClassFilter;
