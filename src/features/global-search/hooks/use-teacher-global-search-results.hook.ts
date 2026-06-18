import { useState, useMemo, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToLesson } from '#/lesson/helpers/lesson-transform.helper';
import { transformToActivity } from '#/activity/helpers/activity-transform.helper';
import { transformToExam } from '#/exam/helpers/exam-transform.helper';
import { transformToStudentPerformance } from '#/performance/helpers/performance-transform.helper';
import { searchByCurrentTeacherUser } from '../api/global-search.api';

import type { QueryFilterOption, QuerySort } from '#/base/models/base.model';
import type { SearchResults } from '../models/global-search.model';

type Result = {
  searchResults: SearchResults;
  loading: boolean;
  totalCount: number;
  setKeyword: (value: string | null) => void;
  setFilters: (filter: QueryFilterOption[]) => void;
  setSort: (sort: QuerySort) => void;
  refresh: () => void;
};

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
              { lessons, exams, activities, studentPerformances },
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

            return [
              {
                lessons: transformedLessons,
                exams: transformedExams,
                activities: transformedActivities,
                studentPerformances: transformedStudentPerformances,
              },
              +totalCount,
            ];
          },
        },
      ),
    [searchKeyword, currentFilters, querySort, schoolYearId],
  );

  const { data, isLoading, isRefetching, refetch } = useQuery(queryConfig);

  const searchResults = useMemo(() => {
    const [searchResults] = data || [];

    return (searchResults || {
      lessons: [],
      exams: [],
      activities: [],
      studentPerformances: [],
    }) as SearchResults;
  }, [data]);

  const dataCount = useMemo(() => (data ? data[1] : 0), [data]);

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
    setSort,
    refresh,
  };
}
