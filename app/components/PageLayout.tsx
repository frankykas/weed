import {Link, NavLink} from 'react-router';
import {useId} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside, useAside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';
import {CartDrawer} from '~/components/CartDrawer';
import {QuickViewModal} from '~/components/QuickViewModal';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartDrawer />
      <QuickViewModal />
      <SearchAside />
      <MobileMenuAside />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main>{children}</main>
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside.Provider>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="Search">
      <div className="predictive-search">
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <div className="flex gap-2">
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search strains, edibles..."
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
                className="flex-1 px-4 py-2.5 bg-surface-sunken rounded-xl text-sm text-primary placeholder:text-tertiary outline-none focus:ring-2 focus:ring-accent/30"
              />
              <button
                onClick={goToSearch}
                className="px-4 py-2.5 bg-accent text-white text-sm font-medium rounded-xl hover:bg-accent-hover transition-colors"
              >
                Go
              </button>
            </div>
          )}
        </SearchFormPredictive>

        <div className="mt-4">
          <SearchResultsPredictive>
            {({items, total, term, state, closeSearch}) => {
              const {articles, collections, pages, products, queries} = items;

              if (state === 'loading' && term.current) {
                return <div className="text-sm text-tertiary py-4">Loading...</div>;
              }

              if (!total) {
                return <SearchResultsPredictive.Empty term={term} />;
              }

              return (
                <>
                  <SearchResultsPredictive.Queries
                    queries={queries}
                    queriesDatalistId={queriesDatalistId}
                  />
                  <SearchResultsPredictive.Products
                    products={products}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Collections
                    collections={collections}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Pages
                    pages={pages}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  <SearchResultsPredictive.Articles
                    articles={articles}
                    closeSearch={closeSearch}
                    term={term}
                  />
                  {term.current && total ? (
                    <Link
                      onClick={closeSearch}
                      to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                      className="block mt-3 text-sm font-medium text-accent hover:underline"
                    >
                      View all results for &ldquo;{term.current}&rdquo; &rarr;
                    </Link>
                  ) : null}
                </>
              );
            }}
          </SearchResultsPredictive>
        </div>
      </div>
    </Aside>
  );
}

// ============================================================
//  MOBILE MENU — Custom cannabis shop menu
// ============================================================

const MENU_SECTIONS = [
  {
    title: 'Shop',
    items: [
      {label: 'All Products', to: '/collections/all', icon: GridIcon},
      {label: 'Flower', to: '/collections/flower', icon: LeafMenuIcon},
      {label: 'Pre-Rolls', to: '/collections/pre-rolls', icon: FireMenuIcon},
      {label: 'Edibles', to: '/collections/edibles', icon: CookieIcon},
      {label: 'Concentrates', to: '/collections/concentrates', icon: DropletIcon},
      {label: 'CBD', to: '/collections/cbd', icon: HeartPulseIcon},
    ],
  },
  {
    title: 'Strains',
    items: [
      {label: 'Sativa', to: '/collections/sativa', badge: 'bg-amber-400 text-amber-950'},
      {label: 'Indica', to: '/collections/indica', badge: 'bg-violet-400 text-violet-950'},
      {label: 'Hybrid', to: '/collections/hybrid', badge: 'bg-emerald-400 text-emerald-950'},
    ],
  },
  {
    title: 'More',
    items: [
      {label: 'About Us', to: '/pages/about'},
      {label: 'Lab Results', to: '/pages/lab-results'},
      {label: 'FAQ', to: '/pages/faq'},
      {label: 'Contact', to: '/pages/contact'},
    ],
  },
];

function MobileMenuAside() {
  return (
    <Aside type="mobile" heading="Menu">
      <MobileMenuContent />
    </Aside>
  );
}

function MobileMenuContent() {
  const {close} = useAside();

  return (
    <div className="flex flex-col gap-6 -mt-2">
      {MENU_SECTIONS.map((section) => (
        <div key={section.title}>
          <p className="text-[0.6rem] font-bold text-tertiary uppercase tracking-widest mb-2 px-1">
            {section.title}
          </p>
          <div className="flex flex-col gap-0.5">
            {section.items.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={close}
                prefetch="intent"
                end
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-surface-sunken transition-colors group"
              >
                {'icon' in item && item.icon && (
                  <span className="size-8 flex items-center justify-center rounded-lg bg-surface-sunken text-secondary group-hover:bg-accent-light group-hover:text-accent transition-colors">
                    <item.icon />
                  </span>
                )}
                {'badge' in item && item.badge && (
                  <span className={`size-3 rounded-full ${item.badge.split(' ')[0]} shrink-0`} />
                )}
                <span className="flex-1">{item.label}</span>
                <svg className="size-4 text-tertiary" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </NavLink>
            ))}
          </div>
        </div>
      ))}

      {/* Account / legal footer */}
      <div className="border-t border-border-light pt-4 mt-2">
        <NavLink
          to="/account"
          onClick={close}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-surface-sunken transition-colors"
        >
          <span className="size-8 flex items-center justify-center rounded-lg bg-surface-sunken text-secondary">
            <UserMenuIcon />
          </span>
          Account
        </NavLink>
        <p className="text-[0.55rem] text-tertiary text-center mt-4 leading-relaxed">
          Must be 21+ to purchase. Valid ID required at delivery.
        </p>
      </div>
    </div>
  );
}

// ============================================================
//  MENU ICONS (small, consistent)
// ============================================================

function GridIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
    </svg>
  );
}

function LeafMenuIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
    </svg>
  );
}

function FireMenuIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z" clipRule="evenodd" />
    </svg>
  );
}

function CookieIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Z" />
    </svg>
  );
}

function DropletIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c0 0-6.75 8.25-6.75 12.375a6.75 6.75 0 0 0 13.5 0C18.75 10.5 12 2.25 12 2.25Z" />
    </svg>
  );
}

function HeartPulseIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  );
}

function UserMenuIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}
