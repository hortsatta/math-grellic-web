import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { getLessonPerformanceByCurrentTeacherUser } from '../api/teacher-performance.api';

import type { TeacherLessonPerformance } from '../models/performance.model';

type Result = {
  lessonPerformance?: TeacherLessonPerformance;
  loading?: boolean;
};

export function useTeacherLessonPerformanceOverview(): Result {
  const schoolYear = useBoundStore((state) => state.schoolYear);

  const {
    data: lessonPerformance,
    isLoading,
    isRefetching,
  } = useQuery(
    getLessonPerformanceByCurrentTeacherUser(schoolYear?.id, {
      refetchOnWindowFocus: false,
    }),
  );

  return { loading: isLoading || isRefetching, lessonPerformance };
}
