import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { transformToLesson } from '#/lesson/helpers/lesson-transform.helper';
import { getStudentLessonsByPublicIdAndCurrentTeacherUser } from '../api/teacher-performance.api';

import type { Lesson } from '#/lesson/models/lesson.model';

type Result = {
  lessons?: Lesson[];
  loading?: boolean;
};

export function useTeacherStudentLessonPerformanceList(): Result {
  const { publicId } = useParams();

  const {
    data: lessons,
    isRefetching,
    isLoading,
  } = useQuery(
    getStudentLessonsByPublicIdAndCurrentTeacherUser(
      { publicId: publicId || '' },
      {
        refetchOnWindowFocus: false,
        enabled: !!publicId,
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
