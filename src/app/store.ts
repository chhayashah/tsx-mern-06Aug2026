import { configureStore } from '@reduxjs/toolkit';
import { swapiApi } from '@/api/swapiApi';
import themeReducer from '@/features/theme/themeSlice';
import favoritesReducer from '@/features/favorites/favoritesSlice';
import filtersReducer from '@/features/filters/filtersSlice';
import authReducer from '@/features/auth/authSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    favorites: favoritesReducer,
    filters: filtersReducer,
    auth: authReducer,
    [swapiApi.reducerPath]: swapiApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(swapiApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
