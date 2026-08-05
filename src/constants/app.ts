export const STORAGE_KEYS = {
  theme: 'archive-terminal:theme',
  favorites: 'archive-terminal:favorites',
  auth: 'archive-terminal:auth',
} as const;

export const ROUTES = {
  home: '/',
  login: '/login',
} as const;

/** picsum.photos deterministically returns the same image for a given seed. */
export const AVATAR_BASE_URL = 'https://picsum.photos/seed';
export const AVATAR_SIZE = 400;

export const SEARCH_DEBOUNCE_MS = 350;

export const MOCK_CREDENTIALS = {
  username: 'rebel',
  password: 'alliance',
} as const;

/** Access tokens expire quickly on purpose, to exercise the silent-refresh flow. */
export const AUTH_TOKEN_TTL_MS = 60_000;
export const AUTH_REFRESH_MARGIN_MS = 10_000;
