import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '@/constants/app';

interface FavoritesState {
  ids: string[];
}

function readPersistedFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.favorites);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function persist(ids: string[]): void {
  window.localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(ids));
}

const initialState: FavoritesState = {
  ids: readPersistedFavorites(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    favoriteToggled(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.ids = state.ids.includes(id) ? state.ids.filter((i) => i !== id) : [...state.ids, id];
      persist(state.ids);
    },
  },
});

export const { favoriteToggled } = favoritesSlice.actions;
export default favoritesSlice.reducer;
