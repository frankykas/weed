/**
 * Vercel Node.js server for Hydrogen.
 *
 * Wraps the standard Hydrogen server logic so it runs on Node.js while
 * keeping every Hydrogen feature intact: SSR, Storefront API, analytics,
 * session, cart, customer accounts, etc.
 *
 * Exports:
 *  - `app`  — Hono app (used by the Vercel serverless function)
 *  - If run standalone (`node dist/server/index.js`), starts an HTTP server.
 */
import {Hono} from 'hono';
import {serveStatic} from '@hono/node-server/serve-static';
import * as serverBuild from 'virtual:react-router/server-build';
import {
  createRequestHandler as createHydrogenHandler,
  storefrontRedirect,
} from '@shopify/hydrogen';
import {createRequestHandler as createBaseHandler} from 'react-router';
import {createHydrogenRouterContext} from '~/lib/context';

/* ------------------------------------------------------------------ */
/*  Polyfill: Web Cache API (replaces Oxygen's caches.open())          */
/* ------------------------------------------------------------------ */
if (typeof globalThis.caches === 'undefined') {
  const stores = new Map<string, Map<string, Response>>();

  (globalThis as any).caches = {
    async open(name: string) {
      if (!stores.has(name)) stores.set(name, new Map());
      const store = stores.get(name)!;
      return {
        async match(req: Request | string) {
          const key = typeof req === 'string' ? req : req.url;
          const hit = store.get(key);
          return hit ? hit.clone() : undefined;
        },
        async put(req: Request | string, res: Response) {
          const key = typeof req === 'string' ? req : req.url;
          store.set(key, res.clone());
        },
        async delete(req: Request | string) {
          const key = typeof req === 'string' ? req : req.url;
          return store.delete(key);
        },
      };
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Hono app                                                           */
/* ------------------------------------------------------------------ */
export const app = new Hono();

// Serve static client assets
app.use(
  '/assets/*',
  serveStatic({root: './dist/client', rewriteRequestPath: (p) => p}),
);

// Check if a Shopify store is connected
const hasShopifyStore = () => !!process.env.PUBLIC_STORE_DOMAIN;

// All other routes → Hydrogen SSR
app.all('*', async (c) => {
  const request = c.req.raw;

  // Build the env from process.env (same shape Hydrogen expects from Oxygen)
  const env = {
    SESSION_SECRET: process.env.SESSION_SECRET || 'foobar',
    PUBLIC_STOREFRONT_API_TOKEN:
      process.env.PUBLIC_STOREFRONT_API_TOKEN || '',
    PUBLIC_STORE_DOMAIN: process.env.PUBLIC_STORE_DOMAIN || '',
    PUBLIC_STOREFRONT_ID: process.env.PUBLIC_STOREFRONT_ID || '',
    PUBLIC_CHECKOUT_DOMAIN: process.env.PUBLIC_CHECKOUT_DOMAIN || '',
    PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID:
      process.env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID || '',
    PUBLIC_CUSTOMER_ACCOUNT_API_URL:
      process.env.PUBLIC_CUSTOMER_ACCOUNT_API_URL || '',
    SHOP_ID: process.env.SHOP_ID || '',
  } as unknown as Env;

  // No-op ExecutionContext — Node.js stays alive after the response
  const executionContext: ExecutionContext = {
    waitUntil(promise: Promise<any>) {
      promise.catch((err) => console.error('waitUntil error:', err));
    },
    passThroughOnException() {},
  };

  try {
    if (hasShopifyStore()) {
      // Full Hydrogen mode — connected to a real Shopify store
      const hydrogenContext = await createHydrogenRouterContext(
        request,
        env,
        executionContext,
      );

      const handleRequest = createHydrogenHandler({
        build: serverBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => hydrogenContext,
      });

      const response = await handleRequest(request);

      if (hydrogenContext.session.isPending) {
        response.headers.set(
          'Set-Cookie',
          await hydrogenContext.session.commit(),
        );
      }

      if (response.status === 404) {
        return storefrontRedirect({
          request,
          response,
          storefront: hydrogenContext.storefront,
        });
      }

      return response;
    } else {
      // Mock mode — no Shopify store connected
      // Uses the base React Router handler (no Hydrogen validation)
      const mockContext = {
        env,
        storefront: null,
        customerAccount: null,
        cart: null,
        session: {isPending: false, commit: async () => ''},
        waitUntil: executionContext.waitUntil,
      };

      const handleRequest = createBaseHandler(serverBuild, {
        getLoadContext: () => mockContext,
      });

      return await handleRequest(request);
    }
  } catch (error) {
    console.error(error);
    return new Response('An unexpected error occurred', {status: 500});
  }
});

/* ------------------------------------------------------------------ */
/*  Standalone mode (local testing: node dist/server/index.js)         */
/* ------------------------------------------------------------------ */
if (!process.env.VERCEL) {
  import('@hono/node-server').then(({serve}) => {
    const port = parseInt(process.env.PORT || '3000', 10);
    serve({fetch: app.fetch, port}, () => {
      console.log(`Hydrogen (Node.js) running at http://localhost:${port}`);
    });
  });
}
