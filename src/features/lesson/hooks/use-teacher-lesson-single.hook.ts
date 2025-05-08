import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getLessonBySlugAndCurrentTeacherUser } from '../api/teacher-lesson.api';
import { transformToLesson } from '../helpers/lesson-transform.helper';

import type { Lesson } from '../models/lesson.model';
import { useBoundStore } from '#/core/hooks/use-store.hook';

type Result = {
  loading: boolean;
  lesson?: Lesson | null;
};

export function useTeacherLessonSingle(): Result {
  const schoolYear = useBoundStore((state) => state.schoolYear);
  const { slug } = useParams();

  const {
    data: lesson,
    isLoading,
    isFetching,
  } = useQuery(
    getLessonBySlugAndCurrentTeacherUser(
      { slug: slug || '', schoolYearId: schoolYear?.id },
      {
        enabled: !!slug,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToLesson(data);
        },
      },
    ),
  );

  return { loading: isLoading || isFetching, lesson };
}
