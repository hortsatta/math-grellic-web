import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToStudentAnnouncements } from '../helpers/announcement-transform.helper';
import { getAnnouncementsByCurrentStudentUser } from '../api/student-announcement.api';

import type { StudentAnnouncements } from '../models/announcement.model';

type Result = {
  studentAnnouncements: StudentAnnouncements;
  loading: boolean;
  refresh: () => void;
};

export function useStudentAnnouncementList(): Result {
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);

  const queryConfig = useMemo(
    () =>
      getAnnouncementsByCurrentStudentUser(schoolYearId, {
        refetchOnWindowFocus: false,
        select: (data: any) => transformToStudentAnnouncements(data),
      }),
    [schoolYearId],
  );

  const {
    data,
    isLoading,
    isRefetching,
    refetch: refresh,
  } = useQuery(queryConfig);

  const studentAnnouncements = useMemo(
    () =>
      data || {
        currentAnnouncements: [],
        upcomingAnnouncements: [],
      },
    [data],
  );

  return {
    loading: isLoading || isRefetching,
    studentAnnouncements,
    refresh,
  };
}
