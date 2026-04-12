/**
 * Vercel Serverless Function entry point.
 *
 * Uses @hono/node-server's Vercel adapter to convert the Hono app
 * (exported from the Hydrogen server build) into a Vercel handler.
 */
import {handle} from '@hono/node-server/vercel';
import {app} from '../dist/server/index.js';

export default handle(app);
