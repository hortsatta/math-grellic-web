import { kyInstance } from '#/config/ky.config';
import { generateApiError } from '#/utils/api.util';

import type { UseMutationOptions } from '@tanstack/react-query';

const BASE_URL = 'users';

export function confirmUserRegisterEmail(
  options?: Omit<UseMutationOptions<boolean, Error, string, any>, 'mutationFn'>,
) {
  const mutationFn = async (token: string): Promise<any> => {
    const url = `${BASE_URL}/register/confirm?token=${token}`;

    try {
      return kyInstance.get(url).json();
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
