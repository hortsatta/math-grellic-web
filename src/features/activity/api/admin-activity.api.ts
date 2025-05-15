import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryActivityKey } from '#/config/react-query-keys.config';
import { generateApiError } from '#/utils/api.util';

import type { UseQueryOptions } from '@tanstack/react-query';
import type { Activity } from '../models/activity.model';

const BASE_URL = 'activities';
const ADMIN_URL = 'admins';
const TEACHER_URL = 'teachers';
const ADMIN_BASE_URL = `${BASE_URL}/${ADMIN_URL}`;

export function getActivityCountByTeacherId(
  keys: { teacherId: number; schoolYearId?: number },
  options?: Omit<UseQueryOptions<number, Error, number, any>, 'queryFn'>,
) {
  const { teacherId, schoolYearId } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${ADMIN_BASE_URL}/${teacherId}/count`;
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
    queryKey: [...queryActivityKey.count, { teacherId, schoolYearId }],
    queryFn,
    ...options,
  };
}

export function getActivitiesByTeacherId(
  keys: {
    teacherId: number;
    ids?: number[];
    q?: string;
    status?: string;
    schoolYearId?: number;
  },
  options?: Omit<
    UseQueryOptions<Activity[], Error, Activity[] | undefined, any>,
    'queryFn'
  >,
) {
  const { teacherId, ids, q, status, schoolYearId } = keys || {};
  const { queryKey, ...moreOptions } = options || {};

  const queryFn = async (): Promise<any> => {
    const url = `${ADMIN_BASE_URL}/${TEACHER_URL}/${teacherId}/list/all`;
    const searchParams = generateSearchParams({
      ids: ids?.join(','),
      q,
      status,
      sy: schoolYearId?.toString(),
    });

    try {
      const activities = await kyInstance.get(url, { searchParams }).json();
      return activities;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...(queryKey?.length ? queryKey : queryActivityKey.list),
      { q, ids, status, teacherId, schoolYearId },
    ],
    queryFn,
    ...moreOptions,
  };
}
