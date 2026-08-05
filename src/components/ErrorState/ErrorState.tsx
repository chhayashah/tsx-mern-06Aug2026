interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({
  message = 'The archive terminal lost its connection to the network.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-[var(--radius-panel)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-10 text-center"
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        aria-hidden="true"
        className="text-[var(--color-danger-400)]"
      >
        <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M24 14v14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="33" r="1.6" fill="currentColor" />
      </svg>
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold">
          Transmission interrupted
        </h2>
        <p className="mt-1 max-w-sm text-sm text-[var(--ink-muted)]">{message}</p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-[var(--radius-panel)] border border-[var(--color-signal-400)] px-4 py-2 text-sm font-medium text-[var(--color-signal-400)] transition-colors hover:bg-[var(--color-signal-400)] hover:text-[var(--bg-void)]"
      >
        Retry
      </button>
    </div>
  );
}
