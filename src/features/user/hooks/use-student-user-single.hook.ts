import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToStudentUserAccount } from '../helpers/user-transform.helper';
import { getStudentByIdAndCurrentTeacherUser } from '../api/teacher-user.api';

import type { StudentUserAccount } from '../models/user.model';

type Result = {
  loading: boolean;
  student?: StudentUserAccount;
};

export function useStudentUserSingle(): Result {
  const schoolYearId = useBoundStore((state) => state.schoolYear?.id);
  const { id } = useParams();

  const queryConfig = useMemo(
    () =>
      getStudentByIdAndCurrentTeacherUser(
        { id: +(id || 0), schoolYearId },
        {
          enabled: !!id,
          refetchOnWindowFocus: false,
          select: (data: any) => {
            return transformToStudentUserAccount(data);
          },
        },
      ),
    [id, schoolYearId],
  );

  const { data: student, isLoading, isFetching } = useQuery(queryConfig);

  return {
    loading: isLoading || isFetching,
    student,
  };
}
