import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { createTestStore } from '@/tests/testUtils';
import { loggedIn } from '@/features/auth/authSlice';

function renderProtected(store: ReturnType<typeof createTestStore>) {
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div>Secret roster</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login screen</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
}

describe('ProtectedRoute', () => {
  it('redirects to /login when there is no session', () => {
    renderProtected(createTestStore());
    expect(screen.getByText('Login screen')).toBeInTheDocument();
    expect(screen.queryByText('Secret roster')).not.toBeInTheDocument();
  });

  it('renders the protected content when a session exists', () => {
    const store = createTestStore();
    store.dispatch(
      loggedIn({
        username: 'rebel',
        accessToken: 'a.b.c',
        refreshToken: 'd.e.f',
        accessTokenExpiresAt: Date.now() + 60_000,
      }),
    );
    renderProtected(store);
    expect(screen.getByText('Secret roster')).toBeInTheDocument();
  });
});
