import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import LoginPage from '@/pages/Login/LoginPage';
import { createTestStore } from '@/tests/testUtils';
import { MOCK_CREDENTIALS } from '@/constants/app';

function renderLoginPage() {
  const store = createTestStore();
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>
    </Provider>,
  );
  return { store };
}

describe('LoginPage', () => {
  it('shows an error for invalid credentials', async () => {
    const user = userEvent.setup();
    const { store } = renderLoginPage();

    await user.type(screen.getByLabelText(/username/i), 'wrong');
    await user.type(screen.getByLabelText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/invalid credentials/i);
    expect(store.getState().auth.session).toBeNull();
  });

  it('creates a session for the documented mock credentials', async () => {
    const user = userEvent.setup();
    const { store } = renderLoginPage();

    await user.type(screen.getByLabelText(/username/i), MOCK_CREDENTIALS.username);
    await user.type(screen.getByLabelText(/password/i), MOCK_CREDENTIALS.password);
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(store.getState().auth.session?.username).toBe(MOCK_CREDENTIALS.username);
  });
});
