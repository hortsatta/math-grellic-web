import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToStudentPerformance } from '../helpers/performance-transform.helper';
import { getPaginatedStudentPerformancesByCurrentTeacherUser } from '../api/teacher-performance.api';
import { StudentPerformanceType } from '../models/performance.model';

import type { StudentPerformance } from '../models/performance.model';

type Result = {
  students: StudentPerformance[];
  loading: boolean;
  refresh: () => void;
};

export function useTeacherStudentPerformanceLeaderboard(
  performance: StudentPerformanceType,
): Result {
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);

  const queryConfig = useMemo(
    () =>
      getPaginatedStudentPerformancesByCurrentTeacherUser(
        {
          q: undefined,
          performance,
          sort: 'rank,asc',
          pagination: { take: 5, skip: 0 },
          schoolYearId,
        },
        {
          refetchOnWindowFocus: false,
          select: (data: any[]) => {
            const [items, totalCount] = data;
            const transformedItems =
              items?.map((item: unknown) =>
                transformToStudentPerformance(item),
              ) || [];

            return [transformedItems, +totalCount];
          },
        },
      ),
    [performance, schoolYearId],
  );

  const {
    data,
    isLoading,
    isRefetching,
    refetch: refresh,
  } = useQuery(queryConfig);

  const students = useMemo(() => {
    const [items] = data || [];
    return (items || []) as StudentPerformance[];
  }, [data]);

  return {
    loading: isLoading || isRefetching,
    students,
    refresh,
  };
}
