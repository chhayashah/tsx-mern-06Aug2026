import { useId, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES, MOCK_CREDENTIALS } from '@/constants/app';

interface LocationState {
  from?: { pathname: string };
}

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const usernameId = useId();
  const passwordId = useId();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? ROUTES.home;
    return <Navigate to={redirectTo} replace />;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Read directly off the submitted form rather than the controlled
    // `username`/`password` state: some browser/extension autofill
    // implementations set the input's DOM value without dispatching the
    // native `input` event React listens for, which would otherwise leave
    // the state stale (input looks filled, state is still '').
    const formData = new FormData(event.currentTarget);
    const rawUsername = formData.get('username');
    const rawPassword = formData.get('password');
    const submittedUsername = (typeof rawUsername === 'string' ? rawUsername : '').trim();
    const submittedPassword = (typeof rawPassword === 'string' ? rawPassword : '').trim();

    const result = login(submittedUsername, submittedPassword);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setError(null);
    void navigate(ROUTES.home, { replace: true });
  }

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center">
      <div className="rounded-[var(--radius-panel)] border border-[var(--border-hairline)] bg-[var(--bg-surface)] p-8">
        <h1 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-wide">
          Archive Access
        </h1>
        <p className="mt-1 text-sm text-[var(--ink-muted)]">
          Sign in to browse the character roster.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
          <div className="space-y-1">
            <label htmlFor={usernameId} className="text-xs font-medium text-[var(--ink-muted)]">
              Username
            </label>
            <input
              id={usernameId}
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-[var(--radius-panel)] border border-[var(--border-hairline)] bg-[var(--bg-void)] px-3 py-2 text-sm text-[var(--ink-primary)] focus:border-[var(--color-signal-400)]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor={passwordId} className="text-xs font-medium text-[var(--ink-muted)]">
              Password
            </label>
            <input
              id={passwordId}
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-[var(--radius-panel)] border border-[var(--border-hairline)] bg-[var(--bg-void)] px-3 py-2 text-sm text-[var(--ink-primary)] focus:border-[var(--color-signal-400)]"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-[var(--color-danger-400)]">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-[var(--radius-panel)] bg-[var(--color-signal-400)] px-4 py-2 text-sm font-semibold text-[var(--bg-void)] transition-opacity hover:opacity-90"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-[var(--ink-faint)]">
          Mock credentials — username <code>{MOCK_CREDENTIALS.username}</code>, password{' '}
          <code>{MOCK_CREDENTIALS.password}</code>. No backend is involved.
        </p>
      </div>
    </section>
  );
}
