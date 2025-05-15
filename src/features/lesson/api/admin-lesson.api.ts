import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryLessonKey } from '#/config/react-query-keys.config';
import { generateApiError } from '#/utils/api.util';

import type { UseQueryOptions } from '@tanstack/react-query';
import type { Lesson } from '../models/lesson.model';

const BASE_URL = 'lessons';
const ADMIN_URL = 'admins';
const TEACHER_URL = 'teachers';
const ADMIN_BASE_URL = `${BASE_URL}/${ADMIN_URL}`;

export function getLessonCountByTeacherId(
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
    queryKey: [...queryLessonKey.count, { teacherId, schoolYearId }],
    queryFn,
    ...options,
  };
}

export function getLessonsByTeacherId(
  keys: {
    teacherId: number;
    ids?: number[];
    q?: string;
    status?: string;
    sort?: string;
    schoolYearId?: number;
  },
  options?: Omit<
    UseQueryOptions<Lesson[], Error, Lesson[] | undefined, any>,
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
      const lessons = await kyInstance.get(url, { searchParams }).json();
      return lessons;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...(queryKey?.length ? queryKey : queryLessonKey.list),
      { q, ids, status, sort, teacherId, schoolYearId },
    ],
    queryFn,
    ...moreOptions,
  };
}
