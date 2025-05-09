import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryUserKey } from '#/config/react-query-keys.config';
import { transformToAdminUserAccount } from '../helpers/user-transform.helper';
import { UserApprovalStatus } from '../models/user.model';
import {
  getAdminsByCurrentSuperAdminUser,
  setAdminApprovalStatus as setAdminApprovalStatusApi,
  deleteAdmin as deleteAdminApi,
} from '../api/super-admin-user.api';

import type { AdminUserAccount } from '../models/user.model';

type Result = {
  pendingAdmins: AdminUserAccount[];
  loading: boolean;
  isMutateLoading: boolean;
  refresh: () => void;
  setAdminApprovalStatus: (
    id: number,
    approvalStatus: UserApprovalStatus,
  ) => Promise<any>;
  deleteAdmin: (id: number) => Promise<boolean | undefined>;
};

export function useAdminUserPendingRegistrationList(): Result {
  const {
    data: pendingAdmins,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    getAdminsByCurrentSuperAdminUser(
      {
        status: UserApprovalStatus.Pending,
      },
      {
        queryKey: queryUserKey.adminList,
        refetchOnWindowFocus: false,
        initialData: [],
        select: (data: unknown) =>
          Array.isArray(data)
            ? data.map((item: any) => transformToAdminUserAccount(item))
            : [],
      },
    ),
  );

  const {
    mutateAsync: mutateSetAdminApprovalStatus,
    isLoading: isStatusLoading,
  } = useMutation(setAdminApprovalStatusApi());

  const { mutateAsync: mutateDeleteAdmin, isLoading: isDeleteLoading } =
    useMutation(deleteAdminApi());

  const setAdminApprovalStatus = useCallback(
    async (id: number, approvalStatus: UserApprovalStatus) => {
      const result = await mutateSetAdminApprovalStatus({
        adminId: id,
        approvalStatus,
      });

      queryClient.invalidateQueries({
        queryKey: queryUserKey.adminList,
      });

      queryClient.invalidateQueries({
        queryKey: [...queryUserKey.adminSingle, { id }],
      });

      return result;
    },
    [mutateSetAdminApprovalStatus],
  );

  const deleteAdmin = useCallback(
    async (id: number) => {
      const result = await mutateDeleteAdmin(id);

      queryClient.invalidateQueries({
        queryKey: queryUserKey.adminList,
      });

      queryClient.invalidateQueries({
        queryKey: [...queryUserKey.adminSingle, { id }],
      });

      return result;
    },
    [mutateDeleteAdmin],
  );

  return {
    pendingAdmins: pendingAdmins as AdminUserAccount[],
    loading: isLoading || isFetching,
    isMutateLoading: isStatusLoading || isDeleteLoading,
    refresh: refetch,
    setAdminApprovalStatus,
    deleteAdmin,
  };
}
