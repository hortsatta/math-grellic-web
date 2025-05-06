import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { confirmUserRegistrationEmail } from '../api/user.api';

type Result = {
  loading: boolean;
  publicId: string | null;
  isConfirmed: boolean | null;
  confirmUserEmail: (token: string) => void;
};

export function useUserRegisterEmailConfirm(): Result {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState<boolean | null>(null);
  const [publicId, setIsPublicId] = useState<string | null>(null);

  const { mutateAsync } = useMutation(confirmUserRegistrationEmail());

  const confirmUserEmail = useCallback(
    async (token: string) => {
      const result = await mutateAsync(token);

      setIsPublicId(result?.trim().length ? result : null);
      setIsConfirmed(!!result);
    },
    [mutateAsync],
  );

  useEffect(() => {
    const token = searchParams.get('token');
    // Run fake initial loading for spinner
    const loadingTimeout = setTimeout(() => setLoading(false), 2000);
    // Cancel api call if token is empty
    if (!token?.length) {
      navigate('/');
      setIsConfirmed(false);
      return;
    }
    // Run api email confirmation
    (async () => {
      await confirmUserEmail(token);
    })();
    // Clear timeout on unmount
    () => {
      clearTimeout(loadingTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading: loading || isConfirmed === null,
    publicId,
    isConfirmed,
    confirmUserEmail,
  };
}
