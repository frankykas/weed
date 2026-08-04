import {redirect} from 'react-router';

export type MindbodyOAuthEnv = {
  MINDBODY_OAUTH_CLIENT_ID?: string;
  MINDBODY_OAUTH_CLIENT_SECRET?: string;
  MINDBODY_OAUTH_REDIRECT_URI?: string;
  MINDBODY_OAUTH_SCOPE?: string;
};

export type MindbodyOAuthState = {
  nonce: string;
  returnTo: string;
};

const AUTHORIZE_URL = 'https://signin.mindbodyonline.com/connect/authorize';
const TOKEN_URL = 'https://signin.mindbodyonline.com/connect/token';
const DEFAULT_SCOPE = 'offline_access PG.ConsumerActivity.Api.Read';

export function getMindbodyOAuthEnv(context: unknown): MindbodyOAuthEnv {
  const ctxEnv = (context as {env?: MindbodyOAuthEnv})?.env;
  const procEnv =
    typeof process !== 'undefined'
      ? (process.env as MindbodyOAuthEnv)
      : undefined;

  return {
    MINDBODY_OAUTH_CLIENT_ID:
      ctxEnv?.MINDBODY_OAUTH_CLIENT_ID ??
      procEnv?.MINDBODY_OAUTH_CLIENT_ID ??
      '',
    MINDBODY_OAUTH_CLIENT_SECRET:
      ctxEnv?.MINDBODY_OAUTH_CLIENT_SECRET ??
      procEnv?.MINDBODY_OAUTH_CLIENT_SECRET ??
      '',
    MINDBODY_OAUTH_REDIRECT_URI:
      ctxEnv?.MINDBODY_OAUTH_REDIRECT_URI ??
      procEnv?.MINDBODY_OAUTH_REDIRECT_URI ??
      '',
    MINDBODY_OAUTH_SCOPE:
      ctxEnv?.MINDBODY_OAUTH_SCOPE ?? procEnv?.MINDBODY_OAUTH_SCOPE ?? '',
  };
}

export function isMindbodyOAuthConfigured(env: MindbodyOAuthEnv) {
  return Boolean(
    env.MINDBODY_OAUTH_CLIENT_ID && env.MINDBODY_OAUTH_REDIRECT_URI,
  );
}

export function createMindbodyState(returnTo: string): MindbodyOAuthState {
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return {nonce: random, returnTo};
}

export function encodeMindbodyState(state: MindbodyOAuthState) {
  return `gigi:${encodeURIComponent(state.nonce)}:${encodeURIComponent(
    state.returnTo,
  )}`;
}

export function decodeMindbodyState(value: string | null) {
  if (!value?.startsWith('gigi:')) return null;
  const [, nonce, returnTo] = value.split(':');
  if (!nonce || !returnTo) return null;

  return {
    nonce: decodeURIComponent(nonce),
    returnTo: decodeURIComponent(returnTo),
  };
}

export function buildMindbodyAuthorizeUrl(
  env: MindbodyOAuthEnv,
  state: MindbodyOAuthState,
) {
  const url = new URL(AUTHORIZE_URL);
  url.searchParams.set('client_id', env.MINDBODY_OAUTH_CLIENT_ID ?? '');
  url.searchParams.set('redirect_uri', env.MINDBODY_OAUTH_REDIRECT_URI ?? '');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('response_mode', 'query');
  url.searchParams.set('scope', env.MINDBODY_OAUTH_SCOPE || DEFAULT_SCOPE);
  url.searchParams.set('state', encodeMindbodyState(state));
  url.searchParams.set('nonce', state.nonce);
  return url;
}

export async function exchangeMindbodyCode({
  code,
  env,
}: {
  code: string;
  env: MindbodyOAuthEnv;
}) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    client_id: env.MINDBODY_OAUTH_CLIENT_ID ?? '',
    redirect_uri: env.MINDBODY_OAUTH_REDIRECT_URI ?? '',
  });

  if (env.MINDBODY_OAUTH_CLIENT_SECRET) {
    body.set('client_secret', env.MINDBODY_OAUTH_CLIENT_SECRET);
  }

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body,
  });

  const data = (await response.json().catch(() => ({}))) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    error?: string;
    error_description?: string;
  };

  if (!response.ok || !data.access_token) {
    throw new Error(
      data.error_description || data.error || 'Mindbody token exchange failed',
    );
  }

  return data;
}

export function redirectToMindbodyFallback(returnTo: string) {
  const fallback = new URL('https://account.mindbodyonline.com/');
  fallback.searchParams.set('return_to', returnTo);
  return redirect(fallback.toString());
}
