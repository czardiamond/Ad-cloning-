import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// NOTE: No API keys are injected into the browser bundle any more.
// Gemini is called from the serverless functions in /api, which read
// GEMINI_API_KEY from the server environment (Vercel project settings).
export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
