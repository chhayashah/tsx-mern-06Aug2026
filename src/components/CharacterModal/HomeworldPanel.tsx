import { useGetPlanetByUrlQuery } from '@/api/swapiApi';
import { formatPopulation } from '@/utils/format';

interface HomeworldPanelProps {
  homeworldUrl: string;
}

export function HomeworldPanel({ homeworldUrl }: HomeworldPanelProps) {
  const { data: planet, isLoading, isError, refetch } = useGetPlanetByUrlQuery(homeworldUrl);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2" aria-label="Loading homeworld">
        <div className="h-4 w-1/3 rounded bg-[var(--bg-raised)]" />
        <div className="h-3 w-2/3 rounded bg-[var(--bg-raised)]" />
        <div className="h-3 w-1/2 rounded bg-[var(--bg-raised)]" />
      </div>
    );
  }

  if (isError || !planet) {
    return (
      <div className="flex items-center justify-between rounded-[var(--radius-panel)] border border-[var(--border-hairline)] p-3 text-sm text-[var(--ink-muted)]">
        <span>Homeworld record unavailable.</span>
        <button
          type="button"
          onClick={() => void refetch()}
          className="text-[var(--color-signal-400)] underline-offset-2 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
      <dt className="text-[var(--ink-muted)]">Planet</dt>
      <dd className="font-medium">{planet.name}</dd>

      <dt className="text-[var(--ink-muted)]">Terrain</dt>
      <dd className="capitalize">{planet.terrain}</dd>

      <dt className="text-[var(--ink-muted)]">Climate</dt>
      <dd className="capitalize">{planet.climate}</dd>

      <dt className="text-[var(--ink-muted)]">Residents</dt>
      <dd className="font-[family-name:var(--font-data)]">{planet.residents.length}</dd>

      <dt className="text-[var(--ink-muted)]">Population</dt>
      <dd className="font-[family-name:var(--font-data)]">{formatPopulation(planet.population)}</dd>
    </dl>
  );
}
