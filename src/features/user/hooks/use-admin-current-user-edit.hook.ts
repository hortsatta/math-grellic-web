import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryUserKey } from '#/config/react-query-keys.config';
import { getCurrentUser } from '#/auth/api/auth.api';
import {
  transformToAdminUserAccountFormData,
  transformToUser,
} from '../helpers/user-transform.helper';
import { editCurrentAdminUser as editCurrentAdminUserApi } from '../api/admin-user.api';

import type { User } from '../models/user.model';
import type { AdminUserUpdateFormData } from '../models/user-form-data.model';

type Result = {
  loading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  adminUserFormData: AdminUserUpdateFormData | undefined;
  editCurrentAdminUser: (data: AdminUserUpdateFormData) => Promise<User>;
};

export function useAdminCurrenUserEdit(): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: mutateEditCurrentAdminUser, isLoading } = useMutation(
    editCurrentAdminUserApi({
      onSuccess: () =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryUserKey.currentUser,
          }),
        ]),
    }),
  );

  const {
    data: user,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
  } = useQuery(
    getCurrentUser({
      refetchOnWindowFocus: false,
      select: (data: any) => {
        return transformToUser(data);
      },
    }),
  );

  const adminUserFormData = useMemo(
    () => (user ? transformToAdminUserAccountFormData(user) : undefined),
    [user],
  );

  const editCurrentAdminUser = useCallback(
    async (data: AdminUserUpdateFormData) => {
      const updatedUser = await mutateEditCurrentAdminUser(data);
      return updatedUser;
    },
    [mutateEditCurrentAdminUser],
  );

  return {
    loading: isLoading || isQueryLoading || isQueryFetching,
    isDone,
    setIsDone,
    adminUserFormData,
    editCurrentAdminUser,
  };
}
