/**
 * swapi.dev (the community mirror the original assignment pointed at) has
 * become unreliable/down. swapi.py4e.com is a byte-for-byte compatible
 * mirror — identical count/next/previous envelope, identical field names,
 * identical ?search=/?page= query params — so nothing else in the codebase
 * needs to change.
 */
export const SWAPI_BASE_URL = 'https://swapi.py4e.com/api' as const;

export const SWAPI_ENDPOINTS = {
  people: '/people',
  species: '/species',
  planets: '/planets',
  films: '/films',
} as const;

/** SWAPI returns 10 results per page and does not accept a page-size param. */
export const SWAPI_PAGE_SIZE = 10;
