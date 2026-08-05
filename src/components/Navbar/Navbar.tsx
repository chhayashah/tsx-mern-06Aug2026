import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { themeToggled } from '@/features/theme/themeSlice';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);
  const { session, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-hairline)] bg-[var(--bg-surface)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a
          href="/"
          className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold tracking-wide text-[var(--ink-primary)]"
        >
          <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
            <path
              d="M16 3 L28 9.5 V22.5 L16 29 L4 22.5 V9.5 Z"
              fill="none"
              stroke="var(--color-signal-400)"
              strokeWidth="1.6"
            />
            <circle cx="16" cy="16" r="3.4" fill="var(--color-signal-400)" />
          </svg>
          ARCHIVE TERMINAL
        </a>

        <div className="flex items-center gap-3">
          {session && (
            <span className="hidden font-[family-name:var(--font-data)] text-xs text-[var(--ink-muted)] sm:inline">
              {session.username}
            </span>
          )}

          <button
            type="button"
            onClick={() => dispatch(themeToggled())}
            aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-pressed={mode === 'light'}
            className="rounded-[var(--radius-panel)] border border-[var(--border-hairline)] px-3 py-1.5 text-xs font-medium tracking-wide text-[var(--ink-muted)] transition-colors hover:border-[var(--color-signal-400)] hover:text-[var(--ink-primary)]"
          >
            {mode === 'dark' ? '☾ DARK' : '☀ LIGHT'}
          </button>

          {session && (
            <button
              type="button"
              onClick={logout}
              className="rounded-[var(--radius-panel)] border border-[var(--border-hairline)] px-3 py-1.5 text-xs font-medium tracking-wide text-[var(--ink-muted)] transition-colors hover:border-[var(--color-danger-400)] hover:text-[var(--color-danger-400)]"
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
