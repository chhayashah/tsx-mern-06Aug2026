import { describe, expect, it } from 'vitest';
import { extractIdFromUrl } from '@/utils/resource';

describe('extractIdFromUrl', () => {
  it('extracts the numeric id from a trailing-slash SWAPI url', () => {
    expect(extractIdFromUrl('https://swapi.dev/api/people/4/')).toBe('4');
  });

  it('extracts the numeric id without a trailing slash', () => {
    expect(extractIdFromUrl('https://swapi.dev/api/people/4')).toBe('4');
  });

  it('returns the original string when no id pattern is found', () => {
    expect(extractIdFromUrl('not-a-url')).toBe('not-a-url');
  });
});
