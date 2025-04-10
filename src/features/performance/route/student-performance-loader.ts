import { defer } from 'react-router-dom';

import {
  getStudentActivitiesByCurrentStudentUser,
  getStudentExamsByCurrentStudentUser,
  getStudentLessonsByCurrentStudentUser,
  getStudentPerformanceByCurrentStudentUser as getPerformanceByCurrentStudentUser,
} from '../api/student-performance.api';

import type { QueryClient } from '@tanstack/react-query';

export function getStudentPerformanceByCurrentStudentUser(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async () => {
    const keys = { ...queryParams };
    const query = getPerformanceByCurrentStudentUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getStudentExamsByCurrentStudentUserLoader(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async () => {
    const keys = { ...queryParams };
    const query = getStudentExamsByCurrentStudentUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getStudentActivitiesByCurrentStudentUserLoader(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async () => {
    const keys = { ...queryParams };
    const query = getStudentActivitiesByCurrentStudentUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getStudentLessonsByCurrentStudentUserLoader(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async () => {
    const keys = { ...queryParams };
    const query = getStudentLessonsByCurrentStudentUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
