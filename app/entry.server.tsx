import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToPipeableStream} from 'react-dom/server';
import type {EntryContext} from 'react-router';
import {PassThrough} from 'node:stream';

const ABORT_DELAY = 5000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
) {
  return new Promise<Response>((resolve, reject) => {
    let shellRendered = false;

    const {pipe, abort} = renderToPipeableStream(
      <ServerRouter context={reactRouterContext} url={request.url} />,
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = new ReadableStream({
            start(controller) {
              body.on('data', (chunk) => {
                controller.enqueue(new Uint8Array(chunk));
              });
              body.on('end', () => {
                controller.close();
              });
              body.on('error', (err) => {
                controller.error(err);
              });
            },
          });

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
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

    setTimeout(abort, ABORT_DELAY);
  });
}
