/**
 * Node.js-compatible server entry for Vercel deployment.
 *
 * Identical to entry.server.tsx but uses renderToPipeableStream (Node.js)
 * instead of renderToReadableStream (Cloudflare Workers / Oxygen).
 * All Hydrogen features (CSP, nonce, analytics) are preserved.
 */
import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToPipeableStream} from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';
import {PassThrough} from 'node:stream';

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env?.PUBLIC_CHECKOUT_DOMAIN ?? '',
      storeDomain: context.env?.PUBLIC_STORE_DOMAIN ?? '',
    },
    // MindBody booking widget renders a cross-origin iframe from
    // mindbodyonline.com. Only frame-src (the iframe) and connect-src (the
    // loader's config fetch) concern our page; everything else lives inside
    // the iframe under MindBody's own CSP. frame-src has no default here, so
    // include 'self' to preserve same-origin frames.
    scriptSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://shopify.com',
      'https://*.mindbodyonline.com',
      'https://*.mindbody.io',
    ],
    imgSrc: [
      "'self'",
      'data:',
      'https://cdn.shopify.com',
      'https://shopify.com',
      'https://*.mindbodyonline.com',
      'https://*.mindbody.io',
    ],
    frameSrc: ["'self'", 'https://*.mindbodyonline.com', 'https://*.mindbody.io'],
    connectSrc: ['https://*.mindbodyonline.com', 'https://*.mindbody.io'],
  });

  return new Promise<Response>((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get('user-agent');

    const {pipe, abort} = renderToPipeableStream(
      <NonceProvider>
        <ServerRouter
          context={reactRouterContext}
          url={request.url}
          nonce={nonce}
        />
      </NonceProvider>,
      {
        nonce,
        onAllReady() {
          // For bots, wait for the full document before responding
          if (isbot(userAgent) && !shellRendered) {
            onReady();
          }
        },
        onShellReady() {
          // For regular users, stream as soon as the shell is ready
          if (!isbot(userAgent)) {
            onReady();
          }
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    function onReady() {
      shellRendered = true;
      const body = new PassThrough();
      const stream = new ReadableStream({
        start(controller) {
          body.on('data', (chunk: Buffer) => {
            controller.enqueue(new Uint8Array(chunk));
          });
          body.on('end', () => {
            controller.close();
          });
          body.on('error', (err: Error) => {
            controller.error(err);
          });
        },
      });

      responseHeaders.set('Content-Type', 'text/html');
      responseHeaders.set('Content-Security-Policy', header);

      resolve(
        new Response(stream, {
          headers: responseHeaders,
          status: responseStatusCode,
        }),
      );

      pipe(body);
    }

    setTimeout(abort, ABORT_DELAY);
  });
}
