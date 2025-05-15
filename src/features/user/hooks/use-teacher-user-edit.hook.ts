import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { queryUserKey } from '#/config/react-query-keys.config';
import {
  transformToTeacherUserAccount,
  transformToUserRegisterFormData,
} from '../helpers/user-transform.helper';
import {
  deleteTeacher as deleteTeacherApi,
  editTeacher as editTeacherApi,
  getTeacherById as getTeacherByIdApi,
} from '../api/admin-user.api';

import type { User } from '../models/user.model';
import type { UserUpsertFormData } from '../models/user-form-data.model';

type Result = {
  loading: boolean;
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  teacherFormData: UserUpsertFormData | undefined;
  editTeacher: (data: UserUpsertFormData) => Promise<User>;
  deleteTeacher: () => Promise<boolean>;
};

export function useTeacherUserEdit(id?: number): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: mutateEditTeacher, isLoading } = useMutation(
    editTeacherApi({
      onSuccess: (data) =>
        Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryUserKey.teacherList,
          }),
          queryClient.invalidateQueries({
            queryKey: [
              ...queryUserKey.teacherSingle,
              { id: data?.userAccount?.id },
            ],
          }),
        ]),
    }),
  );

  const { mutateAsync: mutateDeleteTeacher, isLoading: isDeleteLoading } =
    useMutation(
      deleteTeacherApi({
        onSuccess: () =>
          Promise.all([
            queryClient.invalidateQueries({
              queryKey: queryUserKey.teacherList,
            }),
            queryClient.invalidateQueries({
              queryKey: [...queryUserKey.teacherSingle, { id }],
            }),
          ]),
      }),
    );

  const {
    data: teacher,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
  } = useQuery(
    getTeacherByIdApi(
      { id: id || 0 },
      {
        enabled: !!id,
        refetchOnWindowFocus: false,
        select: (data: any) => {
          return transformToTeacherUserAccount(data);
        },
      },
    ),
  );

  const teacherFormData = useMemo(
    () => (teacher ? transformToUserRegisterFormData(teacher) : undefined),
    [teacher],
  );

  const editTeacher = useCallback(
    async (data: UserUpsertFormData) => {
      const updatedTeacher = await mutateEditTeacher({
        teacherId: +(id || 0),
        data,
      });

      return updatedTeacher;
    },
    [id, mutateEditTeacher],
  );

  const deleteTeacher = useCallback(async () => {
    if (!id) {
      return false;
    }

    return mutateDeleteTeacher(id);
  }, [id, mutateDeleteTeacher]);

  return {
    loading: isLoading || isDeleteLoading || isQueryLoading || isQueryFetching,
    isDone,
    setIsDone,
    teacherFormData,
    editTeacher,
    deleteTeacher,
  };
}
