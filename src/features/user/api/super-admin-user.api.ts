import { generateApiError } from '#/utils/api.util';

import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryUserKey } from '#/config/react-query-keys.config';
import {
  transformToAdminUserUpsertDtoBySuperAdmin,
  transformToUser,
} from '../helpers/user-transform.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { PaginatedQueryData } from '#/core/models/core.model';
import type { QueryPagination } from '#/base/models/base.model';
import type {
  AdminUserAccount,
  User,
  UserApprovalStatus,
} from '../models/user.model';
import type { UserUpsertFormData } from '../models/user-form-data.model';

const BASE_URL = 'users';
const ADMIN_URL = 'admins';
const SUPER_ADMIN_BASE_URL = `${BASE_URL}/sad`;

export function getPaginatedAdminsByCurrentSuperAdminUser(
  keys?: {
    q?: string;
    status?: string;
    sort?: string;
    pagination?: Omit<QueryPagination, 'totalCount'>;
  },
  options?: Omit<
    UseQueryOptions<
      PaginatedQueryData<AdminUserAccount>,
      Error,
      PaginatedQueryData<AdminUserAccount>,
      any
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const { q, status, sort, pagination } = keys || {};
  const { take, skip } = pagination || {};

  const queryFn = async (): Promise<any> => {
    const url = `${SUPER_ADMIN_BASE_URL}/${ADMIN_URL}/list`;
    const searchParams = generateSearchParams({
      q,
      status,
      sort,
      skip: skip?.toString() || '0',
      take: take?.toString() || '0',
    });

    try {
      const admins = await kyInstance.get(url, { searchParams }).json();
      return admins;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryUserKey.adminList, { q, status, sort, skip, take }],
    queryFn,
    ...options,
  };
}

export function getAdminsByCurrentSuperAdminUser(
  keys?: { q?: string; ids?: number[]; status?: string },
  options?: Omit<
    UseQueryOptions<AdminUserAccount[], Error, AdminUserAccount[], any>,
    'queryFn'
  >,
) {
  const { q, ids, status } = keys || {};
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${SUPER_ADMIN_BASE_URL}/${ADMIN_URL}/list/all`;
    const searchParams = generateSearchParams({
      q,
      ids: ids?.join(','),
      status,
    });

    try {
      const admins = await kyInstance.get(url, { searchParams }).json();
      return admins;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...(queryKey?.length ? queryKey : queryUserKey.allAdminList),
      { q, ids, status },
    ],
    queryFn,
    ...moreOptions,
  };
}

export function getAdminCountByCurrentSuperAdminUser(
  status?: string,
  options?: Omit<UseQueryOptions<number, Error, number, any>, 'queryFn'>,
) {
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${SUPER_ADMIN_BASE_URL}/${ADMIN_URL}/count`;
    const searchParams = generateSearchParams({ status });

    try {
      const count = await kyInstance.get(url, { searchParams }).json();
      return count;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...(queryKey?.length ? queryKey : queryUserKey.allAdminList),
      { status },
    ],
    queryFn,
    ...moreOptions,
  };
}

export function getAdminByIdAndCurrentSuperAdminUser(
  keys: { id: number; exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<AdminUserAccount, Error, AdminUserAccount, any>,
    'queryFn'
  >,
) {
  const { id, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${SUPER_ADMIN_BASE_URL}/${ADMIN_URL}/${id}`;
    const searchParams = generateSearchParams({ exclude, include });

    try {
      const admin = await kyInstance.get(url, { searchParams }).json();
      return admin;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryUserKey.adminSingle, { id, exclude, include }],
    queryFn,
    ...options,
  };
}

export function registerAdminByCurrentSuperAdminUser(
  options?: Omit<
    UseMutationOptions<User | null, Error, UserUpsertFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: UserUpsertFormData): Promise<any> => {
    const url = `${SUPER_ADMIN_BASE_URL}/${ADMIN_URL}/register`;
    const json = transformToAdminUserUpsertDtoBySuperAdmin(data);

    try {
      const user = await kyInstance.post(url, { json }).json();
      return transformToUser(user);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function editAdmin(
  options?: Omit<
    UseMutationOptions<
      User,
      Error,
      { adminId: number; data: UserUpsertFormData },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    adminId,
    data,
  }: {
    adminId: number;
    data: UserUpsertFormData;
  }): Promise<any> => {
    const url = `${SUPER_ADMIN_BASE_URL}/${ADMIN_URL}/${adminId}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, password, confirmPassword, ...moreData } = data;
    const json = transformToAdminUserUpsertDtoBySuperAdmin(moreData, true);

    try {
      const user = await kyInstance.patch(url, { json }).json();
      return transformToUser(user);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function deleteAdmin(
  options?: Omit<UseMutationOptions<boolean, Error, number, any>, 'mutationFn'>,
) {
  const mutationFn = async (id: number): Promise<boolean> => {
    const url = `${SUPER_ADMIN_BASE_URL}/${ADMIN_URL}/${id}`;

    try {
      const success: boolean = await kyInstance.delete(url).json();
      return success;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function setAdminApprovalStatus(
  options?: Omit<
    UseMutationOptions<
      {
        approvalStatus: string;
        approvalDate: string;
        approvalRejectedReason: string;
      },
      Error,
      { adminId: number; approvalStatus: UserApprovalStatus },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    adminId,
    approvalStatus,
  }: {
    adminId: number;
    approvalStatus: UserApprovalStatus;
  }): Promise<any> => {
    const url = `${SUPER_ADMIN_BASE_URL}/${ADMIN_URL}/approve/${adminId}`;
    const json = { approvalStatus };

    try {
      const userApproval = await kyInstance.patch(url, { json }).json();
      return userApproval;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
