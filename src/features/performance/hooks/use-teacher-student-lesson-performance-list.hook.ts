import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToLesson } from '#/lesson/helpers/lesson-transform.helper';
import { getStudentLessonsByPublicIdAndCurrentTeacherUser } from '../api/teacher-performance.api';

import type { Lesson } from '#/lesson/models/lesson.model';

type Result = {
  lessons?: Lesson[];
  loading?: boolean;
};

export function useTeacherStudentLessonPerformanceList(): Result {
  const { publicId } = useParams();
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);

  const queryConfig = useMemo(
    () =>
      getStudentLessonsByPublicIdAndCurrentTeacherUser(
        { publicId: publicId || '', schoolYearId },
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
    [publicId, schoolYearId],
  );

  const { data: lessons, isRefetching, isLoading } = useQuery(queryConfig);

  return { loading: isLoading || isRefetching, lessons };
}
