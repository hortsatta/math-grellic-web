import { defer } from 'react-router-dom';

import { getSchoolYearBySlugAndCurrentAdminUser } from '../api/admin-school-year.api';
import { getPaginatedSchoolYearsByCurrentAdminUser } from '../api/admin-school-year.api';
import { defaultParamKeys } from '../hooks/use-admin-school-year-list.hook';

import type { QueryClient } from '@tanstack/react-query';
import type { LoaderFunctionArgs } from 'react-router-dom';

export function getAdminSchoolYearBySlugLoader(
  queryClient: QueryClient,
  queryParams?: { status?: string; exclude?: string; include?: string },
) {
  return async ({ params }: LoaderFunctionArgs) => {
    if (!params?.slug) {
      return;
    }

    const keys = { ...queryParams, slug: params.slug };
    const query = getSchoolYearBySlugAndCurrentAdminUser(keys);

    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}

export function getAdminPaginatedSchoolYearsLoader(queryClient: QueryClient) {
  return async () => {
    const query = getPaginatedSchoolYearsByCurrentAdminUser(defaultParamKeys);
    return defer({
      main:
        queryClient.getQueryData(query.queryKey as string[]) ??
        queryClient.fetchQuery(query),
    });
  };
}
