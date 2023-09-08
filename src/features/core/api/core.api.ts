import { kyInstance } from '#/config/ky.config';
import { queryKey } from '#/config/react-query-key.config';

import type { UseQueryOptions } from '@tanstack/react-query';
import type { HTTPError } from 'ky';

const BASE_URL = 'core';

export function getDateTimeNow(
  options?: Omit<
    UseQueryOptions<Date | null, Error, Date | null, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    const url = `${BASE_URL}/now`;

    try {
      const dateTime = await kyInstance.get(url).json();
      return dateTime;
    } catch (error) {
      const errorRes = await (error as HTTPError).response.json();
      throw new Error(errorRes.message);
    }
  };

  return {
    ...queryKey.core.time,
    queryFn,
    ...options,
  };
}