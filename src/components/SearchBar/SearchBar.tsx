import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { searchChanged } from '@/features/filters/filtersSlice';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { SEARCH_DEBOUNCE_MS } from '@/constants/app';

export function SearchBar() {
  const dispatch = useAppDispatch();
  const currentSearch = useAppSelector((state) => state.filters.search);
  const [inputValue, setInputValue] = useState(currentSearch);
  const debouncedValue = useDebouncedValue(inputValue, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    dispatch(searchChanged(debouncedValue));
  }, [debouncedValue, dispatch]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <label htmlFor="character-search" className="sr-only">
        Search characters by name
      </label>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-faint)]"
      >
        ⌕
      </span>
      <input
        id="character-search"
        type="search"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="Search by name…"
        className="w-full rounded-[var(--radius-panel)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] py-2 pl-9 pr-3 text-sm text-[var(--ink-primary)] placeholder:text-[var(--ink-faint)] focus:border-[var(--color-signal-400)]"
      />
    </div>
  );
}
