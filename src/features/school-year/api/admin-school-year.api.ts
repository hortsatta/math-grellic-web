import { querySchoolYearKey } from '#/config/react-query-keys.config';
import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { generateApiError } from '#/utils/api.util';
import {
  transformToSchoolYear,
  transformToSchoolYearUpsertDto,
} from '../helpers/school-year-transform.helper';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { PaginatedQueryData } from '#/core/models/core.model';
import type { QueryPagination } from '#/base/models/base.model';
import type { SchoolYear } from '../models/school-year.model';
import type { SchoolYearUpsertFormData } from '../models/school-year-form-data.model';

const BASE_URL = 'school-years';

export function getPaginatedSchoolYearsByCurrentAdminUser(
  keys?: {
    q?: string;
    status?: string;
    sort?: string;
    pagination?: Omit<QueryPagination, 'totalCount'>;
  },
  options?: Omit<
    UseQueryOptions<
      PaginatedQueryData<SchoolYear>,
      Error,
      PaginatedQueryData<SchoolYear>,
      any
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const { q, status, sort, pagination } = keys || {};
  const { take, skip } = pagination || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/admins/list`;
    const searchParams = generateSearchParams({
      q,
      status,
      sort,
      skip: skip?.toString() || '0',
      take: take?.toString() || '0',
    });

    try {
      const schoolYears = await kyInstance.get(url, { searchParams }).json();
      return schoolYears;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...querySchoolYearKey.list, { q, status, sort, skip, take }],
    queryFn,
    ...options,
  };
}

export function getSchoolYearBySlugAndCurrentAdminUser(
  keys: { slug: string; exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<SchoolYear, Error, SchoolYear, any>,
    'queryFn'
  >,
) {
  const { slug, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${slug}/admins`;
    const searchParams = generateSearchParams({ exclude, include });

    try {
      const schoolYear = await kyInstance.get(url, { searchParams }).json();
      return schoolYear;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [...querySchoolYearKey.single, { slug, exclude, include }],
    queryFn,
    ...options,
  };
}

export function createSchoolYear(
  options?: Omit<
    UseMutationOptions<SchoolYear, Error, SchoolYearUpsertFormData, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (data: SchoolYearUpsertFormData): Promise<any> => {
    const json = transformToSchoolYearUpsertDto(data);

    try {
      const schoolYear = await kyInstance.post(BASE_URL, { json }).json();
      return transformToSchoolYear(schoolYear);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function editSchoolYear(
  options?: Omit<
    UseMutationOptions<
      SchoolYear,
      Error,
      { slug: string; data: SchoolYearUpsertFormData },
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    slug,
    data,
  }: {
    slug: string;
    data: SchoolYearUpsertFormData;
  }): Promise<any> => {
    const url = `${BASE_URL}/${slug}`;
    const json = transformToSchoolYearUpsertDto(data);

    try {
      const schoolYear = await kyInstance.patch(url, { json }).json();
      return transformToSchoolYear(schoolYear);
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function deleteSchoolYear(
  options?: Omit<UseMutationOptions<boolean, Error, string, any>, 'mutationFn'>,
) {
  const mutationFn = async (slug: string): Promise<boolean> => {
    const url = `${BASE_URL}/${slug}`;

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
