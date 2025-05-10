import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryUserKey } from '#/config/react-query-keys.config';
import { PAGINATION_TAKE } from '#/utils/api.util';
import { adminBaseRoute, adminRoutes } from '#/app/routes/admin-routes';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { SchoolYearEnrollmentApprovalStatus } from '#/school-year/models/school-year-enrollment.model';
import { setTeacherApprovalStatus as setTeacherApprovalStatusApi } from '#/school-year/api/school-year-enrollment.api';
import { UserApprovalStatus } from '../models/user.model';
import { transformToTeacherUserAccount } from '../helpers/user-transform.helper';
import {
  getPaginatedTeachersByCurrentAdminUser,
  deleteTeacher as deleteTeacherApi,
} from '../api/admin-user.api';

import type {
  QueryFilterOption,
  QueryPagination,
  QuerySort,
} from '#/base/models/base.model';
import type { TeacherUserAccount } from '../models/user.model';

type Result = {
  teachers: TeacherUserAccount[];
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
  handleTeacherEdit: (id: number) => void;
  handleTeacherDetails: (id: number) => void;
  setTeacherApprovalStatus: (
    id: number,
    approvalStatus: SchoolYearEnrollmentApprovalStatus,
  ) => Promise<any>;
  deleteTeacher: (id: number) => Promise<boolean | undefined>;
};

const TEACHER_LIST_PATH = `/${adminBaseRoute}/${adminRoutes.teacher.to}`;

export const defaultSort = {
  field: 'name',
  order: 'asc' as QuerySort['order'],
};

export const defaultParamKeys = {
  q: undefined,
  status: UserApprovalStatus.Approved,
  sort: `${defaultSort.field},${defaultSort.order}`,
  pagination: { take: PAGINATION_TAKE, skip: 0 },
  enrollmentStatus: undefined,
};

export function useTeacherUserList(): Result {
  const navigate = useNavigate();
  const schoolYear = useBoundStore((state) => state.schoolYear);
  const [keyword, setKeyword] = useState<string | null>(null);
  const [filters, setFilters] = useState<QueryFilterOption[]>([]);
  const [sort, setSort] = useState<QuerySort>(defaultSort);
  const [skip, setSkip] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    setSkip(0);
  }, [keyword, filters, sort]);

  const enrollmentStatus = useMemo(() => {
    if (!filters.length) {
      return undefined;
    }

    return filters
      .filter((f) => f.name === 'estatus')
      .map((f) => f.value)
      .join(',');
  }, [filters]);

  const querySort = useMemo(() => `${sort.field},${sort.order}`, [sort]);

  const pagination = useMemo(() => ({ take: PAGINATION_TAKE, skip }), [skip]);

  const { data, isLoading, isRefetching, refetch } = useQuery(
    getPaginatedTeachersByCurrentAdminUser(
      {
        q: keyword || undefined,
        status: UserApprovalStatus.Approved,
        sort: querySort,
        pagination,
        schoolYearId: schoolYear?.id,
        enrollmentStatus,
      },
      {
        refetchOnWindowFocus: false,
        select: (data: any[]) => {
          const [items, totalCount] = data;
          const transformedItems = items.map((item: unknown) =>
            transformToTeacherUserAccount(item),
          );

          return [transformedItems, +totalCount];
        },
      },
    ),
  );

  const {
    mutateAsync: mutateSetTeacherApprovalStatus,
    isLoading: isStatusLoading,
  } = useMutation(setTeacherApprovalStatusApi());

  const { mutateAsync: mutateDeleteTeacher, isLoading: isDeleteLoading } =
    useMutation(deleteTeacherApi());

  const teachers = useMemo(() => {
    const [items] = data || [];
    return (items || []) as TeacherUserAccount[];
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

  const handleTeacherDetails = useCallback(
    (id: number) => {
      navigate(`${TEACHER_LIST_PATH}/${id}`);
    },
    [navigate],
  );

  const handleTeacherEdit = useCallback(
    (id: number) => {
      navigate(`${TEACHER_LIST_PATH}/${id}/${adminRoutes.teacher.editTo}`);
    },
    [navigate],
  );

  const setTeacherApprovalStatus = useCallback(
    async (id: number, approvalStatus: SchoolYearEnrollmentApprovalStatus) => {
      const result = await mutateSetTeacherApprovalStatus({
        enrollmentId: id,
        approvalStatus,
      });

      queryClient.invalidateQueries({
        queryKey: queryUserKey.teacherList,
      });

      queryClient.invalidateQueries({
        queryKey: [...queryUserKey.teacherSingle, { id }],
      });

      return result;
    },
    [mutateSetTeacherApprovalStatus],
  );

  const deleteTeacher = useCallback(
    async (id: number) => {
      const result = await mutateDeleteTeacher(id);

      queryClient.invalidateQueries({
        queryKey: queryUserKey.teacherList,
      });

      queryClient.invalidateQueries({
        queryKey: [...queryUserKey.teacherSingle, { id }],
      });

      return result;
    },
    [mutateDeleteTeacher],
  );

  return {
    teachers,
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
    handleTeacherDetails,
    handleTeacherEdit,
    setTeacherApprovalStatus,
    deleteTeacher,
  };
}
