/**
 * POST /api/generate
 * Body: { model: string, contents: any, config?: any }
 * Proxies ai.models.generateContent server-side so the Gemini key never reaches the browser.
 * Returns: { text: string | null, candidates: any[] }
 */
import { ALLOWED_TEXT_MODELS, HttpError, errorResponse, getAi, json, readJsonBody, requireUser } from './_lib/server.js';

export async function POST(request: Request): Promise<Response> {
  try {
    await requireUser(request);
    const body = await readJsonBody<{ model?: string; contents?: unknown; config?: unknown }>(request);
    if (!body.model || !ALLOWED_TEXT_MODELS.has(body.model)) {
      throw new HttpError(400, 'Model not allowed.');
    }
    if (body.contents === undefined || body.contents === null) {
      throw new HttpError(400, 'Missing contents.');
    }

    const ai = getAi();
    const response = await ai.models.generateContent({
      model: body.model,
      contents: body.contents as any,
      config: (body.config || undefined) as any,
    });

    let text: string | null = null;
    try {
      text = response.text ?? null;
    } catch {
      text = null;
    }
    return json(200, { text, candidates: response.candidates || [] });
  } catch (err) {
    return errorResponse(err);
  }
}
