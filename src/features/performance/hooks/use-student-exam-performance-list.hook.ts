import { useQuery } from '@tanstack/react-query';

import { transformToExam } from '#/exam/helpers/exam-transform.helper';
import { getStudentExamsByCurrentStudentUser } from '../api/student-performance.api';

import type { Exam } from '#/exam/models/exam.model';

type Result = {
  exams?: Exam[];
  loading?: boolean;
};

export function useStudentExamPerformanceList(): Result {
  const {
    data: exams,
    isLoading,
    isRefetching,
  } = useQuery(
    getStudentExamsByCurrentStudentUser(
      {},
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
