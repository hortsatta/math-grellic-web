import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { getExamPerformanceByCurrentTeacherUser } from '../api/teacher-performance.api';

import type { TeacherExamPerformance } from '../models/performance.model';

type Result = {
  examPerformance?: TeacherExamPerformance;
  loading?: boolean;
};

export function useTeacherExamPerformanceOverview(): Result {
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);

  const queryConfig = useMemo(
    () =>
      getExamPerformanceByCurrentTeacherUser(schoolYearId, {
        refetchOnWindowFocus: false,
      }),
    [schoolYearId],
  );

  const {
    data: examPerformance,
    isLoading,
    isRefetching,
  } = useQuery(queryConfig);

  return { loading: isLoading || isRefetching, examPerformance };
}
