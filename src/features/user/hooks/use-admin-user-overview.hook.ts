import { useQuery } from '@tanstack/react-query';

import { queryUserKey } from '#/config/react-query-keys.config';
import { getAdminCountByCurrentSuperAdminUser } from '../api/super-admin-user.api';

type Result = {
  registeredAdminCount: number;
  loading: boolean;
  refresh: () => void;
};

export function useAdminUserOverview(): Result {
  const { data, isLoading, isFetching, refetch } = useQuery(
    getAdminCountByCurrentSuperAdminUser(undefined, {
      queryKey: queryUserKey.studentList,
      refetchOnWindowFocus: false,
      initialData: 0,
    }),
  );

  return {
    registeredAdminCount: data || 0,
    loading: isLoading || isFetching,
    refresh: refetch,
  };
}
