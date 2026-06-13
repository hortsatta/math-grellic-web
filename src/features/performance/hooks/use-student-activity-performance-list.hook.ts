import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToActivity } from '#/activity/helpers/activity-transform.helper';
import { getStudentActivitiesByCurrentStudentUser } from '../api/student-performance.api';

import type { Activity } from '#/activity/models/activity.model';

type Result = {
  activities?: Activity[];
  loading?: boolean;
};

export function useStudentActivityPerformanceList(): Result {
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);

  const queryConfig = useMemo(
    () =>
      getStudentActivitiesByCurrentStudentUser(
        { schoolYearId },
        {
          refetchOnWindowFocus: false,
          initialData: [],
          select: (data: unknown) =>
            Array.isArray(data)
              ? data.map((item: any) => transformToActivity(item))
              : [],
        },
      ),
    [schoolYearId],
  );

  const { data: activities, isRefetching, isLoading } = useQuery(queryConfig);

  return { loading: isLoading || isRefetching, activities };
}
