import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { queryUserKey } from '#/config/react-query-keys.config';
import { queryClient } from '#/config/react-query-client.config';
import { UserRole } from '#/user/models/user.model';
import { useBoundStore } from '#/core/hooks/use-store.hook';
import { enrollNewStudentUser } from '../api/school-year-enrollment.api';

import type { SchoolYearEnrollmentNew } from '../models/school-year-enrollment.model';
import type { UserUpsertFormData } from '#/user/models/user-form-data.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  enrollNew: (data: UserUpsertFormData) => Promise<SchoolYearEnrollmentNew>;
  schoolYearTitle?: string;
};

export function useSchoolYearStudentEnrollmentNewCreate(): Result {
  const schoolYear = useBoundStore((state) => state.schoolYear);
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync } = useMutation(
    enrollNewStudentUser({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryUserKey.studentList,
        });
      },
    }),
  );

  const enrollNew = useCallback(
    (data: UserUpsertFormData) => {
      if (!schoolYear) {
        throw new Error('Cannot enroll student, please try again');
      }

      const transformedData = {
        user: data,
        enrollment: {
          schoolYearId: schoolYear.id,
          role: UserRole.Student,
        },
      };

      return mutateAsync(transformedData);
    },
    [schoolYear, mutateAsync],
  );

  return {
    schoolYearTitle: schoolYear?.title,
    isDone,
    setIsDone,
    enrollNew,
  };
}
