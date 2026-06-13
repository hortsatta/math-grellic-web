import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToActivity } from '#/activity/helpers/activity-transform.helper';
import { getStudentActivitiesByPublicIdAndCurrentTeacherUser } from '../api/teacher-performance.api';

import type { Activity } from '#/activity/models/activity.model';

type Result = {
  activities?: Activity[];
  loading?: boolean;
};

export function useTeacherStudentActivityPerformanceList(): Result {
  const { publicId } = useParams();
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);

  const queryConfig = useMemo(
    () =>
      getStudentActivitiesByPublicIdAndCurrentTeacherUser(
        { publicId: publicId || '', schoolYearId },
        {
          refetchOnWindowFocus: false,
          enabled: !!publicId,
          initialData: [],
          select: (data: unknown) =>
            Array.isArray(data)
              ? data.map((item: any) => transformToActivity(item))
              : [],
        },
      ),
    [publicId, schoolYearId],
  );

  const { data: activities, isRefetching, isLoading } = useQuery(queryConfig);

  return { loading: isLoading || isRefetching, activities };
}
