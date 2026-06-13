import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { getLessonPerformanceByCurrentTeacherUser } from '../api/teacher-performance.api';

import type { TeacherLessonPerformance } from '../models/performance.model';

type Result = {
  lessonPerformance?: TeacherLessonPerformance;
  loading?: boolean;
};

export function useTeacherLessonPerformanceOverview(): Result {
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);

  const queryConfig = useMemo(
    () =>
      getLessonPerformanceByCurrentTeacherUser(schoolYearId, {
        refetchOnWindowFocus: false,
      }),
    [schoolYearId],
  );

  const {
    data: lessonPerformance,
    isLoading,
    isRefetching,
  } = useQuery(queryConfig);

  return { loading: isLoading || isRefetching, lessonPerformance };
}
