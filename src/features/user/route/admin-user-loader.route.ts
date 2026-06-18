import { defer } from 'react-router-dom';

import {
  getAdminByIdAndCurrentSuperAdminUser,
  getPaginatedAdminsByCurrentSuperAdminUser,
} from '../api/super-admin-user.api';
import { defaultParamKeys } from '../hooks/use-admin-user-list.hook';

import type { LoaderFunctionArgs } from 'react-router-dom';
import type { QueryClient } from '@tanstack/react-query';

export function getAdminUserByIdLoader(
  queryClient: QueryClient,
  queryParams?: { exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.id) {
      return;
    }

    const keys = { ...queryParams, id: +params.id };
    const query = getAdminByIdAndCurrentSuperAdminUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getPaginatedAdminUserLoader(queryClient: QueryClient) {
  return async () => {
    const query = getPaginatedAdminsByCurrentSuperAdminUser(defaultParamKeys);
    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
