/**
 * Vite config for Vercel (Node.js) deployment.
 *
 * Same as vite.config.ts except:
 *  - oxygen() plugin removed (targets Cloudflare Workers, not needed here)
 *  - ssr.target set to 'node' so react-dom/server uses renderToPipeableStream
 */
import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [hydrogen(), reactRouter(), tsconfigPaths(), tailwindcss()],
  build: {
    assetsInlineLimit: 0,
  },
  ssr: {
    target: 'node',
    optimizeDeps: {
      include: ['set-cookie-parser', 'cookie', 'react-router'],
    },
  },
});
