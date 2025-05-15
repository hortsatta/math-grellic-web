import { generateApiError } from '#/utils/api.util';
import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryUserKey } from '#/config/react-query-keys.config';
import {
  transformToAdminUserUpdateDto,
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
import type {
  StudentUserAccount,
  TeacherUserAccount,
  User,
} from '../models/user.model';
import type {
  AdminUserUpdateFormData,
  UserUpsertFormData,
} from '../models/user-form-data.model';

const BASE_URL = 'users';
const TEACHER_URL = 'teachers';
const STUDENT_URL = 'students';
const ADMIN_BASE_URL = `${BASE_URL}/admins`;

export function getPaginatedTeachersByCurrentAdminUser(
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
      PaginatedQueryData<TeacherUserAccount>,
      Error,
      PaginatedQueryData<TeacherUserAccount>,
      any
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const { q, status, sort, pagination, schoolYearId, enrollmentStatus } =
    keys || {};
  const { take, skip } = pagination || {};

  const queryFn = async (): Promise<any> => {
    const url = `${ADMIN_BASE_URL}/${TEACHER_URL}/list`;
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
      const teachers = await kyInstance.get(url, { searchParams }).json();
      return teachers;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...queryUserKey.teacherList,
      { q, status, sort, skip, take, schoolYearId, enrollmentStatus },
    ],
    queryFn,
    ...options,
  };
}

export function getTeachersByCurrentAdminUser(
  keys?: {
    q?: string;
    ids?: number[];
    status?: string;
    schoolYearId?: number;
    enrollmentStatus?: string;
  },
  options?: Omit<
    UseQueryOptions<TeacherUserAccount[], Error, TeacherUserAccount[], any>,
    'queryFn'
  >,
) {
  const { q, ids, status, schoolYearId, enrollmentStatus } = keys || {};
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${ADMIN_BASE_URL}/${TEACHER_URL}/list/all`;
    const searchParams = generateSearchParams({
      q,
      ids: ids?.join(','),
      status,
      sy: schoolYearId?.toString(),
      estatus: enrollmentStatus,
    });

    try {
      const teachers = await kyInstance.get(url, { searchParams }).json();
      return teachers;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...(queryKey?.length ? queryKey : queryUserKey.allTeacherList),
      { q, ids, status, schoolYearId, enrollmentStatus },
    ],
    queryFn,
    ...moreOptions,
  };
}

export function getStudentsByCurrentAdmin(
  keys?: {
    q?: string;
    ids?: number[];
    status?: string;
    teacherId?: number;
    schoolYearId?: number;
    enrollmentStatus?: string;
  },
  options?: Omit<
    UseQueryOptions<
      StudentUserAccount[],
      Error,
      StudentUserAccount[] | undefined,
      any
    >,
    'queryFn'
  >,
) {
  const { q, ids, status, teacherId, schoolYearId, enrollmentStatus } =
    keys || {};
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${ADMIN_BASE_URL}/${STUDENT_URL}/list/all`;
    const searchParams = generateSearchParams({
      q,
      ids: ids?.join(','),
      status,
      sy: schoolYearId?.toString(),
      teaid: teacherId?.toString(),
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
      { q, ids, status, teacherId, schoolYearId, enrollmentStatus },
    ],
    queryFn,
    ...moreOptions,
  };
}

export function getTeacherById(
  keys: {
    id: number;
    schoolYearId?: number;
    withStats?: boolean;
    exclude?: string;
    include?: string;
  },
  options?: Omit<
    UseQueryOptions<TeacherUserAccount, Error, TeacherUserAccount, any>,
    'queryFn'
  >,
) {
  const { id, schoolYearId, withStats, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${ADMIN_BASE_URL}/${TEACHER_URL}/${id}`;
    const searchParams = generateSearchParams({
      sy: schoolYearId?.toString(),
      stats: (+(withStats || 0)).toString(),
      exclude,
      include,
    });

    try {
      const teacher = await kyInstance.get(url, { searchParams }).json();
      return teacher;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...queryUserKey.teacherSingle,
      { id, schoolYearId, exclude, include },
    ],
    queryFn,
    ...options,
  };
}

export function getTeacherCountByCurrentAdminUser(
  keys?: { status?: string; schoolYearId?: number; enrollmentStatus?: string },
  options?: Omit<UseQueryOptions<number, Error, number, any>, 'queryFn'>,
) {
  const { status, schoolYearId, enrollmentStatus } = keys || {};
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${ADMIN_BASE_URL}/${TEACHER_URL}/count`;
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
      ...(queryKey?.length ? queryKey : queryUserKey.allTeacherList),
      { status, schoolYearId, enrollmentStatus },
    ],
    queryFn,
    ...moreOptions,
  };
}

export function editCurrentAdminUser(
  options?: Omit<
    UseMutationOptions<User, Error, AdminUserUpdateFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: AdminUserUpdateFormData): Promise<any> => {
    const json = transformToAdminUserUpdateDto(data);

    try {
      const user = await kyInstance.patch(ADMIN_BASE_URL, { json }).json();
      return transformToUser(user);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function editTeacher(
  options?: Omit<
    UseMutationOptions<
      User,
      Error,
      { teacherId: number; data: UserUpsertFormData },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    teacherId,
    data,
  }: {
    teacherId: number;
    data: UserUpsertFormData;
  }): Promise<any> => {
    const url = `${ADMIN_BASE_URL}/${TEACHER_URL}/${teacherId}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { email, password, confirmPassword, ...moreData } = data;
    const json = transformToTeacherUserUpdateDto(moreData);

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

export function deleteTeacher(
  options?: Omit<UseMutationOptions<boolean, Error, number, any>, 'mutationFn'>,
) {
  const mutationFn = async (id: number): Promise<boolean> => {
    const url = `${ADMIN_BASE_URL}/${TEACHER_URL}/${id}`;

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

export function setTeacherApprovalStatus(
  options?: Omit<
    UseMutationOptions<
      {
        approvalStatus: string;
        approvalDate: string;
        approvalRejectedReason: string;
      },
      Error,
      { teacherId: number; approvalStatus: UserApprovalStatus },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    teacherId,
    approvalStatus,
  }: {
    teacherId: number;
    approvalStatus: UserApprovalStatus;
  }): Promise<any> => {
    const url = `${ADMIN_BASE_URL}/${TEACHER_URL}/approve/${teacherId}`;
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
