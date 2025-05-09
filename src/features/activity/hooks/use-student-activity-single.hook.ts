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
  const schoolYear = useBoundStore((state) => state.schoolYear);

  const {
    data: activity,
    isLoading,
    isFetching,
  } = useQuery(
    getActivityBySlugAndCurrentStudentUser(
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

  return {
    loading: isLoading || isFetching,
    title: activity?.title || '',
    activity: activity || null,
  };
}
