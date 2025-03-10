import { memo, useEffect } from 'react';

import { useAuth } from '../hooks/use-auth.hook';

export const AuthSessionSubscriber = memo(function () {
  const { getUser } = useAuth();

  useEffect(() => {
    getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
});
