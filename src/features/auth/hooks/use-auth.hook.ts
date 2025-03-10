import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';

import { useBoundStore } from '#/core/hooks/use-store.hook';
import { transformToUser } from '#/user/helpers/user-transform.helper';
import { getCurrentUser, loginUser, logoutUser } from '../api/auth.api';

import type { User } from '#/user/models/user.model';
import type { AuthCredentials } from '../models/auth.model';

const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY;

type Result = {
  login: (credentials: AuthCredentials) => Promise<User>;
  logout: () => Promise<void>;
  getUser: () => void;
};

export function useAuth(): Result {
  const setUser = useBoundStore((state) => state.setUser);
  const user = useBoundStore((state) => state.user);

  const { refetch: fetchUser } = useQuery(
    getCurrentUser({
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled: false,
      retry: false,
      retryOnMount: false,
      initialData: user,
      select: (data: unknown) => transformToUser(data),
    }),
  );

  const { mutateAsync: mutateLoginUser } = useMutation(loginUser());
  const { mutateAsync: mutateLogoutUser } = useMutation(logoutUser());

  const logout = useCallback(async () => {
    try {
      const result = await mutateLogoutUser();
      if (!result) {
        throw new Error('Logout failed');
      }
      // Clear access and refresh tokens to localStorage
      localStorage.removeItem(AUTH_TOKEN_KEY);
      // Clear current user
      setUser();
    } catch (error: any) {
      throw new Error(error.message);
    }
  }, [setUser, mutateLogoutUser]);

  // Fetch data from api and set current user, if error or user does not exist
  // then logout current session
  const getUser = useCallback(async () => {
    const { data } = await fetchUser();

    // if (!data) {
    //   logout();
    // }

    setUser((data as User) ?? undefined);
    return data;
  }, [fetchUser, setUser]);

  const login = useCallback(
    async (credentials: AuthCredentials) => {
      try {
        const authToken = await mutateLoginUser(credentials);
        // Store access and refresh tokens to localStorage
        localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(authToken));
        // Get current user using access token from localStorage
        const currentUser = await getUser();

        if (!currentUser) {
          throw new Error('Email or password is incorrect');
        }

        return currentUser;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    [getUser, mutateLoginUser],
  );

  return {
    login,
    logout,
    getUser,
  };
}
