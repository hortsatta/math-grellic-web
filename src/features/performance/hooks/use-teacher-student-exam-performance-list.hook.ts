import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { transformToExam } from '#/exam/helpers/exam-transform.helper';
import { getStudentExamsByPublicIdAndCurrentTeacherUser } from '../api/teacher-performance.api';

import type { Exam } from '#/exam/models/exam.model';

type Result = {
  exams?: Exam[];
  loading?: boolean;
};

export function useTeacherStudentExamPerformanceList(): Result {
  const { publicId } = useParams();

  const {
    data: exams,
    isRefetching,
    isLoading,
  } = useQuery(
    getStudentExamsByPublicIdAndCurrentTeacherUser(
      { publicId: publicId || '' },
      {
        refetchOnWindowFocus: false,
        enabled: !!publicId,
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
