import { generateSearchParams, kyInstance } from '#/config/ky.config';
import {
  querySchoolYearKey,
  querySyEnrollmentKey,
} from '#/config/react-query-keys.config';
import { generateApiError } from '#/utils/api.util';
import {
  transformToSchoolYearEnrollmentNew,
  transformToSchoolYearStudentEnrollmentNewCreateDto,
} from '../helpers/school-year-enrollment-transform.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { TeacherStudentSchoolYearAcademicProgress } from '../models/school-year.model';
import type {
  SchoolYearEnrollment,
  SchoolYearEnrollmentApprovalStatus,
  SchoolYearEnrollmentNew,
} from '../models/school-year-enrollment.model';
import type {
  SchoolYearEnrollmentAcademicProgressFormData,
  SchoolYearEnrollmentNewCreateFormData,
} from '../models/school-year-enrollment-form-data.model';

const BASE_URL = 'sy-enrollments';
const STUDENT_URL = 'students';
const TEACHER_URL = 'teachers';
const TEACHER_BASE_URL = `${BASE_URL}/${TEACHER_URL}`;

export function getStudentEnrollmentByPublicIdAndCurrentTeacherUser(
  keys: {
    publicId: string;
    schoolYearId: number;
  },
  options?: Omit<
    UseQueryOptions<SchoolYearEnrollment, Error, SchoolYearEnrollment, any>,
    'queryFn'
  >,
) {
  const { publicId, schoolYearId } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${TEACHER_BASE_URL}/${STUDENT_URL}/${publicId}`;
    const searchParams = generateSearchParams({
      sy: schoolYearId?.toString(),
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
    queryKey: [
      ...querySyEnrollmentKey.studentSingle,
      { publicId, schoolYearId },
    ],
    queryFn,
    ...options,
  };
}

export function getStudentsAcademicProgressByCurrentTeacherUser(
  schoolYearId?: number,
  options?: Omit<
    UseQueryOptions<
      TeacherStudentSchoolYearAcademicProgress,
      Error,
      TeacherStudentSchoolYearAcademicProgress,
      any
    >,
    'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    const url = `${TEACHER_BASE_URL}/${STUDENT_URL}/academic-progress`;
    const searchParams = generateSearchParams({
      sy: schoolYearId?.toString(),
    });

    try {
      const academicProgress = await kyInstance
        .get(url, { searchParams })
        .json();

      return academicProgress;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...querySchoolYearKey.studentsAcademicProgress,
      { schoolYearId },
    ],
    queryFn,
    ...options,
  };
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

export function setStudentAcademicProgressByPublicIdAndTeacherId(
  options?: Omit<
    UseMutationOptions<
      {
        academicProgress: string;
        academicProgressRemarks: string;
      },
      Error,
      { publicId: string; data: SchoolYearEnrollmentAcademicProgressFormData },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    publicId,
    data,
  }: {
    publicId: string;
    data: SchoolYearEnrollmentAcademicProgressFormData;
  }): Promise<any> => {
    const url = `${TEACHER_BASE_URL}/${STUDENT_URL}/${publicId}/set-progress`;

    try {
      const academicProgress = await kyInstance
        .patch(url, { json: data })
        .json();
      return academicProgress;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
