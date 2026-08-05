import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type SortOption = 'name-asc' | 'name-desc' | 'height-asc' | 'mass-asc' | 'none';

export interface FiltersState {
  search: string;
  speciesUrl: string | null;
  homeworldUrl: string | null;
  filmUrl: string | null;
  sort: SortOption;
  favoritesOnly: boolean;
}

const initialState: FiltersState = {
  search: '',
  speciesUrl: null,
  homeworldUrl: null,
  filmUrl: null,
  sort: 'none',
  favoritesOnly: false,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    searchChanged(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    speciesFilterChanged(state, action: PayloadAction<string | null>) {
      state.speciesUrl = action.payload;
    },
    homeworldFilterChanged(state, action: PayloadAction<string | null>) {
      state.homeworldUrl = action.payload;
    },
    filmFilterChanged(state, action: PayloadAction<string | null>) {
      state.filmUrl = action.payload;
    },
    sortChanged(state, action: PayloadAction<SortOption>) {
      state.sort = action.payload;
    },
    favoritesOnlyToggled(state) {
      state.favoritesOnly = !state.favoritesOnly;
    },
    filtersCleared() {
      return initialState;
    },
  },
});

export const {
  searchChanged,
  speciesFilterChanged,
  homeworldFilterChanged,
  filmFilterChanged,
  sortChanged,
  favoritesOnlyToggled,
  filtersCleared,
} = filtersSlice.actions;

export default filtersSlice.reducer;

/** True when any search/filter/sort is active — decides paginated vs. full-roster fetch. */
export function isAnyFilterActive(state: FiltersState): boolean {
  return (
    state.search.trim() !== '' ||
    state.speciesUrl !== null ||
    state.homeworldUrl !== null ||
    state.filmUrl !== null ||
    state.sort !== 'none' ||
    state.favoritesOnly
  );
}
