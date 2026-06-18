import { defer } from 'react-router-dom';

import {
  getPaginatedTeachersByCurrentAdminUser,
  getTeacherById,
} from '../api/admin-user.api';
import { defaultParamKeys } from '../hooks/use-student-user-list.hook';

import type { LoaderFunctionArgs } from 'react-router-dom';
import type { QueryClient } from '@tanstack/react-query';

export function getTeacherUserByIdLoader(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.id) {
      return;
    }

    const keys = { ...queryParams, id: +params.id };
    const query = getTeacherById(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getPaginatedTeacherUserLoader(queryClient: QueryClient) {
  return async () => {
    const query = getPaginatedTeachersByCurrentAdminUser(defaultParamKeys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
