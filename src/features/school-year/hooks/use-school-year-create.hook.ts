import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from '#/config/react-query-client.config';
import { querySchoolYearKey } from '#/config/react-query-keys.config';
import { createSchoolYear as createSchoolYearApi } from '../api/admin-school-year.api';

import type { SchoolYear } from '../models/school-year.model';
import type { SchoolYearUpsertFormData } from '../models/school-year-form-data.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  createSchoolYear: (data: SchoolYearUpsertFormData) => Promise<SchoolYear>;
};

export function useSchoolYearCreate(): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: createSchoolYear } = useMutation(
    createSchoolYearApi({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: querySchoolYearKey.list,
        });
      },
    }),
  );

  return { isDone, setIsDone, createSchoolYear };
}
