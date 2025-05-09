import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { queryUserKey } from '#/config/react-query-keys.config';
import { queryClient } from '#/config/react-query-client.config';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { registerStudentUser } from '../api/student-user.api';

import type { User } from '../models/user.model';
import type { UserUpsertFormData } from '../models/user-form-data.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  register: (data: UserUpsertFormData) => Promise<User | null>;
};

export function useStudentUserCreate(): Result {
  const user = useBoundStore((state) => state.user);
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync } = useMutation(
    registerStudentUser({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryUserKey.studentList,
        });
      },
    }),
  );

  const register = useCallback(
    (data: UserUpsertFormData) => {
      if (!user) {
        return Promise.resolve(null);
      }

      return mutateAsync(data);
    },
    [user, mutateAsync],
  );

  return { isDone, setIsDone, register };
}
