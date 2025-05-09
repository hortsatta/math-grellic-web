import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { getActivityPerformanceByCurrentTeacherUser } from '../api/teacher-performance.api';

import type { TeacherActivityPerformance } from '../models/performance.model';

type Result = {
  activityPerformance?: TeacherActivityPerformance;
  loading?: boolean;
};

export function useTeacherActivityPerformanceOverview(): Result {
  const schoolYear = useBoundStore((state) => state.schoolYear);

  const {
    data: activityPerformance,
    isLoading,
    isRefetching,
  } = useQuery(
    getActivityPerformanceByCurrentTeacherUser(schoolYear?.id, {
      refetchOnWindowFocus: false,
    }),
  );

  return { loading: isLoading || isRefetching, activityPerformance };
}
