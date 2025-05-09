import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToStudentPerformance } from '../helpers/performance-transform.helper';
import { getStudentPerformanceByCurrentStudentUser } from '../api/student-performance.api';

import type { StudentPerformance } from '../models/performance.model';

type Result = {
  student?: StudentPerformance | null;
  loading?: boolean;
};

export function useStudentPerformanceSingle(): Result {
  const schoolYear = useBoundStore((state) => state.schoolYear);

  const {
    data: student,
    isLoading,
    isRefetching,
  } = useQuery(
    getStudentPerformanceByCurrentStudentUser(
      { schoolYearId: schoolYear?.id },
      {
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToStudentPerformance(data);
        },
      },
    ),
  );

  return { loading: isLoading || isRefetching, student };
}
