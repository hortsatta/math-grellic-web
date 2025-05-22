import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { getStudentsAcademicProgressByCurrentTeacherUser } from '../api/teacher-school-year-enrollment.api';

import type { QueryObserverBaseResult } from '@tanstack/react-query';
import type { TeacherStudentSchoolYearAcademicProgress } from '../models/school-year.model';

type Result = {
  loading: boolean;
  studentsAcademicProgress: TeacherStudentSchoolYearAcademicProgress | null;
  refresh: QueryObserverBaseResult['refetch'];
};

export function useTeacherStudentSchoolYearAcademicProgress(): Result {
  const schoolYear = useBoundStore((state) => state.schoolYear);

  const {
    data: studentsAcademicProgress,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery(
    getStudentsAcademicProgressByCurrentTeacherUser(schoolYear?.id, {
      refetchOnWindowFocus: false,
    }),
  );

  return {
    loading: isLoading || isRefetching,
    studentsAcademicProgress: studentsAcademicProgress || null,
    refresh: refetch,
  };
}
