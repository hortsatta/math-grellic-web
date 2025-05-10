import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { generateApiError } from '#/utils/api.util';
import { UserRole } from '#/user/models/user.model';
import {
  transformToSchoolYearEnrollment,
  transformToSchoolYearEnrollmentCreateDto,
  transformToSchoolYearEnrollmentNew,
  transformToSchoolYearStudentEnrollmentNewCreateDto,
} from '../helpers/school-year-enrollment-transform.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { UserRegisterLastStepFormData } from '#/user/models/user-form-data.model';
import type {
  SchoolYearEnrollment,
  SchoolYearEnrollmentApprovalStatus,
  SchoolYearEnrollmentNew,
} from '../models/school-year-enrollment.model';
import type {
  SchoolYearEnrollmentCreateFormData,
  SchoolYearEnrollmentNewCreateFormData,
} from '../models/school-year-enrollment-form-data.model';

const BASE_URL = 'sy-enrollments';
const STUDENT_URL = 'students';
const TEACHER_URL = 'teachers';
const ADMIN_URL = 'admins';
const TEACHER_BASE_URL = `${BASE_URL}/${TEACHER_URL}`;
const ADMIN_BASE_URL = `${BASE_URL}/${ADMIN_URL}`;

export function validateSchoolYearEnrollmentNewToken(
  options?: Omit<UseMutationOptions<boolean, Error, string, any>, 'mutationFn'>,
) {
  const mutationFn = async (token: string): Promise<any> => {
    const url = `${BASE_URL}/enroll-new/confirm/validate?token=${token}`;

    try {
      return kyInstance.get(url).json();
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function confirmSchoolYearEnrollmentNewLastStep(
  options?: Omit<
    UseMutationOptions<
      string,
      Error,
      Omit<UserRegisterLastStepFormData, 'confirmPassword'>,
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async (
    data: Omit<UserRegisterLastStepFormData, 'confirmPassword'>,
  ): Promise<any> => {
    const url = `${BASE_URL}/enroll-new/confirm`;

    try {
      const result = await kyInstance.post(url, { json: data }).json();
      return (result as { publicId: string }).publicId;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

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
    queryKey: [],
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
        ? `${TEACHER_BASE_URL}/enroll`
        : `${BASE_URL}/${STUDENT_URL}/enroll`;

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

export function enrollNewStudentUser(
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
    const url = `${TEACHER_BASE_URL}/enroll-new/${STUDENT_URL}`;
    const json = transformToSchoolYearStudentEnrollmentNewCreateDto(data);

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

export function setStudentApprovalStatus(
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
    const url = `${TEACHER_BASE_URL}/${STUDENT_URL}/approve/${enrollmentId}`;
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
