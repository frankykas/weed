import type {Config} from '@react-router/dev/config';

/**
 * React Router Configuration
 *
 * SPA mode — all routing and data loading happens in the browser.
 * This lets us deploy as static files to any host (Vercel, Netlify, etc.)
 * while keeping full route-level loaders working client-side.
 */
export default {
  ssr: false,
} satisfies Config;
