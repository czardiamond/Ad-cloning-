/**
 * Shared helpers for the Vercel serverless functions in /api.
 *
 * - Verifies the caller's Firebase ID token (sent as `Authorization: Bearer <token>`)
 *   against Google's public signing keys. No service account is needed.
 * - Reads GEMINI_API_KEY and FIREBASE_PROJECT_ID from the server environment only.
 *
 * Files under api/_lib are not exposed as routes by Vercel (leading underscore).
 */
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import { GoogleGenAI } from '@google/genai';
import { createHmac, timingSafeEqual } from 'node:crypto';

/** Max accepted request body (bytes). Vercel itself rejects bodies above ~4.5 MB. */
export const MAX_BODY_BYTES = 4 * 1024 * 1024;

const JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}

export function errorResponse(err: unknown): Response {
  if (err instanceof HttpError) {
    return json(err.status, { error: err.message });
  }
  const anyErr = err as any;
  // Surface Gemini's own status code (e.g. 400/403/429) so the client can show a friendly message.
  const status = typeof anyErr?.status === 'number' && anyErr.status >= 400 && anyErr.status < 600 ? anyErr.status : 500;
  const message = String(anyErr?.message || anyErr || 'Unknown server error')
    // Never echo anything that looks like a key back to the browser.
    .replace(/AIza[0-9A-Za-z_-]{20,}/g, '[redacted]');
  console.error('[api] error:', message);
  return json(status, { error: message });
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new HttpError(500, `Server is missing the ${name} environment variable.`);
  return v;
}

export interface AuthedUser {
  uid: string;
  email?: string;
  claims: JWTPayload;
}

/** Verifies the Firebase ID token from the Authorization header. Throws HttpError(401) if invalid. */
export async function requireUser(request: Request): Promise<AuthedUser> {
  const projectId = requireEnv('FIREBASE_PROJECT_ID');
  const header = request.headers.get('authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) throw new HttpError(401, 'Please sign in with Google to use AI features.');

  try {
    const { payload } = await jwtVerify(match[1], JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
      algorithms: ['RS256'],
    });
    if (!payload.sub) throw new Error('Token has no subject');
    return { uid: payload.sub, email: payload.email as string | undefined, claims: payload };
  } catch {
    throw new HttpError(401, 'Your sign-in has expired. Please sign in again.');
  }
}

/** Reads and parses a JSON body, enforcing MAX_BODY_BYTES. */
export async function readJsonBody<T = any>(request: Request): Promise<T> {
  const declared = Number(request.headers.get('content-length') || '0');
  if (declared > MAX_BODY_BYTES) throw new HttpError(413, 'Request is too large (max 4 MB). Try a smaller image or audio file.');
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) throw new HttpError(413, 'Request is too large (max 4 MB). Try a smaller image or audio file.');
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new HttpError(400, 'Request body must be valid JSON.');
  }
}

export function getGeminiKey(): string {
  return requireEnv('GEMINI_API_KEY');
}

export function getAi(): GoogleGenAI {
  return new GoogleGenAI({ apiKey: getGeminiKey() });
}

/** Models the app is allowed to call through the proxy (prevents the endpoint being used for anything else). */
export const ALLOWED_TEXT_MODELS = new Set([
  'gemini-3-pro-preview',
  'gemini-3-flash-preview',
  'gemini-3-pro-image-preview',
  'gemini-2.5-flash-image',
  'gemini-2.5-flash-native-audio-preview-09-2025',
]);

export const ALLOWED_VIDEO_MODELS = new Set(['veo-3.1-fast-generate-preview']);

/** Veo operation names look like `models/<model>/operations/<id>`. */
export function assertOperationName(name: unknown): string {
  if (typeof name !== 'string' || !/^models\/[\w.-]+\/operations\/[\w-]+$/.test(name)) {
    throw new HttpError(400, 'Invalid video operation id.');
  }
  return name;
}

/**
 * Video jobs are handed to the browser as an opaque "job id" = operation name + signature
 * bound to the user's uid, so one user can't poll or download another user's video.
 */
function sign(uid: string, opName: string): string {
  return createHmac('sha256', getGeminiKey()).update(`${uid}|${opName}`).digest('base64url');
}

export function makeJobId(uid: string, opName: string): string {
  return `${Buffer.from(opName).toString('base64url')}.${sign(uid, opName)}`;
}

export function readJobId(uid: string, jobId: unknown): string {
  if (typeof jobId !== 'string' || !jobId.includes('.')) throw new HttpError(400, 'Invalid video job id.');
  const [encoded, sig] = jobId.split('.', 2);
  const opName = assertOperationName(Buffer.from(encoded, 'base64url').toString('utf8'));
  const expected = Buffer.from(sign(uid, opName));
  const given = Buffer.from(sig || '');
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    throw new HttpError(403, 'This video job does not belong to your account.');
  }
  return opName;
}
