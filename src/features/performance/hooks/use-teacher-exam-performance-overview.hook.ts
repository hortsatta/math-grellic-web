import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { getExamPerformanceByCurrentTeacherUser } from '../api/teacher-performance.api';

import type { TeacherExamPerformance } from '../models/performance.model';

type Result = {
  examPerformance?: TeacherExamPerformance;
  loading?: boolean;
};

export function useTeacherExamPerformanceOverview(): Result {
  const schoolYear = useBoundStore((state) => state.schoolYear);

  const {
    data: examPerformance,
    isLoading,
    isRefetching,
  } = useQuery(
    getExamPerformanceByCurrentTeacherUser(schoolYear?.id, {
      refetchOnWindowFocus: false,
    }),
  );

  return { loading: isLoading || isRefetching, examPerformance };
}
