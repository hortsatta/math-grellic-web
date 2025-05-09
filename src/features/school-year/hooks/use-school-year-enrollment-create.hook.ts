import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { createEnrollment as createEnrollmentApi } from '../api/school-year-enrollment.api';

import type { SchoolYearEnrollment } from '../models/school-year-enrollment.model';
import type { SchoolYearEnrollmentCreateFormData } from '../models/school-year-enrollment-form-data.model';

type Result = {
  isDone: boolean;
  setIsDone: (isDone: boolean) => void;
  createEnrollment: (
    data: SchoolYearEnrollmentCreateFormData,
  ) => Promise<SchoolYearEnrollment>;
};

export function useSchoolYearEnrollmentCreate(): Result {
  const [isDone, setIsDone] = useState(false);

  const { mutateAsync: createEnrollment } = useMutation(createEnrollmentApi());

  return { isDone, setIsDone, createEnrollment };
}
