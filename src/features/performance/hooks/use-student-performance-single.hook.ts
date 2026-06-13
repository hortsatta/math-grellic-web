import { useMemo } from 'react';
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
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);

  const queryConfig = useMemo(
    () =>
      getStudentPerformanceByCurrentStudentUser(
        { schoolYearId },
        {
          refetchOnWindowFocus: false,
          select: (data: any) => {
            return transformToStudentPerformance(data);
          },
        },
      ),
    [schoolYearId],
  );

  const { data: student, isLoading, isRefetching } = useQuery(queryConfig);

  return { loading: isLoading || isRefetching, student };
}
