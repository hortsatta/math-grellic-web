import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';

import { PAGINATION_TAKE } from '#/utils/api.util';
import { queryClient } from '#/config/react-query-client.config';
import { queryUserKey } from '#/config/react-query-keys.config';
import {
  superAdminBaseRoute,
  superAdminRoutes,
} from '#/app/routes/super-admin-routes';
import { transformToAdminUserAccount } from '../helpers/user-transform.helper';
import {
  getPaginatedAdminsByCurrentSuperAdminUser,
  setAdminApprovalStatus as setAdminApprovalStatusApi,
  deleteAdmin as deleteAdminApi,
} from '../api/super-admin-user.api';

import type {
  QueryFilterOption,
  QueryPagination,
  QuerySort,
} from '#/base/models/base.model';
import type {
  AdminUserAccount,
  UserApprovalStatus,
} from '../models/user.model';

type Result = {
  admins: AdminUserAccount[];
  loading: boolean;
  isMutateLoading: boolean;
  totalCount: number;
  pagination: QueryPagination;
  setKeyword: (keyword: string | null) => void;
  setFilters: (filter: QueryFilterOption[]) => void;
  setSort: (sort: QuerySort) => void;
  refresh: () => void;
  nextPage: () => void;
  prevPage: () => void;
  handleAdminEdit: (id: number) => void;
  handleAdminDetails: (id: number) => void;
  setAdminApprovalStatus: (
    id: number,
    approvalStatus: UserApprovalStatus,
  ) => Promise<any>;
  deleteAdmin: (id: number) => Promise<boolean | undefined>;
};

const ADMIN_LIST_PATH = `/${superAdminBaseRoute}/${superAdminRoutes.admin.to}`;

export const defaultSort = {
  field: 'name',
  order: 'asc' as QuerySort['order'],
};

export const defaultParamKeys = {
  q: undefined,
  status: undefined,
  sort: `${defaultSort.field},${defaultSort.order}`,
  pagination: { take: PAGINATION_TAKE, skip: 0 },
};

export function useAdminUserList(): Result {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState<string | null>(null);
  const [filters, setFilters] = useState<QueryFilterOption[]>([]);
  const [sort, setSort] = useState<QuerySort>(defaultSort);
  const [skip, setSkip] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    setSkip(0);
  }, [keyword, filters, sort]);

  const status = useMemo(() => {
    if (!filters.length) {
      return undefined;
    }

    return filters
      .filter((f) => f.name === 'status')
      .map((f) => f.value)
      .join(',');
  }, [filters]);

  const querySort = useMemo(() => `${sort.field},${sort.order}`, [sort]);

  const pagination = useMemo(() => ({ take: PAGINATION_TAKE, skip }), [skip]);

  const { data, isLoading, isRefetching, refetch } = useQuery(
    getPaginatedAdminsByCurrentSuperAdminUser(
      { q: keyword || undefined, status, sort: querySort, pagination },
      {
        refetchOnWindowFocus: false,
        select: (data: any[]) => {
          const [items, totalCount] = data;
          const transformedItems = items.map((item: unknown) =>
            transformToAdminUserAccount(item),
          );

          return [transformedItems, +totalCount];
        },
      },
    ),
  );

  const {
    mutateAsync: mutateSetAdminApprovalStatus,
    isLoading: isStatusLoading,
  } = useMutation(setAdminApprovalStatusApi());

  const { mutateAsync: mutateDeleteAdmin, isLoading: isDeleteLoading } =
    useMutation(deleteAdminApi());

  const admins = useMemo(() => {
    const [items] = data || [];
    return (items || []) as AdminUserAccount[];
  }, [data]);

  const dataCount = useMemo(
    () => (data ? data[1] : undefined) as number,
    [data],
  );

  useEffect(() => {
    if (!dataCount) {
      return;
    }
    setTotalCount(dataCount);
  }, [dataCount]);

  const refresh = useCallback(() => {
    setSkip(0);
    refetch();
  }, [refetch]);

  const nextPage = useCallback(() => {
    const count = skip + pagination.take;

    if (totalCount <= count) {
      return;
    }

    setSkip(count);
  }, [skip, totalCount, pagination]);

  const prevPage = useCallback(() => {
    if (skip <= 0) {
      return;
    }
    setSkip(Math.max(0, skip - pagination.take));
  }, [skip, pagination]);

  const handleAdminDetails = useCallback(
    (id: number) => {
      navigate(`${ADMIN_LIST_PATH}/${id}`);
    },
    [navigate],
  );

  const handleAdminEdit = useCallback(
    (id: number) => {
      navigate(`${ADMIN_LIST_PATH}/${id}/${superAdminRoutes.admin.editTo}`);
    },
    [navigate],
  );

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
    admins,
    loading: isLoading || isRefetching,
    isMutateLoading: isStatusLoading || isDeleteLoading,
    totalCount,
    pagination,
    setKeyword,
    setFilters,
    setSort,
    refresh,
    nextPage,
    prevPage,
    handleAdminDetails,
    handleAdminEdit,
    setAdminApprovalStatus,
    deleteAdmin,
  };
}
