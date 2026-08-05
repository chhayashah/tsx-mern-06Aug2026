import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  SwapiFilm,
  SwapiListResponse,
  SwapiPerson,
  SwapiPlanet,
  SwapiSpecies,
} from '@/types/swapi';
import { SWAPI_BASE_URL } from '@/constants/api';
import { extractIdFromUrl } from '@/utils/resource';

/**
 * Single RTK Query surface for every SWAPI resource this app touches.
 * Kept as one api slice (rather than one per resource) because RTK Query
 * expects exactly one store-level reducer/middleware pair per `reducerPath`,
 * and the resources here are small enough that splitting would only add
 * indirection without real isolation benefits.
 */
export const swapiApi = createApi({
  reducerPath: 'swapiApi',
  baseQuery: fetchBaseQuery({ baseUrl: SWAPI_BASE_URL }),
  tagTypes: ['Person', 'Planet', 'Species', 'Film'],
  endpoints: (builder) => ({
    getPeoplePage: builder.query<
      SwapiListResponse<SwapiPerson>,
      { page?: number; search?: string }
    >({
      query: ({ page = 1, search }) => {
        const params = new URLSearchParams({ page: String(page) });
        if (search) params.set('search', search);
        return `/people/?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map((p) => ({
                type: 'Person' as const,
                id: extractIdFromUrl(p.url),
              })),
              { type: 'Person' as const, id: 'LIST' },
            ]
          : [{ type: 'Person' as const, id: 'LIST' }],
    }),

    getAllPeople: builder.query<SwapiPerson[], void>({
      // Filtering/sorting across the full roster reads better than paginating
      // client-side guesses, so this walks SWAPI's `next` links once and lets
      // RTK Query cache the assembled list. SWAPI is small (~80 people).
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const all: SwapiPerson[] = [];
        let url: string | null = `/people/`;
        while (url) {
          const result = await baseQuery(url);
          if (result.error) return { error: result.error };
          const page = result.data as SwapiListResponse<SwapiPerson>;
          all.push(...page.results);
          url = page.next ? page.next.replace(SWAPI_BASE_URL, '') : null;
        }
        return { data: all };
      },
      providesTags: [{ type: 'Person', id: 'LIST' }],
    }),

    getAllSpecies: builder.query<SwapiSpecies[], void>({
      // Species names are needed for every card's badge; SWAPI only has
      // ~37 species total, so fetching the full list once (and letting RTK
      // Query cache it for the session) beats resolving each person's
      // species URL individually.
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const all: SwapiSpecies[] = [];
        let url: string | null = `/species/`;
        while (url) {
          const result = await baseQuery(url);
          if (result.error) return { error: result.error };
          const page = result.data as SwapiListResponse<SwapiSpecies>;
          all.push(...page.results);
          url = page.next ? page.next.replace(SWAPI_BASE_URL, '') : null;
        }
        return { data: all };
      },
      providesTags: [{ type: 'Species', id: 'LIST' }],
    }),

    getAllPlanets: builder.query<SwapiPlanet[], void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const all: SwapiPlanet[] = [];
        let url: string | null = `/planets/`;
        while (url) {
          const result = await baseQuery(url);
          if (result.error) return { error: result.error };
          const page = result.data as SwapiListResponse<SwapiPlanet>;
          all.push(...page.results);
          url = page.next ? page.next.replace(SWAPI_BASE_URL, '') : null;
        }
        return { data: all };
      },
      providesTags: [{ type: 'Planet', id: 'LIST' }],
    }),

    getAllFilms: builder.query<SwapiFilm[], void>({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const result = await baseQuery('/films/');
        if (result.error) return { error: result.error };
        const page = result.data as SwapiListResponse<SwapiFilm>;
        return { data: page.results };
      },
      providesTags: [{ type: 'Film', id: 'LIST' }],
    }),

    getPlanetByUrl: builder.query<SwapiPlanet, string>({
      query: (url) => url.replace(SWAPI_BASE_URL, ''),
      providesTags: (_r, _e, url) => [{ type: 'Planet', id: extractIdFromUrl(url) }],
    }),

    getSpeciesByUrl: builder.query<SwapiSpecies, string>({
      query: (url) => url.replace(SWAPI_BASE_URL, ''),
      providesTags: (_r, _e, url) => [{ type: 'Species', id: extractIdFromUrl(url) }],
    }),

    getFilmByUrl: builder.query<SwapiFilm, string>({
      query: (url) => url.replace(SWAPI_BASE_URL, ''),
      providesTags: (_r, _e, url) => [{ type: 'Film', id: extractIdFromUrl(url) }],
    }),
  }),
});

export const {
  useGetPeoplePageQuery,
  useGetAllPeopleQuery,
  useGetAllSpeciesQuery,
  useGetAllPlanetsQuery,
  useGetAllFilmsQuery,
  useGetPlanetByUrlQuery,
  useGetSpeciesByUrlQuery,
  useGetFilmByUrlQuery,
  // eslint-disable-next-line @typescript-eslint/unbound-method -- RTK Query hooks are safe to destructure
  usePrefetch,
} = swapiApi;
