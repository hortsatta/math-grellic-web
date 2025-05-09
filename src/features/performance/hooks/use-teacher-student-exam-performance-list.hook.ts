import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToExam } from '#/exam/helpers/exam-transform.helper';
import { getStudentExamsByPublicIdAndCurrentTeacherUser } from '../api/teacher-performance.api';

import type { Exam } from '#/exam/models/exam.model';

type Result = {
  exams?: Exam[];
  loading?: boolean;
};

export function useTeacherStudentExamPerformanceList(): Result {
  const { publicId } = useParams();
  const schoolYear = useBoundStore((state) => state.schoolYear);

  const {
    data: exams,
    isRefetching,
    isLoading,
  } = useQuery(
    getStudentExamsByPublicIdAndCurrentTeacherUser(
      { publicId: publicId || '', schoolYearId: schoolYear?.id },
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
