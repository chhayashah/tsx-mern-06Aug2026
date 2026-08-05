import { format, isValid, parseISO } from 'date-fns';

const UNKNOWN_VALUES = new Set(['unknown', 'n/a', '']);

function isKnownNumeric(value: string): boolean {
  return !UNKNOWN_VALUES.has(value.trim().toLowerCase());
}

/** SWAPI reports height in centimeters as a string; the modal shows meters. */
export function formatHeightInMeters(heightCm: string): string {
  if (!isKnownNumeric(heightCm)) return 'Unknown';
  const cm = Number(heightCm);
  if (Number.isNaN(cm)) return 'Unknown';
  return `${(cm / 100).toFixed(2)} m`;
}

/** SWAPI reports mass in kilograms already; this just normalizes formatting. */
export function formatMassInKg(massKg: string): string {
  if (!isKnownNumeric(massKg)) return 'Unknown';
  const normalized = massKg.replace(/,/g, '');
  const kg = Number(normalized);
  if (Number.isNaN(kg)) return 'Unknown';
  return `${kg.toLocaleString()} kg`;
}

/** Formats a SWAPI ISO timestamp (the `created` field) as dd-MM-yyyy. */
export function formatCreatedDate(isoDate: string): string {
  const parsed = parseISO(isoDate);
  if (!isValid(parsed)) return 'Unknown';
  return format(parsed, 'dd-MM-yyyy');
}

export function formatBirthYear(birthYear: string): string {
  return isKnownNumeric(birthYear) ? birthYear : 'Unknown';
}

/** SWAPI represents large populations as a plain numeric string, or "unknown". */
export function formatPopulation(population: string): string {
  if (!isKnownNumeric(population)) return 'Unknown';
  const normalized = population.replace(/,/g, '');
  const value = Number(normalized);
  if (Number.isNaN(value)) return 'Unknown';
  return value.toLocaleString();
}
