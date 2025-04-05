import { useQuery } from '@tanstack/react-query';

import { transformToLesson } from '#/lesson/helpers/lesson-transform.helper';
import { getStudentLessonsByCurrentStudentUser } from '../api/student-performance.api';

import type { Lesson } from '#/lesson/models/lesson.model';

type Result = {
  lessons?: Lesson[];
  loading?: boolean;
};

export function useStudentLessonPerformanceList(): Result {
  const {
    data: lessons,
    isRefetching,
    isLoading,
  } = useQuery(
    getStudentLessonsByCurrentStudentUser(
      {},
      {
        refetchOnWindowFocus: false,
        initialData: [],
        select: (data: unknown) =>
          Array.isArray(data)
            ? data.map((item: any) => transformToLesson(item))
            : [],
      },
    ),
  );

  return { loading: isLoading || isRefetching, lessons };
}
