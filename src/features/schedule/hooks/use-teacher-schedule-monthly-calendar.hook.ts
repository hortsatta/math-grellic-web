import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import dayjs from '#/config/dayjs.config';
import { DAYS_PER_WEEK } from '#/utils/time.util';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToTimelineSchedules } from '../helpers/schedule-transform.helper';
import { getSchedulesByDateRangeAndCurrentTeacherUser } from '../api/teacher-schedule.api';

import type { TimelineSchedules } from '../models/schedule.model';

type Result = {
  loading: boolean;
  currentDate: Date | null;
  setCurrentDate: (date: Date) => void;
  timelineSchedules?: TimelineSchedules;
};

export function useTeacherScheduleMonthlyCalendar(today: Date | null): Result {
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);
  const [currentDate, setCurrentDate] = useState<Date | null>(today);

  const [from, to] = useMemo(() => {
    const target = dayjs(currentDate);

    return [
      target.set('date', 1).weekday(0).toDate(),
      target
        .set('date', target.daysInMonth())
        .weekday(DAYS_PER_WEEK - 1)
        .toDate(),
    ];
  }, [currentDate]);

  const queryConfig = useMemo(
    () =>
      getSchedulesByDateRangeAndCurrentTeacherUser(
        { from, to, schoolYearId },
        {
          refetchOnWindowFocus: false,
          select: (data: any) => transformToTimelineSchedules(data),
        },
      ),
    [from, to, schoolYearId],
  );

  const {
    data: timelineSchedules,
    isLoading,
    isRefetching,
  } = useQuery(queryConfig);

  return {
    loading: isLoading || isRefetching,
    currentDate,
    setCurrentDate,
    timelineSchedules,
  };
}
