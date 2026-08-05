import { describe, expect, it } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { renderWithProviders } from '@/tests/testUtils';

describe('SearchBar', () => {
  it('updates the input immediately but only dispatches after the debounce delay', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<SearchBar />);

    const input = screen.getByLabelText(/search characters by name/i);
    await user.type(input, 'yoda');

    expect(input).toHaveValue('yoda');
    // Redux state should not have caught up yet (debounce hasn't elapsed).
    expect(store.getState().filters.search).toBe('');

    await waitFor(() => expect(store.getState().filters.search).toBe('yoda'));
  });
});
