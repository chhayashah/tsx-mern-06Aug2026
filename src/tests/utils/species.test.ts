import { describe, expect, it } from 'vitest';
import { getSpeciesColor, formatSpeciesLabel } from '@/utils/species';

describe('getSpeciesColor', () => {
  it('maps named species to their assigned token', () => {
    expect(getSpeciesColor('Human')).toBe('var(--color-species-human)');
    expect(getSpeciesColor('Droid')).toBe('var(--color-species-droid)');
    expect(getSpeciesColor('Wookiee')).toBe('var(--color-species-wookiee)');
    expect(getSpeciesColor('Rodian')).toBe('var(--color-species-rodian)');
  });

  it('is case-insensitive', () => {
    expect(getSpeciesColor('HUMAN')).toBe(getSpeciesColor('human'));
  });

  it('falls back to the unknown token for null, empty, or "unknown"', () => {
    expect(getSpeciesColor(null)).toBe('var(--color-species-unknown)');
    expect(getSpeciesColor('')).toBe('var(--color-species-unknown)');
    expect(getSpeciesColor('unknown')).toBe('var(--color-species-unknown)');
  });

  it('deterministically assigns unlisted species a stable color', () => {
    const first = getSpeciesColor('Ewok');
    const second = getSpeciesColor('Ewok');
    expect(first).toBe(second);
    expect(first).not.toBe('var(--color-species-unknown)');
  });
});

describe('formatSpeciesLabel', () => {
  it('renders "Unknown" for missing values', () => {
    expect(formatSpeciesLabel(null)).toBe('Unknown');
    expect(formatSpeciesLabel('')).toBe('Unknown');
  });

  it('passes through a real species name', () => {
    expect(formatSpeciesLabel('Wookiee')).toBe('Wookiee');
  });
});
