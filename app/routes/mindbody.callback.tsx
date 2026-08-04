import {useEffect} from 'react';
import {data, useActionData, useLoaderData} from 'react-router';
import type {Route} from './+types/mindbody.callback';
import {
  decodeMindbodyState,
  exchangeMindbodyCode,
  getMindbodyOAuthEnv,
} from '~/lib/mindbody-oauth.server';

type CallbackResult = {
  connected: boolean;
  returnTo: string;
  error?: string;
};

export async function loader({context, request}: Route.LoaderArgs) {
  const url = new URL(request.url);
  return handleCallback(context, {
    code: url.searchParams.get('code'),
    state: url.searchParams.get('state'),
    error: url.searchParams.get('error'),
    returnTo: url.searchParams.get('return_to'),
  });
}

export async function action({context, request}: Route.ActionArgs) {
  const form = await request.formData();
  return handleCallback(context, {
    code: stringValue(form.get('code')),
    state: stringValue(form.get('state')),
    error: stringValue(form.get('error')),
    returnTo: stringValue(form.get('return_to')),
  });
}

export default function MindbodyCallback() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const result = actionData ?? loaderData;

  useEffect(() => {
    window.localStorage.setItem(
      'gigi:mindbody-auth',
      JSON.stringify({...result, at: Date.now()}),
    );

    window.opener?.postMessage(
      {
        type: 'gigi:mindbody-connected',
        connected: result.connected,
        returnTo: result.returnTo,
        error: result.error,
      },
      window.location.origin,
    );

    if (result.connected && window.opener) {
      window.close();
    }
  }, [result]);

  return (
    <main className="mindbody-callback">
      <h1>
        {result.connected ? 'Mindbody connected' : 'Mindbody login failed'}
      </h1>
      <p>
        {result.connected
          ? 'You can return to GIGI to continue booking.'
          : result.error || 'Please try again from the GIGI booking window.'}
      </p>
      <a href={result.returnTo}>Return to GIGI</a>
    </main>
  );
}

async function handleCallback(
  context: unknown,
  input: {
    code: string | null;
    state: string | null;
    error: string | null;
    returnTo: string | null;
  },
) {
  const decodedState = decodeMindbodyState(input.state);
  const returnTo = decodedState?.returnTo || input.returnTo || '/book#book-now';
  const headers = new Headers();

  if (input.error) {
    return data<CallbackResult>(
      {connected: false, returnTo, error: input.error},
      {headers},
    );
  }

  if (!input.code) {
    return data<CallbackResult>({connected: true, returnTo}, {headers});
  }

  try {
    const session = (context as any).session;
    const expectedState = session?.get?.('mindbody_oauth_state');

    if (expectedState && decodedState?.nonce !== expectedState) {
      throw new Error('Mindbody login session expired. Please try again.');
    }

    const token = await exchangeMindbodyCode({
      code: input.code,
      env: getMindbodyOAuthEnv(context),
    });

    session?.set?.('mindbody_access_token', token.access_token);
    if (token.refresh_token) {
      session?.set?.('mindbody_refresh_token', token.refresh_token);
    }
    if (token.expires_in) {
      session?.set?.(
        'mindbody_access_token_expires',
        `${Date.now() + token.expires_in * 1000}`,
      );
    }
    session?.unset?.('mindbody_oauth_state');

    if (session?.isPending && session?.commit) {
      headers.set('Set-Cookie', await session.commit());
    }

    return data<CallbackResult>({connected: true, returnTo}, {headers});
  } catch (error) {
    return data<CallbackResult>(
      {
        connected: false,
        returnTo,
        error:
          error instanceof Error
            ? error.message
            : 'Mindbody login could not be completed.',
      },
      {headers},
    );
  }
}

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value : null;
}
