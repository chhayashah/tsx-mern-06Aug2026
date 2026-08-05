import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/Navbar/Navbar';
import { useSilentTokenRefresh } from '@/hooks/useSilentTokenRefresh';

/**
 * Root layout. Route pages render into <Outlet />; anything that must
 * persist across navigations (nav bar, theme, silent token refresh) lives
 * here instead.
 */
function App() {
  useSilentTokenRefresh();

  return (
    <div className="min-h-screen bg-[var(--bg-void)] text-[var(--ink-primary)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius-panel)] focus:bg-[var(--color-signal-400)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--bg-void)]"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
