import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loggedIn, loggedOut } from '@/features/auth/authSlice';
import { createMockToken } from '@/utils/mockJwt';
import { AUTH_TOKEN_TTL_MS, MOCK_CREDENTIALS } from '@/constants/app';

export type LoginResult = { success: true } | { success: false; error: string };

export function useAuth() {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.auth.session);

  const login = useCallback(
    (username: string, password: string): LoginResult => {
      const normalizedUsername = username.trim();
      const normalizedPassword = password.trim();
      if (
        normalizedUsername !== MOCK_CREDENTIALS.username ||
        normalizedPassword !== MOCK_CREDENTIALS.password
      ) {
        return {
          success: false,
          error: 'Invalid credentials. This is a mock login — see the hint below.',
        };
      }
      const access = createMockToken(normalizedUsername, AUTH_TOKEN_TTL_MS);
      // The refresh token is just a longer-lived mock token; a real backend
      // would issue an opaque, separately-revocable one.
      const refresh = createMockToken(normalizedUsername, AUTH_TOKEN_TTL_MS * 60);
      dispatch(
        loggedIn({
          username: normalizedUsername,
          accessToken: access.token,
          refreshToken: refresh.token,
          accessTokenExpiresAt: access.expiresAt,
        }),
      );
      return { success: true };
    },
    [dispatch],
  );

  const logout = useCallback(() => {
    dispatch(loggedOut());
  }, [dispatch]);

  return { session, isAuthenticated: session !== null, login, logout };
}
