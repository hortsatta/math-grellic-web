import { kyInstance } from '#/config/ky.config';
import { generateApiError } from '#/utils/api.util';

import type { UseMutationOptions } from '@tanstack/react-query';
import type { UserRegisterLastStepFormData } from '../models/user-form-data.model';

const BASE_URL = 'users';

export function confirmUserRegistrationEmail(
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

export function confirmUserRegistrationLastStep(
  options?: Omit<
    UseMutationOptions<
      string,
      Error,
      Omit<UserRegisterLastStepFormData, 'confirmPassword'>,
      any
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async (
    data: Omit<UserRegisterLastStepFormData, 'confirmPassword'>,
  ): Promise<any> => {
    const url = `${BASE_URL}/register/confirm/last-step`;

    try {
      const result = await kyInstance.post(url, { json: data }).json();
      return (result as { publicId: string }).publicId;
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}

export function validateUserRegistrationToken(
  options?: Omit<UseMutationOptions<boolean, Error, string, any>, 'mutationFn'>,
) {
  const mutationFn = async (token: string): Promise<any> => {
    const url = `${BASE_URL}/register/confirm/validate?token=${token}`;

    try {
      return kyInstance.get(url).json();
    } catch (error: any) {
      const apiError = await generateApiError(error);
      throw apiError;
    }
  };

  return { mutationFn, ...options };
}
