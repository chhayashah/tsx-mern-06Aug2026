import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/constants/app';

export type ThemeMode = 'dark' | 'light';

interface ThemeState {
  mode: ThemeMode;
}

function readPersistedTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(STORAGE_KEYS.theme);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function persistTheme(mode: ThemeMode): void {
  window.localStorage.setItem(STORAGE_KEYS.theme, mode);
  document.documentElement.setAttribute('data-theme', mode);
}

const initialState: ThemeState = {
  mode: readPersistedTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    themeToggled(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      persistTheme(state.mode);
    },
    themeSet(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      persistTheme(state.mode);
    },
  },
});

export const { themeToggled, themeSet } = themeSlice.actions;
export default themeSlice.reducer;
