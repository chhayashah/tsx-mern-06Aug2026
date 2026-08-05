import { useMemo } from 'react';
import { useGetAllSpeciesQuery } from '@/api/swapiApi';

export interface SpeciesLookup {
  /** SWAPI species resource URL -> human-readable species name. */
  nameByUrl: Map<string, string>;
  isLoading: boolean;
}

export function useSpeciesLookup(): SpeciesLookup {
  const { data, isLoading } = useGetAllSpeciesQuery();

  const nameByUrl = useMemo(() => {
    const map = new Map<string, string>();
    for (const species of data ?? []) {
      map.set(species.url, species.name);
    }
    return map;
  }, [data]);

  return { nameByUrl, isLoading };
}

/** A person with no `species` entries is, per SWAPI convention, Human. */
export function resolvePersonSpeciesName(
  speciesUrls: string[],
  nameByUrl: Map<string, string>,
): string {
  if (speciesUrls.length === 0) return 'Human';
  return nameByUrl.get(speciesUrls[0]) ?? 'Unknown';
}
