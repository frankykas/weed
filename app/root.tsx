import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
} from 'react-router';
import favicon from '~/assets/favicon.svg';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import {PageLayout} from './components/PageLayout';
import {CartProvider} from '~/lib/mockCart';
import {QuickViewProvider} from '~/lib/quickView';

export const shouldRevalidate: ShouldRevalidateFunction = () => false;

export function links() {
  return [{rel: 'icon', type: 'image/svg+xml', href: favicon}];
}

export function HydrateFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-bg">
      <div className="size-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function Layout({children}: {children?: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <CartProvider>
      <QuickViewProvider>
        <PageLayout
          header={null as any}
          footer={null as any}
          isLoggedIn={Promise.resolve(false)}
          cart={Promise.resolve(null)}
          publicStoreDomain=""
        >
          <Outlet />
        </PageLayout>
      </QuickViewProvider>
    </CartProvider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}
