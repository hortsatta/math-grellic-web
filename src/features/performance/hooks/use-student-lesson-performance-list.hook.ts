import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToLesson } from '#/lesson/helpers/lesson-transform.helper';
import { getStudentLessonsByCurrentStudentUser } from '../api/student-performance.api';

import type { Lesson } from '#/lesson/models/lesson.model';

type Result = {
  lessons?: Lesson[];
  loading?: boolean;
};

export function useStudentLessonPerformanceList(): Result {
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);

  const queryConfig = useMemo(
    () =>
      getStudentLessonsByCurrentStudentUser(
        { schoolYearId },
        {
          refetchOnWindowFocus: false,
          initialData: [],
          select: (data: unknown) =>
            Array.isArray(data)
              ? data.map((item: any) => transformToLesson(item))
              : [],
        },
      ),
    [schoolYearId],
  );

  const { data: lessons, isRefetching, isLoading } = useQuery(queryConfig);

  return { loading: isLoading || isRefetching, lessons };
}
