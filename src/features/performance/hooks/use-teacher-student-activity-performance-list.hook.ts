import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import { transformToActivity } from '#/activity/helpers/activity-transform.helper';
import { getStudentActivitiesByPublicIdAndCurrentTeacherUser } from '../api/teacher-performance.api';

import type { Activity } from '#/activity/models/activity.model';

type Result = {
  activities?: Activity[];
  loading?: boolean;
};

export function useTeacherStudentActivityPerformanceList(): Result {
  const { publicId } = useParams();

  const {
    data: activities,
    isRefetching,
    isLoading,
  } = useQuery(
    getStudentActivitiesByPublicIdAndCurrentTeacherUser(
      { publicId: publicId || '' },
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
  );

  return { loading: isLoading || isRefetching, activities };
}
