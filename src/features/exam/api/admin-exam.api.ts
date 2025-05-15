import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryExamKey } from '#/config/react-query-keys.config';
import { generateApiError } from '#/utils/api.util';

import type { UseQueryOptions } from '@tanstack/react-query';
import type { Exam } from '../models/exam.model';

const BASE_URL = 'exams';
const ADMIN_URL = 'admins';
const TEACHER_URL = 'teachers';
const ADMIN_BASE_URL = `${BASE_URL}/${ADMIN_URL}`;

export function getExamCountByTeacherId(
  keys: { teacherId: number; schoolYearId?: number },
  options?: Omit<UseQueryOptions<number, Error, number, any>, 'queryFn'>,
) {
  const { teacherId, schoolYearId } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${ADMIN_BASE_URL}/${TEACHER_URL}/${teacherId}/count`;
    const searchParams = generateSearchParams({ sy: schoolYearId?.toString() });

    try {
      const count = await kyInstance.get(url, { searchParams }).json();
      return count;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...queryExamKey.count, { teacherId, schoolYearId }],
    queryFn,
    ...options,
  };
}

export function getExamsByTeacherId(
  keys: {
    teacherId: number;
    ids?: number[];
    q?: string;
    status?: string;
    sort?: string;
    schoolYearId?: number;
  },
  options?: Omit<
    UseQueryOptions<Exam[], Error, Exam[] | undefined, any>,
    'queryFn'
  >,
) {
  const { teacherId, ids, q, status, sort, schoolYearId } = keys || {};
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${ADMIN_BASE_URL}/${TEACHER_URL}/${teacherId}/list/all`;
    const searchParams = generateSearchParams({
      ids: ids?.join(','),
      q,
      status,
      sort,
      sy: schoolYearId?.toString(),
    });

    try {
      const exams = await kyInstance.get(url, { searchParams }).json();
      return exams;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...(queryKey?.length ? queryKey : queryExamKey.list),
      { q, ids, status, sort, teacherId, schoolYearId },
    ],
    queryFn,
    ...moreOptions,
  };
}
