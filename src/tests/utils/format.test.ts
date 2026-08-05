import { describe, expect, it } from 'vitest';
import {
  formatBirthYear,
  formatCreatedDate,
  formatHeightInMeters,
  formatMassInKg,
  formatPopulation,
} from '@/utils/format';

describe('formatHeightInMeters', () => {
  it('converts centimeters to meters with two decimal places', () => {
    expect(formatHeightInMeters('172')).toBe('1.72 m');
    expect(formatHeightInMeters('96')).toBe('0.96 m');
  });

  it('returns "Unknown" for SWAPI\'s unknown marker', () => {
    expect(formatHeightInMeters('unknown')).toBe('Unknown');
  });
});

describe('formatMassInKg', () => {
  it('formats a numeric mass with a unit suffix', () => {
    expect(formatMassInKg('77')).toBe('77 kg');
  });

  it('strips thousands separators before parsing', () => {
    expect(formatMassInKg('1,358')).toBe('1,358 kg');
  });

  it('returns "Unknown" for non-numeric values', () => {
    expect(formatMassInKg('unknown')).toBe('Unknown');
  });
});

describe('formatCreatedDate', () => {
  it('formats an ISO timestamp as dd-MM-yyyy', () => {
    expect(formatCreatedDate('2014-12-09T13:50:51.644000Z')).toBe('09-12-2014');
  });

  it('returns "Unknown" for an invalid date', () => {
    expect(formatCreatedDate('not-a-date')).toBe('Unknown');
  });
});

describe('formatBirthYear', () => {
  it('passes through a known birth year', () => {
    expect(formatBirthYear('19BBY')).toBe('19BBY');
  });

  it('returns "Unknown" for SWAPI\'s unknown marker', () => {
    expect(formatBirthYear('unknown')).toBe('Unknown');
  });
});

describe('formatPopulation', () => {
  it('adds locale thousands separators', () => {
    expect(formatPopulation('200000')).toBe('200,000');
  });

  it('returns "Unknown" for unknown population', () => {
    expect(formatPopulation('unknown')).toBe('Unknown');
  });
});
