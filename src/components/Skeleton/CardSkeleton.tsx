export function CardSkeleton() {
  return (
    <div
      className="animate-pulse overflow-hidden rounded-[var(--radius-panel)] border border-[var(--border-hairline)] bg-[var(--bg-surface)]"
      aria-hidden="true"
    >
      <div className="aspect-square w-full bg-[var(--bg-raised)]" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 rounded bg-[var(--bg-raised)]" />
        <div className="h-5 w-1/2 rounded-full bg-[var(--bg-raised)]" />
      </div>
    </div>
  );
}

export function CardSkeletonGrid({ count = 10 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading characters"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
