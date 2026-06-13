import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToActivity } from '../helpers/activity-transform.helper';
import { getActivityBySlugAndCurrentTeacherUser } from '../api/teacher-activity.api';

import type { Activity } from '../models/activity.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  titlePreview: string;
  activity: Activity | null;
};

export function useActivityPreviewSlug(): Result {
  const { slug } = useParams();
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);
  const [isDone, setIsDone] = useState(false);

  const queryConfig = useMemo(
    () =>
      getActivityBySlugAndCurrentTeacherUser(
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

  const { data: activity } = useQuery(queryConfig);

  const titlePreview = useMemo(
    () => (activity?.title ? `${activity?.title} (Preview)` : 'Preview'),
    [activity],
  );

  return {
    isDone,
    setIsDone,
    titlePreview,
    activity: activity || null,
  };
}
