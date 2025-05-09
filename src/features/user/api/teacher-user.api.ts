import { generateApiError } from '#/utils/api.util';
import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryUserKey } from '#/config/react-query-keys.config';
import {
  transformToStudentUserUpdateDto,
  transformToTeacherUserCreateDto,
  transformToTeacherUserUpdateDto,
  transformToUser,
} from '../helpers/user-transform.helper';
import { UserApprovalStatus } from '../models/user.model';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { QueryPagination } from '#/base/models/base.model';
import type { PaginatedQueryData } from '#/core/models/core.model';
import type { StudentUserAccount, User } from '../models/user.model';
import type {
  TeacherUserUpdateFormData,
  UserUpsertFormData,
} from '../models/user-form-data.model';

const BASE_URL = 'users';
const STUDENT_URL = 'students';
const TEACHER_BASE_URL = `${BASE_URL}/teachers`;

export function registerTeacherUser(
  options?: Omit<
    UseMutationOptions<User | null, Error, UserUpsertFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: UserUpsertFormData): Promise<any> => {
    const url = `${TEACHER_BASE_URL}/register`;
    const json = transformToTeacherUserCreateDto(data);

    try {
      const user = await kyInstance.post(url, { json }).json();
      return transformToUser(user);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function getPaginatedStudentsByCurrentTeacherUser(
  keys?: {
    q?: string;
    status?: string;
    sort?: string;
    pagination?: Omit<QueryPagination, 'totalCount'>;
    schoolYearId?: number;
    enrollmentStatus?: string;
  },
  options?: Omit<
    UseQueryOptions<
      PaginatedQueryData<StudentUserAccount>,
      Error,
      PaginatedQueryData<StudentUserAccount>,
      any
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const { q, status, sort, pagination, schoolYearId, enrollmentStatus } =
    keys || {};
  const { take, skip } = pagination || {};

  const queryFn = async (): Promise<any> => {
    const url = `${TEACHER_BASE_URL}/${STUDENT_URL}/list`;
    const searchParams = generateSearchParams({
      q,
      status,
      sort,
      skip: skip?.toString() || '0',
      take: take?.toString() || '0',
      sy: schoolYearId?.toString(),
      estatus: enrollmentStatus,
    });

    try {
      const students = await kyInstance.get(url, { searchParams }).json();
      return students;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...queryUserKey.studentList,
      { q, status, sort, skip, take, enrollmentStatus },
    ],
    queryFn,
    ...options,
  };
}

export function getStudentsByCurrentTeacherUser(
  keys?: {
    q?: string;
    ids?: number[];
    status?: string;
    schoolYearId?: number;
    enrollmentStatus?: string;
  },
  options?: Omit<
    UseQueryOptions<StudentUserAccount[], Error, StudentUserAccount[], any>,
    'queryFn'
  >,
) {
  const { q, ids, status, schoolYearId, enrollmentStatus } = keys || {};
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${TEACHER_BASE_URL}/${STUDENT_URL}/list/all`;
    const searchParams = generateSearchParams({
      q,
      ids: ids?.join(','),
      status,
      sy: schoolYearId?.toString(),
      estatus: enrollmentStatus,
    });

    try {
      const students = await kyInstance.get(url, { searchParams }).json();
      return students;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...(queryKey?.length ? queryKey : queryUserKey.allStudentList),
      { q, ids, status, enrollmentStatus },
    ],
    queryFn,
    ...moreOptions,
  };
}

export function getStudentCountByCurrentTeacherUser(
  keys?: { status?: string; schoolYearId?: number; enrollmentStatus?: string },
  options?: Omit<UseQueryOptions<number, Error, number, any>, 'queryFn'>,
) {
  const { status, schoolYearId, enrollmentStatus } = keys || {};
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${TEACHER_BASE_URL}/${STUDENT_URL}/count`;
    const searchParams = generateSearchParams({
      status,
      sy: schoolYearId?.toString(),
      estatus: enrollmentStatus,
    });

    try {
      const count = await kyInstance.get(url, { searchParams }).json();
      return count;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...(queryKey?.length ? queryKey : queryUserKey.allStudentList),
      { status },
    ],
    queryFn,
    ...moreOptions,
  };
}

export function getStudentByIdAndCurrentTeacherUser(
  keys: {
    id: number;
    schoolYearId?: number;
    exclude?: string;
    include?: string;
  },
  options?: Omit<
    UseQueryOptions<StudentUserAccount, Error, StudentUserAccount, any>,
    'queryFn'
  >,
) {
  const { id, schoolYearId, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${TEACHER_BASE_URL}/${STUDENT_URL}/${id}`;
    const searchParams = generateSearchParams({
      sy: schoolYearId?.toString(),
      exclude,
      include,
    });

    try {
      const student = await kyInstance.get(url, { searchParams }).json();
      return student;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryUserKey.studentSingle, { id, exclude, include }],
    queryFn,
    ...options,
  };
}

export function editCurrentTeacherUser(
  options?: Omit<
    UseMutationOptions<User, Error, TeacherUserUpdateFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: TeacherUserUpdateFormData): Promise<any> => {
    const json = transformToTeacherUserUpdateDto(data);

    try {
      const user = await kyInstance.patch(TEACHER_BASE_URL, { json }).json();
      return transformToUser(user);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function editStudent(
  options?: Omit<
    UseMutationOptions<
      User,
      Error,
      { studentId: number; data: UserUpsertFormData },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    studentId,
    data,
  }: {
    studentId: number;
    data: UserUpsertFormData;
  }): Promise<any> => {
    const url = `${TEACHER_BASE_URL}/${STUDENT_URL}/${studentId}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, password, confirmPassword, ...moreData } = data;
    const json = transformToStudentUserUpdateDto(moreData);

    try {
      const user = await kyInstance.patch(url, { json }).json();
      return transformToUser(user);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function deleteStudent(
  options?: Omit<UseMutationOptions<boolean, Error, number, any>, 'mutationFn'>,
) {
  const mutationFn = async (id: number): Promise<boolean> => {
    const url = `${TEACHER_BASE_URL}/${STUDENT_URL}/${id}`;

    try {
      const success: boolean = await kyInstance.delete(url).json();
      return success;
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
      { studentId: number; approvalStatus: UserApprovalStatus },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    studentId,
    approvalStatus,
  }: {
    studentId: number;
    approvalStatus: UserApprovalStatus;
  }): Promise<any> => {
    const url = `${TEACHER_BASE_URL}/${STUDENT_URL}/approve/${studentId}`;
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
