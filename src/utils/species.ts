/**
 * Maps a species name to one of the CSS color tokens defined in index.css.
 * The assignment's four named species get fixed, intentional colors;
 * anything else (including "unknown", SWAPI's default when a person has no
 * species entry) still gets a *consistent* color via a small hash — so the
 * palette is extensible without a code change every time SWAPI adds a race.
 */
const NAMED_SPECIES_COLORS: Record<string, string> = {
  human: 'var(--color-species-human)',
  droid: 'var(--color-species-droid)',
  wookiee: 'var(--color-species-wookiee)',
  rodian: 'var(--color-species-rodian)',
};

const FALLBACK_HUES = [
  'var(--color-species-unknown)',
  'var(--color-comm-400)',
  'var(--color-signal-400)',
  'var(--color-success-400)',
  'var(--color-danger-400)',
] as const;

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getSpeciesColor(speciesName: string | undefined | null): string {
  const key = (speciesName ?? 'unknown').trim().toLowerCase();
  if (key === 'unknown' || key === '') return 'var(--color-species-unknown)';
  if (key in NAMED_SPECIES_COLORS) return NAMED_SPECIES_COLORS[key];
  return FALLBACK_HUES[hashString(key) % FALLBACK_HUES.length];
}

export function formatSpeciesLabel(speciesName: string | undefined | null): string {
  if (!speciesName || speciesName.trim() === '') return 'Unknown';
  return speciesName;
}
