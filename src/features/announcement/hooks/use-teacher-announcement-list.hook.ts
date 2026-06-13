import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { getAnnouncementsByCurrentTeacherUser } from '../api/teacher-announcement.api';
import { transformToTeacherAnnouncements } from '../helpers/announcement-transform.helper';

import type { TeacherAnnouncements } from '../models/announcement.model';

type Result = {
  teacherAnnouncements: TeacherAnnouncements;
  loading: boolean;
  refresh: () => void;
};

export function useTeacherAnnouncementList(): Result {
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);

  const queryConfig = useMemo(
    () =>
      getAnnouncementsByCurrentTeacherUser(schoolYearId, {
        refetchOnWindowFocus: false,
        select: (data: any) => transformToTeacherAnnouncements(data),
      }),
    [schoolYearId],
  );

  const {
    data,
    isLoading,
    isRefetching,
    refetch: refresh,
  } = useQuery(queryConfig);

  const teacherAnnouncements = useMemo(
    () =>
      data || {
        currentAnnouncements: [],
        upcomingAnnouncements: [],
      },
    [data],
  );

  return {
    loading: isLoading || isRefetching,
    teacherAnnouncements,
    refresh,
  };
}
