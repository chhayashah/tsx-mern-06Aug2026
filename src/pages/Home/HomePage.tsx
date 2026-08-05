import { useCallback, useMemo, useState } from 'react';
import { useGetAllPeopleQuery, useGetPeoplePageQuery, usePrefetch } from '@/api/swapiApi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useSpeciesLookup, resolvePersonSpeciesName } from '@/hooks/useSpeciesLookup';
import { CharacterGrid } from '@/components/CharacterGrid/CharacterGrid';
import { CharacterModal } from '@/components/CharacterModal/CharacterModal';
import { CardSkeletonGrid } from '@/components/Skeleton/CardSkeleton';
import { ErrorState } from '@/components/ErrorState/ErrorState';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { Pagination } from '@/components/Pagination/Pagination';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { FilterPanel } from '@/components/FilterPanel/FilterPanel';
import { SWAPI_PAGE_SIZE } from '@/constants/api';
import { filtersCleared, isAnyFilterActive } from '@/features/filters/filtersSlice';
import { filterPeople, sortPeople } from '@/utils/peopleQuery';
import type { SwapiPerson } from '@/types/swapi';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [selectedPerson, setSelectedPerson] = useState<SwapiPerson | null>(null);

  const filters = useAppSelector((state) => state.filters);
  const filtersActive = useAppSelector((state) => isAnyFilterActive(state.filters));
  const favoriteIds = useAppSelector((state) => state.favorites.ids);
  const { nameByUrl } = useSpeciesLookup();
  const prefetchPeoplePage = usePrefetch('getPeoplePage');
  const prefetchPlanet = usePrefetch('getPlanetByUrl');

  // Any search/filter/sort requires working against the full roster, since
  // SWAPI's own pagination has no way to express those queries server-side.
  const paginatedQuery = useGetPeoplePageQuery({ page }, { skip: filtersActive });
  const fullRosterQuery = useGetAllPeopleQuery(undefined, { skip: !filtersActive });
  const activeQuery = filtersActive ? fullRosterQuery : paginatedQuery;

  // Any change to search/filters/sort invalidates the current page number.
  // Reset is done during render (React's "adjusting state" pattern) rather
  // than in an effect, which avoids an extra render pass.
  const filtersKey = `${filters.search}|${filters.speciesUrl}|${filters.homeworldUrl}|${filters.filmUrl}|${filters.sort}|${filters.favoritesOnly}`;
  const [previousFiltersKey, setPreviousFiltersKey] = useState(filtersKey);
  if (filtersKey !== previousFiltersKey) {
    setPreviousFiltersKey(filtersKey);
    setPage(1);
  }

  const handleOpen = useCallback((person: SwapiPerson) => {
    setSelectedPerson(person);
  }, []);

  const handleCloseModal = useCallback(() => setSelectedPerson(null), []);

  // Computed unconditionally (rather than after an early return) so hook
  // order stays stable and the results are memoized against their real
  // dependencies instead of recomputed on every render.
  const { visiblePeople, totalCount } = useMemo(() => {
    if (filtersActive) {
      const roster = fullRosterQuery.data ?? [];
      const filtered = sortPeople(
        filterPeople(roster, filters, filters.favoritesOnly ? favoriteIds : undefined),
        filters.sort,
      );
      return {
        visiblePeople: filtered.slice((page - 1) * SWAPI_PAGE_SIZE, page * SWAPI_PAGE_SIZE),
        totalCount: filtered.length,
      };
    }
    return {
      visiblePeople: paginatedQuery.data?.results ?? [],
      totalCount: paginatedQuery.data?.count ?? 0,
    };
  }, [filtersActive, fullRosterQuery.data, filters, favoriteIds, page, paginatedQuery.data]);

  const totalPages = Math.max(1, Math.ceil(totalCount / SWAPI_PAGE_SIZE));

  const speciesNameByPersonUrl = useMemo(() => {
    const map = new Map<string, string>();
    for (const person of visiblePeople) {
      map.set(person.url, resolvePersonSpeciesName(person.species, nameByUrl));
    }
    return map;
  }, [visiblePeople, nameByUrl]);

  const selectedPersonSpeciesName = selectedPerson
    ? resolvePersonSpeciesName(selectedPerson.species, nameByUrl)
    : 'Human';

  return (
    <section aria-busy={activeQuery.isFetching}>
      <header className="mb-6 space-y-4">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-wide">
            Character Roster
          </h1>
          {!activeQuery.isLoading && !activeQuery.isError && (
            <p className="text-sm text-[var(--ink-muted)]">
              {totalCount} individual{totalCount === 1 ? '' : 's'} on record
              {filtersActive ? ' matching current query' : ''}.
            </p>
          )}
        </div>
        <Toolbar />
      </header>

      {activeQuery.isError ? (
        <ErrorState onRetry={() => void activeQuery.refetch()} />
      ) : activeQuery.isLoading ? (
        <CardSkeletonGrid />
      ) : visiblePeople.length === 0 ? (
        <EmptyState onClear={filtersActive ? () => dispatch(filtersCleared()) : undefined} />
      ) : (
        <>
          <CharacterGrid
            people={visiblePeople}
            speciesNameByPersonUrl={speciesNameByPersonUrl}
            onOpen={handleOpen}
            onHoverCharacter={(person) => prefetchPlanet(person.homeworld)}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrevious={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            onHoverNext={
              !filtersActive && page < totalPages
                ? () => prefetchPeoplePage({ page: page + 1 })
                : undefined
            }
          />
        </>
      )}

      <CharacterModal
        person={selectedPerson}
        speciesName={selectedPersonSpeciesName}
        onClose={handleCloseModal}
      />
    </section>
  );
}

function Toolbar() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <SearchBar />
      <FilterPanel />
    </div>
  );
}
