import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { getActivityPerformanceByCurrentTeacherUser } from '../api/teacher-performance.api';

import type { TeacherActivityPerformance } from '../models/performance.model';

type Result = {
  activityPerformance?: TeacherActivityPerformance;
  loading?: boolean;
};

export function useTeacherActivityPerformanceOverview(): Result {
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);

  const queryConfig = useMemo(
    () =>
      getActivityPerformanceByCurrentTeacherUser(schoolYearId, {
        refetchOnWindowFocus: false,
      }),
    [schoolYearId],
  );

  const {
    data: activityPerformance,
    isLoading,
    isRefetching,
  } = useQuery(queryConfig);

  return { loading: isLoading || isRefetching, activityPerformance };
}
