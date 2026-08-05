import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useGetAllFilmsQuery, useGetAllPlanetsQuery, useGetAllSpeciesQuery } from '@/api/swapiApi';
import {
  favoritesOnlyToggled,
  filmFilterChanged,
  filtersCleared,
  homeworldFilterChanged,
  isAnyFilterActive,
  sortChanged,
  speciesFilterChanged,
  type SortOption,
} from '@/features/filters/filtersSlice';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'none', label: 'Default order' },
  { value: 'name-asc', label: 'Name A → Z' },
  { value: 'name-desc', label: 'Name Z → A' },
  { value: 'height-asc', label: 'Height (shortest first)' },
  { value: 'mass-asc', label: 'Mass (lightest first)' },
];

function toNullable(value: string): string | null {
  return value === '' ? null : value;
}

export function FilterPanel() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.filters);
  const hasActiveFilters = useAppSelector((state) => isAnyFilterActive(state.filters));

  const { data: species } = useGetAllSpeciesQuery();
  const { data: planets } = useGetAllPlanetsQuery();
  const { data: films } = useGetAllFilmsQuery();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex flex-col gap-1 text-xs text-[var(--ink-muted)]">
        Species
        <select
          value={filters.speciesUrl ?? ''}
          onChange={(event) => dispatch(speciesFilterChanged(toNullable(event.target.value)))}
          className="rounded-[var(--radius-panel)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-1.5 text-sm text-[var(--ink-primary)] focus:border-[var(--color-signal-400)]"
        >
          <option value="">All species</option>
          {species?.map((s) => (
            <option key={s.url} value={s.url}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs text-[var(--ink-muted)]">
        Homeworld
        <select
          value={filters.homeworldUrl ?? ''}
          onChange={(event) => dispatch(homeworldFilterChanged(toNullable(event.target.value)))}
          className="rounded-[var(--radius-panel)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-1.5 text-sm text-[var(--ink-primary)] focus:border-[var(--color-signal-400)]"
        >
          <option value="">All homeworlds</option>
          {planets?.map((p) => (
            <option key={p.url} value={p.url}>
              {p.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs text-[var(--ink-muted)]">
        Film
        <select
          value={filters.filmUrl ?? ''}
          onChange={(event) => dispatch(filmFilterChanged(toNullable(event.target.value)))}
          className="rounded-[var(--radius-panel)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-1.5 text-sm text-[var(--ink-primary)] focus:border-[var(--color-signal-400)]"
        >
          <option value="">All films</option>
          {films?.map((f) => (
            <option key={f.url} value={f.url}>
              {f.title}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs text-[var(--ink-muted)]">
        Sort
        <select
          value={filters.sort}
          onChange={(event) => dispatch(sortChanged(event.target.value as SortOption))}
          className="rounded-[var(--radius-panel)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] px-3 py-1.5 text-sm text-[var(--ink-primary)] focus:border-[var(--color-signal-400)]"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={() => dispatch(favoritesOnlyToggled())}
        aria-pressed={filters.favoritesOnly}
        className="self-end rounded-[var(--radius-panel)] border px-3 py-1.5 text-xs font-medium transition-colors"
        style={
          filters.favoritesOnly
            ? { borderColor: 'var(--color-signal-400)', color: 'var(--color-signal-400)' }
            : { borderColor: 'var(--border-hairline)', color: 'var(--ink-muted)' }
        }
      >
        {filters.favoritesOnly ? '★ Favorites only' : '☆ Favorites only'}
      </button>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => dispatch(filtersCleared())}
          className="self-end rounded-[var(--radius-panel)] border border-[var(--border-hairline)] px-3 py-1.5 text-xs font-medium text-[var(--ink-muted)] transition-colors hover:border-[var(--color-signal-400)] hover:text-[var(--ink-primary)]"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
