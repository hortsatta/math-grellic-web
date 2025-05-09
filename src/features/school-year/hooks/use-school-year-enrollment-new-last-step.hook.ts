import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import {
  confirmSchoolYearEnrollmentNewLastStep,
  validateSchoolYearEnrollmentNewToken,
} from '../api/school-year-enrollment.api';

import type { UserRegisterLastStepFormData } from '#/user/models/user-form-data.model';

type FormData = Omit<UserRegisterLastStepFormData, 'token'>;
type Result = {
  loading: boolean;
  publicId: string | null;
  isConfirmed: boolean | null;
  submitLastStep: (data: FormData) => void;
};

export function useSchoolYearEnrollmentNewLastStep(): Result {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean | null>(null);
  const [publicId, setIsPublicId] = useState<string | null>(null);

  const { mutateAsync: confirmEnrollmentNewLastStep } = useMutation(
    confirmSchoolYearEnrollmentNewLastStep(),
  );
  const { mutateAsync: validateEnrollmentNewToken } = useMutation(
    validateSchoolYearEnrollmentNewToken(),
  );

  const submitLastStep = useCallback(
    async (data: FormData) => {
      if (!token?.trim().length) return;

      const result = await confirmEnrollmentNewLastStep({
        password: data.password,
        token,
      });

      setIsPublicId(result?.trim().length ? result : null);
      setIsConfirmed(!!result?.trim().length);
    },
    [token, confirmEnrollmentNewLastStep],
  );

  useEffect(() => {
    const redirect = () => {
      navigate('/');
      setIsConfirmed(false);
    };

    const targetToken = searchParams.get('token');

    // Run fake initial loading for spinner
    const loadingTimeout = setTimeout(() => setLoading(false), 2000);
    // Cancel api call if token is empty
    if (!targetToken?.trim().length) {
      redirect();
      return;
    }

    // Run api token validation
    (async () => {
      try {
        const isValid = await validateEnrollmentNewToken(targetToken);

        if (isValid) {
          setToken(targetToken);
        } else {
          redirect();
        }
      } catch (error) {
        redirect();
      }
    })();

    // Clear timeout on unmount
    () => {
      clearTimeout(loadingTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    publicId,
    isConfirmed,
    submitLastStep,
  };
}
