import { defer } from 'react-router-dom';
import { useBoundStore } from '#/core/hooks/use-store.hook';

import {
  getExamBySlugAndCurrentStudentUser,
  getExamsByCurrentStudentUser,
} from '../api/student-exam.api';

import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';

export function getStudentExamBySlugLoader(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.slug) {
      return;
    }

    const schoolYearId = useBoundStore.getState().schoolYear?.id;
    const keys = {
      ...queryParams,
      slug: params.slug,
      schoolYearId: schoolYearId,
    };
    const query = getExamBySlugAndCurrentStudentUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getStudentExamsLoader(queryClient: QueryClient) {
  return async () => {
    const query = getExamsByCurrentStudentUser();

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
