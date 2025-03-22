import { useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';

import { UserRole } from '../models/user.model';
import { registerTeacherUser } from '../api/teacher-user.api';
import { registerStudentUser } from '../api/student-user.api';

import type { User } from '../models/user.model';
import type { UserUpsertFormData } from '../models/user-form-data.model';

type Result = {
  register: (data: UserUpsertFormData, role: UserRole) => Promise<User | null>;
};

export function useUserRegister(): Result {
  const { mutateAsync: mutateRegTeacherUser } = useMutation(
    registerTeacherUser(),
  );
  const { mutateAsync: mutateRegStudentUser } = useMutation(
    registerStudentUser(),
  );

  const register = useCallback(
    async (data: UserUpsertFormData, role: UserRole) => {
      try {
        let newUser = null;
        if (role === UserRole.Teacher) {
          newUser = await mutateRegTeacherUser(data);
        } else if (role === UserRole.Student) {
          newUser = await mutateRegStudentUser(data);
        }
        return newUser;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    [mutateRegTeacherUser, mutateRegStudentUser],
  );

  return {
    register,
  };
}
