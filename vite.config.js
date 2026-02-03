import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https: http: blob:; media-src 'self' data: https: http: blob: https://bmtbljnbdtzdmswopfcp.supabase.co; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data: https:; connect-src 'self' https: http: wss:;",
    },
  },
});