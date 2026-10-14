/**
 * GET /api/video-file?job=<id>
 * Streams the finished Veo MP4 to the signed-in owner. The Gemini key is added here,
 * server-side, so it never appears in a URL the browser can see.
 */
import { GenerateVideosOperation } from '@google/genai';
import { HttpError, errorResponse, getAi, getGeminiKey, readJobId, requireUser } from './_lib/server.js';

export async function GET(request: Request): Promise<Response> {
  try {
    const user = await requireUser(request);
    const opName = readJobId(user.uid, new URL(request.url).searchParams.get('job'));

    const ai = getAi();
    const op = new GenerateVideosOperation();
    op.name = opName;
    const result = await ai.operations.getVideosOperation({ operation: op });
    const uri = result.response?.generatedVideos?.[0]?.video?.uri;
    if (!result.done || !uri) throw new HttpError(409, 'Video is not ready yet.');

    // Only ever fetch from Google's API host (the key must never be sent anywhere else).
    const target = new URL(uri);
    if (target.protocol !== 'https:' || target.hostname !== 'generativelanguage.googleapis.com') {
      throw new HttpError(502, 'Unexpected video location.');
    }

    const upstream = await fetch(target, { headers: { 'x-goog-api-key': getGeminiKey() }, redirect: 'follow' });
    if (!upstream.ok || !upstream.body) {
      throw new HttpError(502, `Could not download the video (status ${upstream.status}).`);
    }

    const headers = new Headers({
      'content-type': upstream.headers.get('content-type') || 'video/mp4',
      'cache-control': 'private, no-store',
    });
    const len = upstream.headers.get('content-length');
    if (len) headers.set('content-length', len);
    return new Response(upstream.body, { status: 200, headers });
  } catch (err) {
    return errorResponse(err);
  }
}
