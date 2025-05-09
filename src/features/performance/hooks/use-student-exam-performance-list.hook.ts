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
  const schoolYear = useBoundStore((state) => state.schoolYear);

  const {
    data: exams,
    isLoading,
    isRefetching,
  } = useQuery(
    getStudentExamsByCurrentStudentUser(
      { schoolYearId: schoolYear?.id },
      {
        refetchOnWindowFocus: false,
        initialData: [],
        select: (data: unknown) =>
          Array.isArray(data)
            ? data.map((item: any) => transformToExam(item))
            : [],
      },
    ),
  );

  return { loading: isLoading || isRefetching, exams };
}
