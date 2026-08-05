/**
 * There is no real backend here, so these are *shaped* like JWTs
 * (header.payload.signature, base64url-encoded segments) purely so the app's
 * auth flow — issue, decode, expire, refresh — behaves like a real one. The
 * "signature" segment is a decoy; nothing here should be treated as secure.
 */
export interface MockTokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

function base64UrlEncode(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(value: string): string {
  const padded = value
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(value.length + ((4 - (value.length % 4)) % 4), '=');
  return atob(padded);
}

export function createMockToken(
  subject: string,
  ttlMs: number,
): { token: string; expiresAt: number } {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + ttlMs;
  const header = base64UrlEncode(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = base64UrlEncode(
    JSON.stringify({ sub: subject, iat: issuedAt, exp: expiresAt } satisfies MockTokenPayload),
  );
  const signature = base64UrlEncode(`mock-signature-${issuedAt}`);
  return { token: `${header}.${payload}.${signature}`, expiresAt };
}

export function decodeMockToken(token: string): MockTokenPayload | null {
  try {
    const [, payload] = token.split('.');
    const decoded: unknown = JSON.parse(base64UrlDecode(payload));
    if (
      decoded !== null &&
      typeof decoded === 'object' &&
      'sub' in decoded &&
      'exp' in decoded &&
      'iat' in decoded
    ) {
      return decoded as MockTokenPayload;
    }
    return null;
  } catch {
    return null;
  }
}

export function isTokenExpired(expiresAt: number | null): boolean {
  if (expiresAt === null) return true;
  return Date.now() >= expiresAt;
}
