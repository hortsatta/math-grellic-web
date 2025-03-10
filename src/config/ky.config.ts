import ky from 'ky';

import { refreshAuthTokens } from '#/auth/api/auth.api';

const prefixUrl = import.meta.env.VITE_API_BASE_URL;
const AUTH_TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_KEY;
// Global refresh promise
let refreshPromise: Promise<any> | null = null;

export const kyInstance = ky.extend({
  prefixUrl,
  hooks: {
    beforeRequest: [
      (options) => {
        // Get token from localstorage
        const token =
          JSON.parse(localStorage.getItem(AUTH_TOKEN_KEY) || '{}') || {};
        const { accessToken } = token;
        // If token is present then add authorization to header
        if (accessToken) {
          options.headers.set('Authorization', `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, _, response: any) => {
        if (response.status === 401) {
          const resClone = response.clone();
          const resJson = await resClone.json();

          if (
            resJson.error === 'token_expired' ||
            resJson === 'token_invalid'
          ) {
            const token =
              JSON.parse(localStorage.getItem(AUTH_TOKEN_KEY) || '{}') || {};
            const { refreshToken } = token;

            if (refreshToken) {
              try {
                // If a refresh is already in progress, wait for it
                if (!refreshPromise) {
                  refreshPromise = refreshAuthTokens(refreshToken);
                }
                // Wait for refresh and reset after completed
                const authToken = await refreshPromise;
                refreshPromise = null;
                // Store new tokens in local storage
                localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(authToken));
                // Retry the original request with the new access token
                return kyInstance(request);
              } catch (error: any) {
                // Remove expired/invalid tokens
                localStorage.removeItem(AUTH_TOKEN_KEY);
                refreshPromise = null;
              }
            }
          }
        }

        return response;
      },
    ],
  },
});

export function generateSearchParams(query: {
  [x: string]: string | null | undefined;
}) {
  const searchParams: string[][] = [];
  Object.keys(query).forEach((key) => {
    const value = query[key]?.trim();

    if (value) {
      searchParams.push([key, value]);
    }
  });

  return searchParams;
}
