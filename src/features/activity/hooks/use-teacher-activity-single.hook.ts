import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToActivity } from '../helpers/activity-transform.helper';
import { getActivityBySlugAndCurrentTeacherUser } from '../api/teacher-activity.api';

import type { Activity } from '../models/activity.model';

type Result = {
  loading: boolean;
  activity?: Activity | null;
};

export function useTeacherActivitySingle(): Result {
  const { slug } = useParams();
  const schoolYear = useBoundStore((state) => state.schoolYear);

  const {
    data: activity,
    isLoading,
    isFetching,
  } = useQuery(
    getActivityBySlugAndCurrentTeacherUser(
      { slug: slug || '', schoolYearId: schoolYear?.id },
      {
        enabled: !!slug,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToActivity(data);
        },
      },
    ),
  );

  return { loading: isLoading || isFetching, activity };
}
