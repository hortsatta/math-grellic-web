import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { querySyEnrollmentKey } from '#/config/react-query-keys.config';
import { generateApiError } from '#/utils/api.util';
import { UserRole } from '#/user/models/user.model';
import {
  transformToSchoolYearEnrollment,
  transformToSchoolYearEnrollmentCreateDto,
} from '../helpers/school-year-enrollment-transform.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { SchoolYearEnrollment } from '../models/school-year-enrollment.model';
import type { SchoolYearEnrollmentCreateFormData } from '../models/school-year-enrollment-form-data.model';

const BASE_URL = 'sy-enrollments';

export function getSchoolYearEnrollment(
  schoolYearId?: number,
  options?: Omit<
    UseQueryOptions<
      SchoolYearEnrollment | null,
      Error,
      SchoolYearEnrollment | null,
      any
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/me`;
    const searchParams = generateSearchParams({
      sy: schoolYearId != null ? schoolYearId.toString() : null,
    });

    try {
      const enrollment = await kyInstance.get(url, { searchParams }).json();
      return enrollment;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: querySyEnrollmentKey.currentSyEnrollment,
    queryFn,
    ...options,
  };
}

export function createEnrollment(
  options?: Omit<
    UseMutationOptions<
      SchoolYearEnrollment,
      Error,
      SchoolYearEnrollmentCreateFormData,
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async (
    data: SchoolYearEnrollmentCreateFormData,
  ): Promise<any> => {
    const url =
      data.role === UserRole.Teacher
        ? `${BASE_URL}/teachers/enroll`
        : `${BASE_URL}/students/enroll`;

    const json = transformToSchoolYearEnrollmentCreateDto(data);

    try {
      const enrollment = await kyInstance.post(url, { json }).json();
      return transformToSchoolYearEnrollment(enrollment);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
