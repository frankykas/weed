import {redirect} from 'react-router';
import type {Route} from './+types/mindbody.login';
import {
  buildMindbodyAuthorizeUrl,
  createMindbodyState,
  getMindbodyOAuthEnv,
  isMindbodyOAuthConfigured,
  redirectToMindbodyFallback,
} from '~/lib/mindbody-oauth.server';

export async function loader({context, request}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const returnTo = url.searchParams.get('return_to') || '/book#book-now';
  const env = getMindbodyOAuthEnv(context);

  if (!isMindbodyOAuthConfigured(env)) {
    return redirectToMindbodyFallback(returnTo);
  }

  const state = createMindbodyState(returnTo);
  const session = (context as any).session;
  session?.set?.('mindbody_oauth_state', state.nonce);

  const headers = new Headers();
  if (session?.isPending && session?.commit) {
    headers.set('Set-Cookie', await session.commit());
  }

  return redirect(buildMindbodyAuthorizeUrl(env, state).toString(), {headers});
}
