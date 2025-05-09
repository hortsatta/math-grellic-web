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
  const schoolYear = useBoundStore((state) => state.schoolYear);

  const {
    data: activities,
    isRefetching,
    isLoading,
  } = useQuery(
    getStudentActivitiesByCurrentStudentUser(
      { schoolYearId: schoolYear?.id },
      {
        refetchOnWindowFocus: false,
        initialData: [],
        select: (data: unknown) =>
          Array.isArray(data)
            ? data.map((item: any) => transformToActivity(item))
            : [],
      },
    ),
  );

  return { loading: isLoading || isRefetching, activities };
}
