import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { Student } from '../types/student';

interface UseStudentsReturn {
  students: Student[];
  classes: Array<{ class: string; sections: string[] }>;
  isLoading: boolean;
  error: unknown;
}

export const useStudents = (): UseStudentsReturn => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await api.get('/teacher/students');
      return response.data;
    },
  });

  const classes = data?.students.reduce((acc: any[], student: Student) => {
    const classGroup = acc.find(c => c.class === student.class);
    if (!classGroup) {
      acc.push({
        class: student.class,
        sections: [student.section]
      });
    } else if (!classGroup.sections.includes(student.section)) {
      classGroup.sections.push(student.section);
    }
    return acc;
  }, []) || [];

  return {
    students: data?.students || [],
    classes,
    isLoading,
    error
  };
};