interface PaginationProps {
  page: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  /** Optional prefetch trigger, fired when the user hovers/focuses Next. */
  onHoverNext?: () => void;
}

export function Pagination({ page, totalPages, onPrevious, onNext, onHoverNext }: PaginationProps) {
  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <nav
      aria-label="Character list pagination"
      className="mt-8 flex items-center justify-center gap-4 font-[family-name:var(--font-data)] text-sm"
    >
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstPage}
        className="rounded-[var(--radius-panel)] border border-[var(--border-hairline)] px-4 py-2 font-medium text-[var(--ink-primary)] transition-colors hover:border-[var(--color-signal-400)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--border-hairline)]"
      >
        ← Previous
      </button>

      <span aria-live="polite" className="text-[var(--ink-muted)]">
        Page {page} / {totalPages}
      </span>

      <button
        type="button"
        onClick={onNext}
        onMouseEnter={onHoverNext}
        onFocus={onHoverNext}
        disabled={isLastPage}
        className="rounded-[var(--radius-panel)] border border-[var(--border-hairline)] px-4 py-2 font-medium text-[var(--ink-primary)] transition-colors hover:border-[var(--color-signal-400)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--border-hairline)]"
      >
        Next →
      </button>
    </nav>
  );
}
