/**
 * Veo video generation, split into short requests so no function runs for minutes.
 *
 * POST /api/video           Body: { model, prompt, config?, image? }  -> { jobId }
 * GET  /api/video?job=<id>  -> { done: boolean, error?: string }
 */
import { GenerateVideosOperation } from '@google/genai';
import {
  ALLOWED_VIDEO_MODELS,
  HttpError,
  errorResponse,
  getAi,
  json,
  makeJobId,
  readJobId,
  readJsonBody,
  requireUser,
} from './_lib/server.js';

export async function POST(request: Request): Promise<Response> {
  try {
    const user = await requireUser(request);
    const body = await readJsonBody<{ model?: string; prompt?: string; config?: any; image?: any }>(request);
    if (!body.model || !ALLOWED_VIDEO_MODELS.has(body.model)) throw new HttpError(400, 'Model not allowed.');
    if (!body.prompt && !body.image) throw new HttpError(400, 'A prompt or image is required.');

    const ai = getAi();
    const params: any = { model: body.model, prompt: body.prompt, config: body.config };
    if (body.image?.imageBytes) {
      params.image = { imageBytes: String(body.image.imageBytes), mimeType: String(body.image.mimeType || 'image/png') };
    }
    const operation = await ai.models.generateVideos(params);
    if (!operation.name) throw new HttpError(502, 'Video service did not return a job id.');
    return json(200, { jobId: makeJobId(user.uid, operation.name) });
  } catch (err) {
    return errorResponse(err);
  }
}

export async function GET(request: Request): Promise<Response> {
  try {
    const user = await requireUser(request);
    const opName = readJobId(user.uid, new URL(request.url).searchParams.get('job'));

    const ai = getAi();
    const op = new GenerateVideosOperation();
    op.name = opName;
    const result = await ai.operations.getVideosOperation({ operation: op });

    if (!result.done) return json(200, { done: false });
    if (result.error) {
      return json(200, { done: true, error: String((result.error as any).message || 'Video generation failed.') });
    }
    const hasVideo = Boolean(result.response?.generatedVideos?.[0]?.video?.uri);
    if (!hasVideo) {
      return json(200, { done: true, error: 'Video was blocked or not produced. Try a different prompt.' });
    }
    return json(200, { done: true });
  } catch (err) {
    return errorResponse(err);
  }
}
