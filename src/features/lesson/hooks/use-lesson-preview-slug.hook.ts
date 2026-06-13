import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToLesson } from '../helpers/lesson-transform.helper';
import { getLessonBySlugAndCurrentTeacherUser } from '../api/teacher-lesson.api';

import type { Lesson } from '../models/lesson.model';

type Result = {
  titlePreview: string;
  lesson?: Lesson | null;
};

export function useLessonPreviewSlug(): Result {
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);
  const { slug } = useParams();

  const queryConfig = useMemo(
    () =>
      getLessonBySlugAndCurrentTeacherUser(
        { slug: slug || '', schoolYearId, exclude: 'schedules' },
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

  const { data: lesson } = useQuery(queryConfig);

  const titlePreview = useMemo(
    () => (lesson?.title ? `${lesson?.title} (Preview)` : 'Preview'),
    [lesson],
  );

  return { titlePreview, lesson };
}
