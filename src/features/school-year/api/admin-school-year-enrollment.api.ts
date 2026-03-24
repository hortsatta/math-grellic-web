import { kyInstance } from '#/config/ky.config';
import { generateApiError } from '#/utils/api.util';
import {
  transformToSchoolYearEnrollmentNew,
  transformToSchoolYearTeacherEnrollmentNewCreateDto,
} from '../helpers/school-year-enrollment-transform.helper';

import type { UseMutationOptions } from '@tanstack/react-query';
import type {
  SchoolYearEnrollmentApprovalStatus,
  SchoolYearEnrollmentNew,
} from '../models/school-year-enrollment.model';
import type { SchoolYearEnrollmentNewCreateFormData } from '../models/school-year-enrollment-form-data.model';

const BASE_URL = 'sy-enrollments';
const ADMIN_URL = 'admins';
const TEACHER_URL = 'teachers';
const ADMIN_BASE_URL = `${BASE_URL}/${ADMIN_URL}`;

export function enrollNewTeacherUser(
  options?: Omit<
    UseMutationOptions<
      SchoolYearEnrollmentNew,
      Error,
      SchoolYearEnrollmentNewCreateFormData,
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async (
    data: SchoolYearEnrollmentNewCreateFormData,
  ): Promise<any> => {
    const url = `${ADMIN_BASE_URL}/enroll-new/${TEACHER_URL}`;
    const json = transformToSchoolYearTeacherEnrollmentNewCreateDto(data);

    try {
      const result = await kyInstance.post(url, { json }).json();
      return transformToSchoolYearEnrollmentNew(result);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function setTeacherApprovalStatus(
  options?: Omit<
    UseMutationOptions<
      {
        approvalStatus: string;
        approvalDate: string;
        approvalRejectedReason: string;
      },
      Error,
      {
        enrollmentId: number;
        approvalStatus: SchoolYearEnrollmentApprovalStatus;
      },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    enrollmentId,
    approvalStatus,
  }: {
    enrollmentId: number;
    approvalStatus: SchoolYearEnrollmentApprovalStatus;
  }): Promise<any> => {
    const url = `${ADMIN_BASE_URL}/${TEACHER_URL}/approve/${enrollmentId}`;
    const json = { approvalStatus };

    try {
      const userApproval = await kyInstance.patch(url, { json }).json();
      return userApproval;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
