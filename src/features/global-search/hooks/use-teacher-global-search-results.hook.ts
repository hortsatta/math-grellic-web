import { useState, useMemo, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import fuzzysort from 'fuzzysort';

import { teacherRoutes } from '#/app/routes/teacher-routes';
import { lessonBaseRoute } from '#/lesson/route/teacher-lesson-handle.route';
import { examBaseRoute } from '#/exam/route/teacher-exam-handle.route';
import { activityBaseRoute } from '#/activity/route/teacher-activity-handle.route';
import { scheduleBaseRoute } from '#/schedule/route/teacher-schedule-handle.route';
import { performanceBaseRoute } from '#/performance/route/teacher-performance-handle.route';
import { studentUserBaseRoute } from '#/user/route/student-user-handle.route';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToLesson } from '#/lesson/helpers/lesson-transform.helper';
import { transformToActivity } from '#/activity/helpers/activity-transform.helper';
import { transformToExam } from '#/exam/helpers/exam-transform.helper';
import { transformToStudentPerformance } from '#/performance/helpers/performance-transform.helper';
import { transformToMeetingSchedule } from '#/schedule/helpers/schedule-transform.helper';
import { SearchFilter } from '../models/global-search.model';
import { searchByCurrentTeacherUser } from '../api/global-search.api';

import type {
  IconName,
  QueryFilterOption,
  QuerySort,
} from '#/base/models/base.model';
import type { OtherLink, SearchResults } from '../models/global-search.model';

type Result = {
  searchResults: SearchResults;
  loading: boolean;
  totalCount: number;
  isSingleGroupResult: boolean;
  setKeyword: (value: string | null) => void;
  setFilters: (filter: QueryFilterOption[]) => void;
  setSort: (sort: QuerySort) => void;
  refresh: () => void;
};

const fuzzySortOptions: Fuzzysort.KeysOptions<OtherLink> = {
  limit: 50, // don't return more results than you need!
  threshold: 0.5, // don't return bad results
  all: false, // don't return all data if keyword is empty
  keys: ['label', 'name'],
};

const otherLinks = [
  {
    name: 'lesson-new',
    label: 'Create new lesson',
    to: `${lessonBaseRoute}/${teacherRoutes.lesson.createTo}`,
    icon: 'plus' as IconName,
  },
  {
    name: 'lesson-list',
    label: 'View all lessons',
    to: lessonBaseRoute,
    icon: 'chalkboard' as IconName,
  },
  {
    name: 'exam-new',
    label: 'Create new exam',
    to: `${examBaseRoute}/${teacherRoutes.exam.createTo}`,
    icon: 'plus' as IconName,
  },
  {
    name: 'exam-list',
    label: 'View all exams',
    to: examBaseRoute,
    icon: 'exam' as IconName,
  },
  {
    name: 'activity-new',
    label: 'Create new activity',
    to: `${activityBaseRoute}/${teacherRoutes.activity.createTo}`,
    icon: 'plus' as IconName,
  },
  {
    name: 'activity-list',
    label: 'View all activities',
    to: activityBaseRoute,
    icon: 'game-controller' as IconName,
  },
  {
    name: 'schedule-calendar',
    label: 'View calendar',
    to: scheduleBaseRoute,
    icon: 'calendar' as IconName,
  },
  {
    name: 'schedule-meeting-list',
    label: 'View all scheduled meetings',
    to: `${scheduleBaseRoute}/${teacherRoutes.schedule.meeting.to}`,
    icon: 'presentation' as IconName,
  },
  {
    name: 'schedule-meeting-new',
    label: 'Schedule a meeting',
    to: `${scheduleBaseRoute}/${teacherRoutes.schedule.meeting.to}/${teacherRoutes.schedule.meeting.createTo}`,
    icon: 'plus' as IconName,
  },
  {
    name: 'student-performance-list',
    label: "View learners' performance",
    to: performanceBaseRoute,
    icon: 'chart-donut' as IconName,
  },
  {
    name: 'student-list',
    label: 'View all learners',
    to: studentUserBaseRoute,
    icon: 'student' as IconName,
  },
  {
    name: 'student-new',
    label: 'Enroll a new learner',
    to: `${studentUserBaseRoute}/${teacherRoutes.student.createTo}`,
    icon: 'plus' as IconName,
  },
];

export const defaultSort = {
  field: 'title',
  order: 'asc' as QuerySort['order'],
};

export const defaultParamKeys = {
  q: undefined,
  sort: `${defaultSort.field},${defaultSort.order}`,
};

export function useTeacherGlobalSearchResults(): Result {
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);
  const searchKeyword = useBoundStore((state) => state.searchKeyword);
  const setSearchKeyword = useBoundStore((state) => state.setSearchKeyword);
  const [filters, setFilters] = useState<QueryFilterOption[]>([]);
  const [sort, setSort] = useState<QuerySort>(defaultSort);
  const [totalCount, setTotalCount] = useState<number>(0);

  const currentFilters = useMemo(() => {
    if (!filters.length) {
      return undefined;
    }

    return filters.map((f) => f.value).join(',');
  }, [filters]);

  const querySort = useMemo(() => `${sort.field},${sort.order}`, [sort]);

  const queryConfig = useMemo(
    () =>
      searchByCurrentTeacherUser(
        {
          q: searchKeyword,
          filters: currentFilters,
          sort: querySort,
          schoolYearId,
        },
        {
          enabled: !!searchKeyword?.trim().length && currentFilters != null,
          refetchOnWindowFocus: false,
          keepPreviousData: true,
          select: (data: any) => {
            const [
              {
                lessons,
                exams,
                activities,
                studentPerformances,
                meetingSchedules,
              },
              totalCount,
            ] = data;

            const transformedLessons = lessons.map((lesson: unknown) =>
              transformToLesson(lesson),
            );

            const transformedExams = exams.map((exam: unknown) =>
              transformToExam(exam),
            );

            const transformedActivities = activities.map((activity: unknown) =>
              transformToActivity(activity),
            );

            const transformedStudentPerformances = studentPerformances.map(
              (student: unknown) => transformToStudentPerformance(student),
            );

            const transformedMeetingSchedules = meetingSchedules.map(
              (meeting: unknown) => transformToMeetingSchedule(meeting),
            );

            return [
              {
                lessons: transformedLessons,
                exams: transformedExams,
                activities: transformedActivities,
                studentPerformances: transformedStudentPerformances,
                meetingSchedules: transformedMeetingSchedules,
                others: [],
              },
              +totalCount,
            ];
          },
        },
      ),
    [searchKeyword, currentFilters, querySort, schoolYearId],
  );

  const { data, isLoading, isRefetching, refetch } = useQuery(queryConfig);

  const [searchResults, dataCount] = useMemo(() => {
    const [searchResults] = data || [
      [
        {
          lessons: [],
          exams: [],
          activities: [],
          studentPerformances: [],
          meetingSchedules: [],
        },
      ],
    ];

    const others = currentFilters?.includes(SearchFilter.Others)
      ? fuzzysort
          .go(searchKeyword || '', otherLinks, fuzzySortOptions)
          .map((result) => result.obj)
      : [];

    const dataCount = (data ? data[1] : 0) + others.length;

    return [{ ...searchResults, others } as SearchResults, dataCount];
  }, [data, searchKeyword, currentFilters]);

  const isSingleGroupResult = useMemo(
    () =>
      Object.values(searchResults).filter((value) => !!value.length).length ===
      1,
    [searchResults],
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
    isSingleGroupResult,
    setKeyword,
    setFilters,
    setSort,
    refresh,
  };
}
