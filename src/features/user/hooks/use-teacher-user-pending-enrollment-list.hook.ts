import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryUserKey } from '#/config/react-query-keys.config';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { SchoolYearEnrollmentApprovalStatus } from '#/school-year/models/school-year-enrollment.model';
import { setTeacherApprovalStatus as setTeacherApprovalStatusApi } from '#/school-year/api/school-year-enrollment.api';
import { transformToTeacherUserAccount } from '../helpers/user-transform.helper';
import { UserApprovalStatus } from '../models/user.model';
import {
  getTeachersByCurrentAdminUser,
  deleteTeacher as deleteTeacherApi,
} from '../api/admin-user.api';

import type { TeacherUserAccount } from '../models/user.model';

type Result = {
  pendingTeachers: TeacherUserAccount[];
  loading: boolean;
  isMutateLoading: boolean;
  refresh: () => void;
  setTeacherApprovalStatus: (
    id: number,
    approvalStatus: SchoolYearEnrollmentApprovalStatus,
  ) => Promise<any>;
  deleteTeacher: (id: number) => Promise<boolean | undefined>;
};

export function useTeacherUserPendingEnrollmentList(): Result {
  const schoolYear = useBoundStore((state) => state.schoolYear);

  const {
    data: pendingTeachers,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    getTeachersByCurrentAdminUser(
      {
        schoolYearId: schoolYear?.id,
        status: UserApprovalStatus.Approved,
        enrollmentStatus: SchoolYearEnrollmentApprovalStatus.Pending,
      },
      {
        queryKey: queryUserKey.teacherList,
        refetchOnWindowFocus: false,
        initialData: [],
        select: (data: unknown) =>
          Array.isArray(data)
            ? data.map((item: any) => transformToTeacherUserAccount(item))
            : [],
      },
    ),
  );

  // TODO approval status of enrollment
  const {
    mutateAsync: mutateSetTeacherApprovalStatus,
    isLoading: isStatusLoading,
  } = useMutation(setTeacherApprovalStatusApi());

  const { mutateAsync: mutateDeleteTeacher, isLoading: isDeleteLoading } =
    useMutation(deleteTeacherApi());

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
    pendingTeachers: pendingTeachers as TeacherUserAccount[],
    loading: isLoading || isFetching,
    isMutateLoading: isStatusLoading || isDeleteLoading,
    refresh: refetch,
    setTeacherApprovalStatus,
    deleteTeacher,
  };
}
