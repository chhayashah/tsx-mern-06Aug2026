import type { SwapiPerson } from '@/types/swapi';
import type { FiltersState, SortOption } from '@/features/filters/filtersSlice';
import { extractIdFromUrl } from '@/utils/resource';

function parseNumericField(value: string): number {
  const cleaned = value.replace(/,/g, '');
  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
}

export function filterPeople(
  people: SwapiPerson[],
  filters: Pick<FiltersState, 'search' | 'speciesUrl' | 'homeworldUrl' | 'filmUrl'>,
  favoriteIds?: ReadonlySet<string> | string[],
): SwapiPerson[] {
  const search = filters.search.trim().toLowerCase();
  const favorites = favoriteIds ? new Set(favoriteIds) : null;

  return people.filter((person) => {
    if (search && !person.name.toLowerCase().includes(search)) return false;
    if (filters.speciesUrl && !person.species.includes(filters.speciesUrl)) return false;
    if (filters.homeworldUrl && person.homeworld !== filters.homeworldUrl) return false;
    if (filters.filmUrl && !person.films.includes(filters.filmUrl)) return false;
    if (favorites && !favorites.has(extractIdFromUrl(person.url))) return false;
    return true;
  });
}

export function sortPeople(people: SwapiPerson[], sort: SortOption): SwapiPerson[] {
  if (sort === 'none') return people;

  const sorted = [...people];
  switch (sort) {
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'height-asc':
      sorted.sort((a, b) => parseNumericField(a.height) - parseNumericField(b.height));
      break;
    case 'mass-asc':
      sorted.sort((a, b) => parseNumericField(a.mass) - parseNumericField(b.mass));
      break;
  }
  return sorted;
}
