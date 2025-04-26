import { generateApiError } from '#/utils/api.util';
import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { querySchoolYearKey } from '#/config/react-query-keys.config';

import type { UseQueryOptions } from '@tanstack/react-query';
import type { SchoolYear } from '../models/school-year.model';

const BASE_URL = 'school-years';

export function getCurrentSchoolYear(
  keys: { exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<SchoolYear | null, Error, SchoolYear | null, any>,
    'queryFn'
  >,
) {
  const { exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/current`;
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
    queryKey: [...querySchoolYearKey.current, { exclude, include }],
    queryFn,
    ...options,
  };
}

export function getSchoolYearById(
  keys: { id?: number; exclude?: string; include?: string },
  options?: Omit<
    UseQueryOptions<SchoolYear, Error, SchoolYear, any>,
    'queryFn'
  >,
) {
  const { id, exclude, include } = keys;

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/${id}`;
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
    queryKey: [...querySchoolYearKey.single, { id, exclude, include }],
    queryFn,
    ...options,
  };
}
