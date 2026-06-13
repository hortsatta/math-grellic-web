import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { getExamBySlugAndCurrentTeacherUser } from '../api/teacher-exam.api';
import { transformToExam } from '../helpers/exam-transform.helper';

import type { Exam } from '../models/exam.model';

type Result = {
  loading: boolean;
  exam?: Exam | null;
};

export function useTeacherExamSingle(): Result {
  const { slug } = useParams();
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);

  const queryConfig = useMemo(
    () =>
      getExamBySlugAndCurrentTeacherUser(
        { slug: slug || '', schoolYearId },
        {
          enabled: !!slug,
          refetchOnWindowFocus: false,
          select: (data: any) => {
            return transformToExam(data, true);
          },
        },
      ),
    [slug, schoolYearId],
  );

  const { data: exam, isLoading, isFetching } = useQuery(queryConfig);

  return { loading: isLoading || isFetching, exam };
}
