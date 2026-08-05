import { describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CharacterModal } from '@/components/CharacterModal/CharacterModal';
import { renderWithProviders } from '@/tests/testUtils';
import type { SwapiPerson } from '@/types/swapi';
import type * as SwapiApiModule from '@/api/swapiApi';

vi.mock('@/api/swapiApi', async (importOriginal) => {
  const actual = await importOriginal<typeof SwapiApiModule>();
  return {
    ...actual,
    useGetPlanetByUrlQuery: () => ({
      data: {
        name: 'Tatooine',
        terrain: 'desert',
        climate: 'arid',
        residents: ['a', 'b', 'c'],
        population: '200000',
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    }),
  };
});

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
  films: ['https://swapi.dev/api/films/1/', 'https://swapi.dev/api/films/2/'],
  species: [],
  vehicles: [],
  starships: [],
  created: '2014-12-09T13:50:51.644000Z',
  edited: '2014-12-20T21:17:56.891000Z',
  url: 'https://swapi.dev/api/people/1/',
};

describe('CharacterModal', () => {
  it('renders nothing when person is null', () => {
    renderWithProviders(<CharacterModal person={null} speciesName="Human" onClose={vi.fn()} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens and displays the correct character details', () => {
    renderWithProviders(<CharacterModal person={luke} speciesName="Human" onClose={vi.fn()} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Luke Skywalker' })).toBeInTheDocument();
    expect(screen.getByText('1.72 m')).toBeInTheDocument(); // height cm -> m
    expect(screen.getByText('77 kg')).toBeInTheDocument();
    expect(screen.getByText('19BBY')).toBeInTheDocument();
    expect(screen.getByText('09-12-2014')).toBeInTheDocument(); // created, dd-MM-yyyy
    expect(screen.getByText('2')).toBeInTheDocument(); // films count
    expect(screen.getByText('Tatooine')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<CharacterModal person={luke} speciesName="Human" onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: /close character details/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<CharacterModal person={luke} speciesName="Human" onClose={onClose} />);

    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });
});
