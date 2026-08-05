interface EmptyStateProps {
  message?: string;
  onClear?: () => void;
}

export function EmptyState({
  message = 'No individuals in the archive match those parameters.',
  onClear,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-[var(--radius-panel)] border border-dashed border-[var(--border-hairline)] p-10 text-center">
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        aria-hidden="true"
        className="text-[var(--ink-faint)]"
      >
        <rect
          x="10"
          y="14"
          width="36"
          height="28"
          rx="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M10 22h36" stroke="currentColor" strokeWidth="2" />
        <path
          d="M20 30l6 6 10-12"
          stroke="var(--color-signal-400)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
      </svg>
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
          No records found
        </h2>
        <p className="mt-1 max-w-sm text-sm text-[var(--ink-muted)]">{message}</p>
      </div>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="rounded-[var(--radius-panel)] border border-[var(--border-hairline)] px-4 py-2 text-sm font-medium text-[var(--ink-muted)] transition-colors hover:border-[var(--color-signal-400)] hover:text-[var(--ink-primary)]"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
