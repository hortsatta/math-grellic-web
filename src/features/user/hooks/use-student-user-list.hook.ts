import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryUserKey } from '#/config/react-query-keys.config';
import { PAGINATION_TAKE } from '#/utils/api.util';
import { teacherRoutes } from '#/app/routes/teacher-routes';
import { teacherPerformanceBaseRoute } from '#/performance/route/teacher-performance-handle.route';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { SchoolYearEnrollmentApprovalStatus } from '#/school-year/models/school-year-enrollment.model';
import { setStudentApprovalStatus as setStudentApprovalStatusApi } from '#/school-year/api/teacher-school-year-enrollment.api';
import { UserApprovalStatus } from '../models/user.model';
import { transformToStudentUserAccount } from '../helpers/user-transform.helper';
import { teacherStudentUserBaseRoute } from '../route/student-user-handle.route';
import {
  getPaginatedStudentsByCurrentTeacherUser,
  deleteStudent as deleteStudentApi,
} from '../api/teacher-user.api';

import type {
  QueryFilterOption,
  QueryPagination,
  QuerySort,
} from '#/base/models/base.model';
import type { StudentUserAccount } from '../models/user.model';

type Result = {
  students: StudentUserAccount[];
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
  handleStudentEdit: (id: number) => void;
  handleStudentDetails: (id: number) => void;
  handleStudentPerformanceDetails: (publicId: string) => void;
  setStudentApprovalStatus: (
    id: number,
    approvalStatus: SchoolYearEnrollmentApprovalStatus,
  ) => Promise<any>;
  deleteStudent: (id: number) => Promise<boolean | undefined>;
};

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

export function useStudentUserList(): Result {
  const navigate = useNavigate();
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);
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

  const queryConfig = useMemo(
    () =>
      getPaginatedStudentsByCurrentTeacherUser(
        {
          q: keyword || undefined,
          status: UserApprovalStatus.Approved,
          sort: querySort,
          pagination,
          schoolYearId,
          enrollmentStatus,
        },
        {
          refetchOnWindowFocus: false,
          select: (data: any[]) => {
            const [items, totalCount] = data;
            const transformedItems = items.map((item: unknown) =>
              transformToStudentUserAccount(item),
            );

            return [transformedItems, +totalCount];
          },
        },
      ),
    [keyword, querySort, pagination, schoolYearId, enrollmentStatus],
  );

  const { data, isLoading, isRefetching, refetch } = useQuery(queryConfig);

  const {
    mutateAsync: mutateSetStudentApprovalStatus,
    isLoading: isStatusLoading,
  } = useMutation(setStudentApprovalStatusApi());

  const { mutateAsync: mutateDeleteStudent, isLoading: isDeleteLoading } =
    useMutation(deleteStudentApi());

  const students = useMemo(() => {
    const [items] = data || [];
    return (items || []) as StudentUserAccount[];
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

  const handleStudentDetails = useCallback(
    (id: number) => {
      navigate(`${teacherStudentUserBaseRoute}/${id}`);
    },
    [navigate],
  );

  const handleStudentPerformanceDetails = useCallback(
    (publicId: string) => {
      navigate(
        `${teacherPerformanceBaseRoute}/${
          teacherRoutes.student.to
        }/${publicId.toLocaleLowerCase()}`,
      );
    },
    [navigate],
  );

  const handleStudentEdit = useCallback(
    (id: number) => {
      navigate(
        `${teacherStudentUserBaseRoute}/${id}/${teacherRoutes.student.editTo}`,
      );
    },
    [navigate],
  );

  const setStudentApprovalStatus = useCallback(
    async (id: number, approvalStatus: SchoolYearEnrollmentApprovalStatus) => {
      const result = await mutateSetStudentApprovalStatus({
        enrollmentId: id,
        approvalStatus,
      });

      queryClient.invalidateQueries({
        queryKey: queryUserKey.studentList,
      });

      queryClient.invalidateQueries({
        queryKey: [...queryUserKey.studentSingle, { id }],
      });

      return result;
    },
    [mutateSetStudentApprovalStatus],
  );

  const deleteStudent = useCallback(
    async (id: number) => {
      const result = await mutateDeleteStudent(id);

      queryClient.invalidateQueries({
        queryKey: queryUserKey.studentList,
      });

      queryClient.invalidateQueries({
        queryKey: [...queryUserKey.studentSingle, { id }],
      });

      return result;
    },
    [mutateDeleteStudent],
  );

  return {
    students,
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
    handleStudentDetails,
    handleStudentPerformanceDetails,
    handleStudentEdit,
    setStudentApprovalStatus,
    deleteStudent,
  };
}
