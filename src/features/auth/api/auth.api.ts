import { generateApiError } from '#/utils/api.util';
import { queryUserKey } from '#/config/react-query-keys.config';
import { kyInstance } from '#/config/ky.config';

import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import type { User } from '#/user/models/user.model';
import type { AuthCredentials, AuthToken } from '../models/auth.model';

const BASE_URL = 'auth';

export function getCurrentUser(
  options?: Omit<
    UseQueryOptions<User | null, Error, User | null, any>,
    'queryKey' | 'queryFn'
  >,
) {
  const queryFn = async (): Promise<any> => {
    const url = 'users/me';

    try {
      const user = await kyInstance.get(url).json();
      return user;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return {
    queryKey: queryUserKey.currentUser,
    queryFn,
    ...options,
  };
}

export function loginUser(
  options?: Omit<
    UseMutationOptions<AuthToken, Error, AuthCredentials, any>,
    'mutationFn'
  >,
) {
  const mutationFn = async (
    credentials: AuthCredentials,
  ): Promise<AuthToken> => {
    const url = `${BASE_URL}/login`;

    try {
      const authToken = await kyInstance
        .post(url, { json: credentials })
        .json();

      return authToken as AuthToken;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function logoutUser(
  options?: Omit<UseMutationOptions<boolean, Error, void, any>, 'mutationFn'>,
) {
  const mutationFn = async (): Promise<boolean> => {
    const url = `${BASE_URL}/logout`;

    try {
      const result = await kyInstance.post(url, {}).json();
      return result as boolean;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export async function refreshAuthTokens(
  refreshToken: string,
): Promise<AuthToken> {
  const url = `${BASE_URL}/refresh`;
  const json = { refreshToken };
  const authToken = await kyInstance.post(url, { json }).json();

  return authToken as AuthToken;
}
