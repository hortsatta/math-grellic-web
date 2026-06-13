import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToExam } from '#/exam/helpers/exam-transform.helper';
import { getStudentExamsByCurrentStudentUser } from '../api/student-performance.api';

import type { Exam } from '#/exam/models/exam.model';

type Result = {
  exams?: Exam[];
  loading?: boolean;
};

export function useStudentExamPerformanceList(): Result {
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);

  const queryConfig = useMemo(
    () =>
      getStudentExamsByCurrentStudentUser(
        { schoolYearId },
        {
          refetchOnWindowFocus: false,
          initialData: [],
          select: (data: unknown) =>
            Array.isArray(data)
              ? data.map((item: any) => transformToExam(item))
              : [],
        },
      ),
    [schoolYearId],
  );

  const { data: exams, isLoading, isRefetching } = useQuery(queryConfig);

  return { loading: isLoading || isRefetching, exams };
}
