import { useState, useMemo, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryUserKey } from '#/config/react-query-keys.config';
import {
  transformToAdminUserAccount,
  transformToUserRegisterFormData,
} from '../helpers/user-transform.helper';
import {
  deleteAdmin as deleteAdminApi,
  editAdmin as editAdminApi,
  getAdminByIdAndCurrentSuperAdminUser as getAdminByIdAndCurrentSuperAdminUserApi,
} from '../api/super-admin-user.api';

import type { UserUpsertFormData } from '../models/user-form-data.model';
import type { User } from '../models/user.model';

type Result = {
  loading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  adminFormData: UserUpsertFormData | undefined;
  editAdmin: (data: UserUpsertFormData) => Promise<User>;
  deleteAdmin: () => Promise<boolean>;
};

export function useAdminUserEdit(id?: number): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: mutateEditAdmin, isLoading } = useMutation(
    editAdminApi({
      onSuccess: (data) =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryUserKey.adminList,
          }),
          queryClient.invalidateQueries({
            queryKey: [...queryUserKey.adminSingle, { id: data?.id }],
          }),
        ]),
    }),
  );

  const { mutateAsync: mutateDeleteAdmin, isLoading: isDeleteLoading } =
    useMutation(
      deleteAdminApi({
        onSuccess: () =>
          Promise.all([
            queryClient.invalidateQueries({
              queryKey: queryUserKey.adminList,
            }),
            queryClient.invalidateQueries({
              queryKey: [...queryUserKey.adminSingle, { id }],
            }),
          ]),
      }),
    );

  const {
    data: admin,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
  } = useQuery(
    getAdminByIdAndCurrentSuperAdminUserApi(
      { id: id || 0 },
      {
        enabled: !!id,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToAdminUserAccount(data);
        },
      },
    ),
  );

  const adminFormData = useMemo(
    () => (admin ? transformToUserRegisterFormData(admin) : undefined),
    [admin],
  );

  const editAdmin = useCallback(
    async (data: UserUpsertFormData) => {
      const updatedAdmin = await mutateEditAdmin({
        adminId: +(id || 0),
        data,
      });

      return updatedAdmin;
    },
    [id, mutateEditAdmin],
  );

  const deleteAdmin = useCallback(async () => {
    if (!id) {
      return false;
    }

    return mutateDeleteAdmin(id);
  }, [id, mutateDeleteAdmin]);

  return {
    loading: isLoading || isDeleteLoading || isQueryLoading || isQueryFetching,
    isDone,
    setIsDone,
    adminFormData,
    editAdmin,
    deleteAdmin,
  };
}
