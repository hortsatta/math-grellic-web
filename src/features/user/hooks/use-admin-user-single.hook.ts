import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { transformToAdminUserAccount } from '../helpers/user-transform.helper';
import { getAdminByIdAndCurrentSuperAdminUser } from '../api/super-admin-user.api';

import type { AdminUserAccount } from '../models/user.model';

type Result = {
  loading: boolean;
  admin?: AdminUserAccount;
};

export function useAdminUserSingle(): Result {
  const { id } = useParams();

  const {
    data: admin,
    isLoading,
    isFetching,
  } = useQuery(
    getAdminByIdAndCurrentSuperAdminUser(
      { id: +(id || 0) },
      {
        enabled: !!id,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToAdminUserAccount(data);
        },
      },
    ),
  );

  return {
    loading: isLoading || isFetching,
    admin,
  };
}
