import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CharacterCard } from '@/components/CharacterCard/CharacterCard';
import { renderWithProviders } from '@/tests/testUtils';
import type { SwapiPerson } from '@/types/swapi';

const luke: SwapiPerson = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
  homeworld: 'https://swapi.dev/api/planets/1/',
  films: ['https://swapi.dev/api/films/1/'],
  species: [],
  vehicles: [],
  starships: [],
  created: '2014-12-09T13:50:51.644000Z',
  edited: '2014-12-20T21:17:56.891000Z',
  url: 'https://swapi.dev/api/people/1/',
};

describe('CharacterCard', () => {
  it('renders the character name and species badge', () => {
    renderWithProviders(<CharacterCard person={luke} speciesName="Human" onOpen={vi.fn()} />);
    expect(screen.getByRole('heading', { name: 'Luke Skywalker' })).toBeInTheDocument();
    expect(screen.getByText('Human')).toBeInTheDocument();
  });

  it('calls onOpen with the character when the card is clicked', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    renderWithProviders(<CharacterCard person={luke} speciesName="Human" onOpen={onOpen} />);

    await user.click(screen.getByRole('button', { name: /view details for luke skywalker/i }));
    expect(onOpen).toHaveBeenCalledWith(luke);
  });

  it('toggles favorite state without triggering onOpen', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    renderWithProviders(<CharacterCard person={luke} speciesName="Human" onOpen={onOpen} />);

    const favoriteButton = screen.getByRole('button', { name: /add luke skywalker to favorites/i });
    await user.click(favoriteButton);

    expect(onOpen).not.toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: /remove luke skywalker from favorites/i }),
    ).toHaveAttribute('aria-pressed', 'true');
  });
});
