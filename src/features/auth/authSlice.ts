import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/constants/app';
import { isTokenExpired } from '@/utils/mockJwt';

export interface AuthSession {
  username: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
}

interface AuthState {
  session: AuthSession | null;
}

function readPersistedSession(): AuthSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.auth);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    // A refresh token is long-lived in this mock; only drop the session if
    // the shape itself is invalid, not because the access token expired
    // (that's what silent refresh is for).
    if (!parsed.refreshToken || !parsed.username) return null;
    return parsed;
  } catch {
    return null;
  }
}

function persist(session: AuthSession | null): void {
  if (session) {
    window.localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(session));
  } else {
    window.localStorage.removeItem(STORAGE_KEYS.auth);
  }
}

const initialState: AuthState = {
  session: readPersistedSession(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loggedIn(state, action: PayloadAction<AuthSession>) {
      state.session = action.payload;
      persist(state.session);
    },
    accessTokenRefreshed(
      state,
      action: PayloadAction<{ accessToken: string; accessTokenExpiresAt: number }>,
    ) {
      if (!state.session) return;
      state.session.accessToken = action.payload.accessToken;
      state.session.accessTokenExpiresAt = action.payload.accessTokenExpiresAt;
      persist(state.session);
    },
    loggedOut(state) {
      state.session = null;
      persist(null);
    },
  },
});

export const { loggedIn, accessTokenRefreshed, loggedOut } = authSlice.actions;
export default authSlice.reducer;

/** A session exists and its access token hasn't expired (or can still be refreshed). */
export function selectIsAuthenticated(state: AuthState): boolean {
  return state.session !== null;
}

export function selectAccessTokenIsExpired(state: AuthState): boolean {
  return !state.session || isTokenExpired(state.session.accessTokenExpiresAt);
}
