import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryUserKey } from '#/config/react-query-keys.config';
import {
  transformToStudentUserAccount,
  transformToUserRegisterFormData,
} from '../helpers/user-transform.helper';
import {
  deleteStudent as deleteStudentApi,
  editStudent as editStudentApi,
  getStudentByIdAndCurrentTeacherUser as getStudentByIdAndCurrentTeacherUserApi,
} from '../api/teacher-user.api';

import type { User } from '../models/user.model';
import type { UserUpsertFormData } from '../models/user-form-data.model';

type Result = {
  loading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  studentFormData: UserUpsertFormData | undefined;
  editStudent: (data: UserUpsertFormData) => Promise<User>;
  deleteStudent: () => Promise<boolean>;
};

export function useStudentUserEdit(id?: number): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: mutateEditStudent, isLoading } = useMutation(
    editStudentApi({
      onSuccess: (data) =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryUserKey.studentList,
          }),
          queryClient.invalidateQueries({
            queryKey: [...queryUserKey.studentSingle, { id: data?.id }],
          }),
        ]),
    }),
  );

  const { mutateAsync: mutateDeleteStudent, isLoading: isDeleteLoading } =
    useMutation(
      deleteStudentApi({
        onSuccess: () =>
          Promise.all([
            queryClient.invalidateQueries({
              queryKey: queryUserKey.studentList,
            }),
            queryClient.invalidateQueries({
              queryKey: [...queryUserKey.studentSingle, { id }],
            }),
          ]),
      }),
    );

  const {
    data: student,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
  } = useQuery(
    getStudentByIdAndCurrentTeacherUserApi(
      { id: id || 0 },
      {
        enabled: !!id,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToStudentUserAccount(data);
        },
      },
    ),
  );

  const studentFormData = useMemo(
    () => (student ? transformToUserRegisterFormData(student) : undefined),
    [student],
  );

  const editStudent = useCallback(
    async (data: UserUpsertFormData) => {
      const updatedStudent = await mutateEditStudent({
        studentId: +(id || 0),
        data,
      });

      return updatedStudent;
    },
    [id, mutateEditStudent],
  );

  const deleteStudent = useCallback(async () => {
    if (!id) {
      return false;
    }

    return mutateDeleteStudent(id);
  }, [id, mutateDeleteStudent]);

  return {
    loading: isLoading || isDeleteLoading || isQueryLoading || isQueryFetching,
    isDone,
    setIsDone,
    studentFormData,
    editStudent,
    deleteStudent,
  };
}
