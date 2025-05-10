import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToActivity } from '../helpers/activity-transform.helper';
import { getActivitiesByCurrentStudentUser } from '../api/student-activity.api';

import type { QueryObserverBaseResult } from '@tanstack/react-query';
import type { Activity } from '../models/activity.model';

type Result = {
  featuredActivities: Activity[];
  otherActivities: Activity[];
  loading: boolean;
  setKeyword: (keyword: string | null) => void;
  refetch: QueryObserverBaseResult['refetch'];
};

export function useStudentActivityList(): Result {
  const schoolYear = useBoundStore((state) => state.schoolYear);
  const [keyword, setKeyword] = useState<string | null>(null);

  const {
    data: list,
    isLoading,
    isRefetching,
    refetch,
  } = useQuery(
    getActivitiesByCurrentStudentUser(
      { q: keyword || undefined, schoolYearId: schoolYear?.id },
      {
        refetchOnWindowFocus: false,
        select: (data: any) => {
          const { featuredActivities, otherActivities } = data;

          const transformedFeaturedActivities = featuredActivities?.length
            ? featuredActivities.map((item: any) => transformToActivity(item))
            : [];

          const transformedOtherActivities = otherActivities?.length
            ? otherActivities.map((item: any) => transformToActivity(item))
            : [];

          return {
            featuredActivities: transformedFeaturedActivities,
            otherActivities: transformedOtherActivities,
          };
        },
      },
    ),
  );

  const { featuredActivities, otherActivities } = useMemo(
    () =>
      (list || {
        featuredActivities: [],
        otherActivities: [],
      }) as {
        featuredActivities: Activity[];
        otherActivities: Activity[];
      },
    [list],
  );

  return {
    featuredActivities,
    otherActivities,
    loading: isLoading || isRefetching,
    setKeyword,
    refetch,
  };
}
