import { describe, expect, it } from 'vitest';
import { filterPeople, sortPeople } from '@/utils/peopleQuery';
import type { SwapiPerson } from '@/types/swapi';

function person(overrides: Partial<SwapiPerson>): SwapiPerson {
  return {
    name: 'Unnamed',
    height: '100',
    mass: '50',
    hair_color: 'none',
    skin_color: 'none',
    eye_color: 'none',
    birth_year: 'unknown',
    gender: 'n/a',
    homeworld: 'https://swapi.dev/api/planets/1/',
    films: [],
    species: [],
    vehicles: [],
    starships: [],
    created: '2014-12-09T13:50:51.644000Z',
    edited: '2014-12-09T13:50:51.644000Z',
    url: 'https://swapi.dev/api/people/1/',
    ...overrides,
  };
}

const luke = person({ name: 'Luke Skywalker', height: '172', mass: '77', url: '.../1/' });
const leia = person({
  name: 'Leia Organa',
  height: '150',
  mass: '49',
  url: '.../5/',
  homeworld: 'https://swapi.dev/api/planets/2/',
  species: ['https://swapi.dev/api/species/1/'],
  films: ['https://swapi.dev/api/films/1/'],
});
const chewbacca = person({
  name: 'Chewbacca',
  height: '228',
  mass: '112',
  url: '.../13/',
  species: ['https://swapi.dev/api/species/3/'],
});

const roster = [luke, leia, chewbacca];

describe('filterPeople', () => {
  it('matches names case-insensitively by partial search', () => {
    expect(
      filterPeople(roster, { search: 'leia', speciesUrl: null, homeworldUrl: null, filmUrl: null }),
    ).toEqual([leia]);
    expect(
      filterPeople(roster, { search: 'SKY', speciesUrl: null, homeworldUrl: null, filmUrl: null }),
    ).toEqual([luke]);
  });

  it('filters by species url', () => {
    expect(
      filterPeople(roster, {
        search: '',
        speciesUrl: 'https://swapi.dev/api/species/3/',
        homeworldUrl: null,
        filmUrl: null,
      }),
    ).toEqual([chewbacca]);
  });

  it('filters by homeworld url', () => {
    expect(
      filterPeople(roster, {
        search: '',
        speciesUrl: null,
        homeworldUrl: 'https://swapi.dev/api/planets/2/',
        filmUrl: null,
      }),
    ).toEqual([leia]);
  });

  it('filters by film url', () => {
    expect(
      filterPeople(roster, {
        search: '',
        speciesUrl: null,
        homeworldUrl: null,
        filmUrl: 'https://swapi.dev/api/films/1/',
      }),
    ).toEqual([leia]);
  });

  it('combines search and filters together (AND semantics)', () => {
    expect(
      filterPeople(roster, {
        search: 'leia',
        speciesUrl: 'https://swapi.dev/api/species/3/',
        homeworldUrl: null,
        filmUrl: null,
      }),
    ).toEqual([]);
  });
});

describe('sortPeople', () => {
  it('leaves order untouched for "none"', () => {
    expect(sortPeople(roster, 'none')).toEqual(roster);
  });

  it('sorts by name ascending and descending', () => {
    expect(sortPeople(roster, 'name-asc').map((p) => p.name)).toEqual([
      'Chewbacca',
      'Leia Organa',
      'Luke Skywalker',
    ]);
    expect(sortPeople(roster, 'name-desc').map((p) => p.name)).toEqual([
      'Luke Skywalker',
      'Leia Organa',
      'Chewbacca',
    ]);
  });

  it('sorts by height ascending', () => {
    expect(sortPeople(roster, 'height-asc').map((p) => p.name)).toEqual([
      'Leia Organa',
      'Luke Skywalker',
      'Chewbacca',
    ]);
  });

  it('sorts by mass ascending', () => {
    expect(sortPeople(roster, 'mass-asc').map((p) => p.name)).toEqual([
      'Leia Organa',
      'Luke Skywalker',
      'Chewbacca',
    ]);
  });

  it('does not mutate the input array', () => {
    const copy = [...roster];
    sortPeople(roster, 'name-desc');
    expect(roster).toEqual(copy);
  });
});
