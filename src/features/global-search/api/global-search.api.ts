import { generateSearchParams, kyInstance } from '#/config/ky.config';
import { queryGlobalSearchKey } from '#/config/react-query-keys.config';
import { generateApiError } from '#/utils/api.util';

import type { SearchResults } from '../models/global-search.model';
import type { UseQueryOptions } from '@tanstack/react-query';

const BASE_URL = 'global-search';

export function searchByCurrentTeacherUser(
  keys?: {
    q: string | null;
    filters?: string;
    sort?: string;
    schoolYearId?: number;
  },
  options?: Omit<
    UseQueryOptions<
      [SearchResults, number],
      Error,
      [SearchResults, number],
      any
    >,
    'queryKey' | 'queryFn'
  >,
) {
  const { q, filters, sort, schoolYearId } = keys || {};

  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/teachers`;
    const searchParams = generateSearchParams({
      q,
      filters,
      sort,
      sy: schoolYearId?.toString(),
    });

    try {
      const results = await kyInstance.get(url, { searchParams }).json();
      return results;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: [
      ...queryGlobalSearchKey.results,
      { q, filters, sort, schoolYearId },
    ],
    queryFn,
    ...options,
  };
}
