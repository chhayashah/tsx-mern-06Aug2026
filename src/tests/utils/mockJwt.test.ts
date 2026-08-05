import { describe, expect, it, vi } from 'vitest';
import { createMockToken, decodeMockToken, isTokenExpired } from '@/utils/mockJwt';

describe('createMockToken / decodeMockToken', () => {
  it('creates a three-segment token and decodes it back', () => {
    const { token, expiresAt } = createMockToken('rebel', 60_000);
    expect(token.split('.')).toHaveLength(3);

    const payload = decodeMockToken(token);
    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe('rebel');
    expect(payload?.exp).toBe(expiresAt);
  });

  it('returns null for a malformed token', () => {
    expect(decodeMockToken('not-a-real-token')).toBeNull();
  });
});

describe('isTokenExpired', () => {
  it('treats a null expiry as expired', () => {
    expect(isTokenExpired(null)).toBe(true);
  });

  it('treats a future expiry as not expired', () => {
    expect(isTokenExpired(Date.now() + 60_000)).toBe(false);
  });

  it('treats a past expiry as expired', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    expect(isTokenExpired(new Date('2025-12-31T23:59:59Z').getTime())).toBe(true);
    vi.useRealTimers();
  });
});
