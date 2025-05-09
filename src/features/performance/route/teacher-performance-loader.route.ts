import { defer } from 'react-router-dom';

import {
  getPaginatedStudentPerformancesByCurrentTeacherUser,
  getStudentActivitiesByPublicIdAndCurrentTeacherUser,
  getStudentExamsByPublicIdAndCurrentTeacherUser,
  getStudentLessonsByPublicIdAndCurrentTeacherUser,
  getStudentPerformanceByPublicIdAndCurrentTeacherUser,
} from '../api/teacher-performance.api';
import { defaultParamKeys } from '../hooks/use-student-performance-list.hook';

import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';

export function getTeacherStudentPerformanceByPublicIdLoader(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.publicId) {
      return;
    }

    const keys = { ...queryParams, publicId: params.publicId };
    const query = getStudentPerformanceByPublicIdAndCurrentTeacherUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getTeacherPaginatedStudentPerformancesLoader(
  queryClient: QueryClient,
) {
  return async () => {
    const query =
      getPaginatedStudentPerformancesByCurrentTeacherUser(defaultParamKeys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getTeacherStudentExamsByPublicIdAndCurrentTeacherUserLoader(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.publicId) {
      return;
    }

    const keys = { ...queryParams, publicId: params.publicId };
    const query = getStudentExamsByPublicIdAndCurrentTeacherUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getTeacherStudentActivitiesByPublicIdAndCurrentTeacherUserLoader(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.publicId) {
      return;
    }

    const keys = { ...queryParams, publicId: params.publicId };
    const query = getStudentActivitiesByPublicIdAndCurrentTeacherUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getTeacherStudentLessonsByPublicIdAndCurrentTeacherUserLoader(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.publicId) {
      return;
    }

    const keys = { ...queryParams, publicId: params.publicId };
    const query = getStudentLessonsByPublicIdAndCurrentTeacherUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
