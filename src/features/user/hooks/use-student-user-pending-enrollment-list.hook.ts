import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryUserKey } from '#/config/react-query-keys.config';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { SchoolYearEnrollmentApprovalStatus } from '#/school-year/models/school-year-enrollment.model';
import { setStudentApprovalStatus as setStudentApprovalStatusApi } from '#/school-year/api/school-year-enrollment.api';
import { transformToStudentUserAccount } from '../helpers/user-transform.helper';
import { UserApprovalStatus } from '../models/user.model';
import {
  getStudentsByCurrentTeacherUser,
  deleteStudent as deleteStudentApi,
} from '../api/teacher-user.api';

import type { StudentUserAccount } from '../models/user.model';

type Result = {
  pendingStudents: StudentUserAccount[];
  loading: boolean;
  isMutateLoading: boolean;
  refresh: () => void;
  setStudentApprovalStatus: (
    id: number,
    approvalStatus: SchoolYearEnrollmentApprovalStatus,
  ) => Promise<any>;
  deleteStudent: (id: number) => Promise<boolean | undefined>;
};

export function useStudentUserPendingEnrollmentList(): Result {
  const schoolYear = useBoundStore((state) => state.schoolYear);

  const {
    data: pendingStudents,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(
    getStudentsByCurrentTeacherUser(
      {
        schoolYearId: schoolYear?.id,
        status: UserApprovalStatus.Approved,
        enrollmentStatus: SchoolYearEnrollmentApprovalStatus.Pending,
      },
      {
        queryKey: queryUserKey.studentList,
        refetchOnWindowFocus: false,
        initialData: [],
        select: (data: unknown) =>
          Array.isArray(data)
            ? data.map((item: any) => transformToStudentUserAccount(item))
            : [],
      },
    ),
  );

  // TODO approval status of enrollment
  const {
    mutateAsync: mutateSetStudentApprovalStatus,
    isLoading: isStatusLoading,
  } = useMutation(setStudentApprovalStatusApi());

  const { mutateAsync: mutateDeleteStudent, isLoading: isDeleteLoading } =
    useMutation(deleteStudentApi());

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
    pendingStudents: pendingStudents as StudentUserAccount[],
    loading: isLoading || isFetching,
    isMutateLoading: isStatusLoading || isDeleteLoading,
    refresh: refetch,
    setStudentApprovalStatus,
    deleteStudent,
  };
}
