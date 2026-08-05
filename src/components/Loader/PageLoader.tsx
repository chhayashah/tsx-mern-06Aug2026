export function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className="flex min-h-[60vh] w-full items-center justify-center"
    >
      <div className="flex items-center gap-3 font-[family-name:var(--font-data)] text-sm tracking-widest text-[var(--ink-muted)]">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--color-signal-400)]" />
        LOADING TRANSMISSION…
      </div>
    </div>
  );
}
