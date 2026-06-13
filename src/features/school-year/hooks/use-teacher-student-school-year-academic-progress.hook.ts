import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

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
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);

  const queryConfig = useMemo(
    () =>
      getStudentsAcademicProgressByCurrentTeacherUser(schoolYearId, {
        refetchOnWindowFocus: false,
      }),
    [schoolYearId],
  );

  const {
    data: studentsAcademicProgress,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery(queryConfig);

  return {
    loading: isLoading || isRefetching,
    studentsAcademicProgress: studentsAcademicProgress || null,
    refresh: refetch,
  };
}
