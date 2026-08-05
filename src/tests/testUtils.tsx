import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { swapiApi } from '@/api/swapiApi';
import themeReducer from '@/features/theme/themeSlice';
import favoritesReducer from '@/features/favorites/favoritesSlice';
import filtersReducer from '@/features/filters/filtersSlice';
import authReducer from '@/features/auth/authSlice';

export function createTestStore() {
  return configureStore({
    reducer: {
      theme: themeReducer,
      favorites: favoritesReducer,
      filters: filtersReducer,
      auth: authReducer,
      [swapiApi.reducerPath]: swapiApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(swapiApi.middleware),
  });
}

export function renderWithProviders(ui: ReactElement) {
  const store = createTestStore();
  return { store, ...render(<Provider store={store}>{ui}</Provider>) };
}
