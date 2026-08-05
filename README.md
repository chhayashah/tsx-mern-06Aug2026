# Archive Terminal — Star Wars Character Explorer

A production-style SaaS dashboard for browsing the Star Wars universe via a [SWAPI](https://swapi.py4e.com/api/people)-compatible API, built as a demonstration of scalable React/TypeScript architecture rather than a basic CRUD exercise.

> **Data source note:** the assignment points at `swapi.dev`, which has become unreliable/down as a community-maintained mirror. The app is configured (in `src/constants/api.ts`) to use `swapi.py4e.com` instead — a byte-for-byte compatible mirror (identical response shape, pagination, and search/query params) — so no other code changes were needed. If `swapi.dev` comes back and you'd prefer it, just change `SWAPI_BASE_URL`.

## Overview

Archive Terminal presents SWAPI's character roster as a searchable, filterable, sortable "recovered intelligence datapad." It fetches real data (no mocked character content), handles SWAPI's real failure modes gracefully, and layers in the kind of polish a shipped internal tool would need: skeleton loading, animated transitions, keyboard-accessible modals, persisted user preferences, and a mock JWT auth flow with silent refresh.

## Features

**Core**

- Character roster fetched live from `GET /people`, paginated using SWAPI's real `count`/`next`/`previous`
- Character cards: deterministic avatar (picsum.photos seeded by name), name, species badge colored by an extensible species→color map
- Framer Motion hover animation (lift, scale, slight rotation, species-tinted shadow) on every card
- Character details modal: height (cm → m), mass (kg), birth year, `created` formatted `dd-MM-yyyy` (date-fns), film count — all focus-trapped and closable via Escape, backdrop click, or the close button
- Homeworld panel inside the modal: planet name, terrain, climate, resident count, population
- Skeleton loading (no spinners) for both the roster grid and the homeworld panel
- Retry-able error state for SWAPI failures; empty state for zero-result queries
- Fully responsive (mobile/tablet/desktop) 2→3→4→5 column grid

**Bonus**

- Debounced search by partial name (350ms)
- Filters by species / homeworld / film, all composable with search and each other
- Sort by name (A–Z / Z–A), height, or mass
- Favorites, persisted to `localStorage`, with a "Favorites only" toggle that composes with the rest
- Dark/light theme, persisted to `localStorage`, applied before first paint to avoid a flash of the wrong theme
- Mock JWT auth: login page, protected route, logout, and a silent-refresh loop that reissues the access token shortly before it expires — all without a backend
- Performance: memoized derived data, `React.memo` on cards, RTK Query caching, hover-triggered prefetching (next page, homeworld details), route-level code splitting
- Accessibility: full keyboard navigation, modal focus trap, skip-to-content link, ARIA labels throughout, visible focus rings, `prefers-reduced-motion` respected

## Tech Stack

| Layer              | Choice                                      |
| ------------------ | ------------------------------------------- |
| Framework          | React 19 + TypeScript (strict)              |
| Build              | Vite 8                                      |
| Styling            | Tailwind CSS v4 (CSS-first `@theme` config) |
| State              | Redux Toolkit                               |
| Data fetching      | RTK Query                                   |
| Routing            | React Router v7                             |
| Animation          | Framer Motion                               |
| Dates              | date-fns                                    |
| Testing            | Vitest + React Testing Library              |
| Linting/formatting | ESLint (flat config) + Prettier             |

## Architecture

- **One RTK Query slice** (`api/swapiApi.ts`) covers people, species, planets, and films. Paginated list endpoints exist alongside "fetch everything" endpoints (`getAllPeople`, `getAllSpecies`, `getAllPlanets`, `getAllFilms`) that walk SWAPI's `next` links once and let RTK Query cache the result — needed because SWAPI can't express search/filter/sort server-side, but the roster is small enough (~80 people, ~37 species) that this is cheap and gets cached for the session.
- **`HomePage` switches data source automatically**: with no search/filter/sort active it uses real server-side pagination (`getPeoplePage`); the moment any of those becomes active it switches to the full roster, applies filter → sort → client-side pagination, and reuses the same `Pagination` component either way.
- **Feature slices** (`features/theme`, `features/favorites`, `features/filters`, `features/auth`) each own one concern and persist to `localStorage` where relevant.
- **Species colors are extensible by design**: the four species named in the spec get fixed colors; anything else gets a deterministic (stable, non-random) color via a small hash, so new species in SWAPI don't need a code change.
- **Auth is a real mock, not a fake one**: tokens are shaped like JWTs (base64url header.payload.signature, with `iat`/`exp`) so the login/expire/refresh/logout lifecycle behaves like it would against a real backend, even though nothing is cryptographically signed.

## Folder Structure

```
src/
  app/                 Redux store + typed hooks
  api/                 RTK Query slice (swapiApi.ts)
  components/          One folder per component (CharacterCard, CharacterGrid,
                        CharacterModal, Loader, ErrorState, Pagination, Navbar,
                        SearchBar, FilterPanel, EmptyState, Skeleton)
  features/            Redux slices: theme, favorites, filters, auth
  pages/               Home, Login
  hooks/               useDebouncedValue, useFocusTrap, useBodyScrollLock,
                       useAuth, useSilentTokenRefresh, useSpeciesLookup
  routes/              router.tsx, ProtectedRoute
  types/               swapi.ts — SWAPI response contracts
  utils/               avatar, species, format, mockJwt, peopleQuery, resource
  constants/           api.ts, app.ts — no magic strings
  tests/               components/, utils/, setup.ts, testUtils.tsx
```

## Setup

Requires Node 20+.

```bash
npm install
npm run dev        # http://localhost:5173
```

Sign in with the mock credentials shown on the login screen (username `rebel`, password `alliance`) — there's no real backend, so any other combination is rejected client-side.

## Environment

No environment variables or `.env` file are required — SWAPI is public and the auth layer is fully client-side.

## Available Scripts

```bash
npm run dev              # start the dev server
npm run build             # type-check (tsc -b) then production build
npm run preview           # preview the production build locally
npm run lint              # ESLint, zero warnings allowed
npm run lint:fix          # ESLint with autofix
npm run format            # Prettier --write
npm run format:check      # Prettier --check
npm run typecheck         # tsc -b --noEmit
npm run test              # Vitest, single run
npm run test:watch        # Vitest, watch mode
npm run test:coverage     # Vitest with coverage
```

## Testing

51 tests across utilities and components: species-color mapping, id extraction, unit/date formatting, search/filter/sort logic, mock-JWT lifecycle, `Pagination`, `CharacterCard` (render/open/favorite-toggle), `CharacterModal` (open/display/close via button and Escape), `SearchBar` debounce behavior, `LoginPage` (invalid vs. valid credentials), and `ProtectedRoute` (redirect vs. render).

## Screenshots

_Add screenshots here after your first `npm run dev` — a roster view, the character modal, and the light theme are good candidates._

## Deployment

Deploy to [Vercel](https://vercel.com):

```bash
npm install -g vercel
vercel
```

Or via the Vercel dashboard: import the repository, framework preset **Vite**, build command `npm run build`, output directory `dist`. No environment variables are needed.

## Future Improvements

- Replace the mock-JWT auth with a real backend (or a serverless token endpoint) once one exists
- Add virtualization (e.g. `react-window`) to the grid if the roster grows well beyond SWAPI's current ~80 people
- Persist filter/sort state to the URL (query params) so roster views are shareable and support browser back/forward
- Add an E2E layer (Playwright) on top of the existing unit/component tests
- Internationalize copy currently hard-coded in English
