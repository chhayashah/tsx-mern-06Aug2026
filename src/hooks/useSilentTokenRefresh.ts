import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { accessTokenRefreshed } from '@/features/auth/authSlice';
import { createMockToken } from '@/utils/mockJwt';
import { AUTH_REFRESH_MARGIN_MS, AUTH_TOKEN_TTL_MS } from '@/constants/app';

/**
 * Mounted once near the app root. While a session exists, schedules the next
 * access-token refresh for `AUTH_REFRESH_MARGIN_MS` before it expires —
 * simulating a real silent-refresh flow without a backend to call.
 */
export function useSilentTokenRefresh() {
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.auth.session);

  useEffect(() => {
    if (!session) return;

    const msUntilRefresh = Math.max(
      0,
      session.accessTokenExpiresAt - Date.now() - AUTH_REFRESH_MARGIN_MS,
    );

    const timeoutId = window.setTimeout(() => {
      const refreshed = createMockToken(session.username, AUTH_TOKEN_TTL_MS);
      dispatch(
        accessTokenRefreshed({
          accessToken: refreshed.token,
          accessTokenExpiresAt: refreshed.expiresAt,
        }),
      );
    }, msUntilRefresh);

    return () => window.clearTimeout(timeoutId);
  }, [session, dispatch]);
}
