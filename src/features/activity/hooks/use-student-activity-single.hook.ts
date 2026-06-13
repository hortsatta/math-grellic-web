import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToActivity } from '../helpers/activity-transform.helper';
import { getActivityBySlugAndCurrentStudentUser } from '../api/student-activity.api';

import type { Activity } from '../models/activity.model';

type Result = {
  // isDone: boolean;
  // setIsDone: (isDone: boolean) => void;
  loading: boolean;
  title: string;
  activity: Activity | null;
  // setActivityCompletion: (
  //   data: StudentActivityFormData,
  // ) => Promise<ActivityCategoryCompletion | null>;
};

export function useStudentActivitySingle(): Result {
  const { slug } = useParams();
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);

  const queryConfig = useMemo(
    () =>
      getActivityBySlugAndCurrentStudentUser(
        { slug: slug || '', schoolYearId },
        {
          enabled: !!slug,
          refetchOnWindowFocus: false,
          select: (data: any) => {
            return transformToActivity(data);
          },
        },
      ),
    [slug, schoolYearId],
  );

  const { data: activity, isLoading, isFetching } = useQuery(queryConfig);

  return {
    loading: isLoading || isFetching,
    title: activity?.title || '',
    activity: activity || null,
  };
}
