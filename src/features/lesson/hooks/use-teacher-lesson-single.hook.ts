import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { getLessonBySlugAndCurrentTeacherUser } from '../api/teacher-lesson.api';
import { transformToLesson } from '../helpers/lesson-transform.helper';

import type { Lesson } from '../models/lesson.model';

type Result = {
  loading: boolean;
  lesson?: Lesson | null;
};

export function useTeacherLessonSingle(): Result {
  const { slug } = useParams();
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);

  const queryConfig = useMemo(
    () =>
      getLessonBySlugAndCurrentTeacherUser(
        { slug: slug || '', schoolYearId },
        {
          enabled: !!slug,
          refetchOnWindowFocus: false,
          select: (data: any) => {
            return transformToLesson(data);
          },
        },
      ),
    [slug, schoolYearId],
  );

  const { data: lesson, isLoading, isFetching } = useQuery(queryConfig);

  return { loading: isLoading || isFetching, lesson };
}
