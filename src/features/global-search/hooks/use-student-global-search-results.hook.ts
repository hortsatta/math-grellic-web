import { useCallback, useEffect, useMemo, useState } from 'react';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToLesson } from '#/lesson/helpers/lesson-transform.helper';
import { searchByCurrentStudentUser } from '../api/global-search.api';

import type { QueryFilterOption } from '#/base/models/base.model';
import type { StudentSearchResults } from '../models/global-search.model';
import { transformToExam } from '#/exam/helpers/exam-transform.helper';
import { transformToActivity } from '#/activity/helpers/activity-transform.helper';
import { transformToMeetingSchedule } from '#/schedule/helpers/schedule-transform.helper';
import { useQuery } from '@tanstack/react-query';

type Result = {
  searchResults: StudentSearchResults;
  loading: boolean;
  totalCount: number;
  setKeyword: (value: string | null) => void;
  setFilters: (filter: QueryFilterOption[]) => void;
  refresh: () => void;
};

export const defaultParamKeys = {
  q: undefined,
};

export function useStudentGlobalSearchResults(): Result {
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);
  const searchKeyword = useBoundStore((state) => state.searchKeyword);
  const setSearchKeyword = useBoundStore((state) => state.setSearchKeyword);
  const [filters, setFilters] = useState<QueryFilterOption[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const currentFilters = useMemo(() => {
    if (!filters.length) {
      return undefined;
    }

    return filters.map((f) => f.value).join(',');
  }, [filters]);

  const queryConfig = useMemo(
    () =>
      searchByCurrentStudentUser(
        {
          q: searchKeyword,
          filters: currentFilters,
          schoolYearId,
        },
        {
          enabled: !!searchKeyword?.trim().length && currentFilters != null,
          refetchOnWindowFocus: false,
          keepPreviousData: true,
          select: (data: any) => {
            const [
              { lessons, exams, activities, meetingSchedules },
              totalCount,
            ] = data;

            const transformedLessons = lessons
              ? {
                  upcomingLesson: lessons.upcomingLesson
                    ? transformToLesson(lessons.upcomingLesson)
                    : null,
                  moreLessons: lessons.moreLessons.map((lesson: unknown) =>
                    transformToLesson(lesson),
                  ),
                }
              : null;

            const transformedExams = exams
              ? {
                  upcomingExam: exams.upcomingExam
                    ? transformToExam(exams.upcomingExam)
                    : null,
                  ongoingExams: exams.ongoingExams.map((exam: unknown) =>
                    transformToExam(exam),
                  ),
                  moreExams: exams.moreExams.map((exam: unknown) =>
                    transformToExam(exam),
                  ),
                }
              : null;

            const transformedActivities = activities.map((activity: unknown) =>
              transformToActivity(activity),
            );

            const transformedMeetingSchedules = meetingSchedules
              ? {
                  upcomingMeetingSchedules:
                    meetingSchedules.upcomingMeetingSchedules.map(
                      (meeting: unknown) => transformToMeetingSchedule(meeting),
                    ),
                  moreMeetingSchedules:
                    meetingSchedules.moreMeetingSchedules.map(
                      (meeting: unknown) => transformToMeetingSchedule(meeting),
                    ),
                }
              : null;

            return [
              {
                lessons: transformedLessons,
                exams: transformedExams,
                activities: transformedActivities,
                meetingSchedules: transformedMeetingSchedules,
                others: [],
              },
              +totalCount,
            ];
          },
        },
      ),
    [searchKeyword, currentFilters, schoolYearId],
  );

  const { data, isLoading, isRefetching, refetch } = useQuery(queryConfig);

  const [searchResults, dataCount] = useMemo(
    () =>
      data || [
        {
          lessons: null,
          exams: null,
          activities: [],
          meetingSchedules: null,
        },
        0,
      ],
    [data],
  );

  useEffect(() => {
    setTotalCount(dataCount);
  }, [dataCount]);

  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const setKeyword = useCallback(
    (keyword: string | null) => {
      if (!keyword?.trim().length) return;
      setSearchKeyword(keyword);
    },
    [setSearchKeyword],
  );

  return {
    searchResults,
    loading: isLoading || isRefetching,
    totalCount,
    setKeyword,
    setFilters,
    refresh,
  };
}
