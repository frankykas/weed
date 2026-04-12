import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {
  getMockCollectionByHandle,
  getProductsForCollection,
  mockCollections,
  type MockCollection,
} from '~/lib/mockCatalog';
import {CollectionControls} from '~/components/CollectionControls';
import {CollectionProductCard} from '~/components/CollectionProductCard';
import {
  InlinePromoCard,
  QuickEffectsBar,
  StrainFinderCTA,
  ValuePropsStrip,
} from '~/components/CollectionExtras';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Greenly — ${data?.collection.title ?? 'Collection'}`}];
};

export async function clientLoader({params}: Route.ClientLoaderArgs) {
  const {handle} = params;
  if (!handle) {
    throw new Response('Collection not found', {status: 404});
  }

  const collection = getMockCollectionByHandle(handle);
  if (!collection) {
    throw new Response(`Collection "${handle}" not found`, {status: 404});
  }

  const products = getProductsForCollection(handle);
  const related = mockCollections
    .filter((c) => c.handle !== handle && c.handle !== 'all')
    .slice(0, 4);

  return {collection, products, related};
}

// ============================================================
//  PAGE
// ============================================================

export default function Collection() {
  const {collection, products, related} = useLoaderData<typeof clientLoader>();

  return (
    <div className="max-w-content mx-auto px-gutter pb-section">
      {/* Breadcrumb */}
      <div className="pt-6 sm:pt-8">
        <div className="flex items-center gap-2 text-xs text-tertiary mb-4">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRightIcon />
          <Link
            to="/collections"
            className="hover:text-primary transition-colors"
          >
            Collections
          </Link>
          <ChevronRightIcon />
          <span className="text-primary font-medium">{collection.title}</span>
        </div>

        {/* Hero card */}
        <div
          className={`
            relative overflow-hidden rounded-3xl
            bg-gradient-to-br ${collection.accent} via-white to-surface-sunken
            border border-border-light
            px-5 py-6 sm:px-8 sm:py-10
            mb-6
          `}
        >
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/40 blur-2xl" />
          <div className="absolute right-20 -bottom-10 size-32 rounded-full bg-white/30 blur-2xl" />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-block mb-2 px-2.5 py-1 bg-white/80 backdrop-blur-sm text-[0.6rem] font-bold tracking-widest uppercase text-accent rounded-full">
              {collection.eyebrow}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight mb-2">
              {collection.title}
            </h1>
            <p className="text-sm sm:text-base text-secondary leading-relaxed max-w-xl mb-4">
              {collection.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-white border border-border-light rounded-full text-xs font-semibold text-primary">
                {products.length}{' '}
                {products.length === 1 ? 'product' : 'products'}
              </span>
              <span className="px-3 py-1 bg-white border border-border-light rounded-full text-xs font-medium text-secondary">
                Lab tested
              </span>
              <span className="px-3 py-1 bg-white border border-border-light rounded-full text-xs font-medium text-secondary">
                Free shipping $50+
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <ValuePropsStrip />

      {/* Controls + product grid */}
      <CollectionControls
        products={products}
        renderBeforeToolbar={({filters, setFilters, facets}) => (
          <QuickEffectsBar
            filters={filters}
            setFilters={setFilters}
            facets={facets}
          />
        )}
      >
        {({filtered, view, resetFilters, hasActiveFilters}) => (
          <>
            {filtered.length === 0 ? (
              <EmptyState
                onReset={hasActiveFilters ? resetFilters : undefined}
              />
            ) : view === 'list' ? (
              <div className="flex flex-col gap-3">
                {filtered.map((product, index) => (
                  <CollectionProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    view="list"
                  />
                ))}
              </div>
            ) : (
              <ProductGridWithPromo filtered={filtered} />
            )}
          </>
        )}
      </CollectionControls>

      {/* Strain Finder CTA */}
      <StrainFinderCTA />

      {/* Related collections */}
      {related.length > 0 && (
        <RelatedCollections collections={related} />
      )}
    </div>
  );
}

// ============================================================
//  PRODUCT GRID WITH INLINE PROMO
//  Inserts the promo card at position 4 if there are enough products
// ============================================================

function ProductGridWithPromo({
  filtered,
}: {
  filtered: ReturnType<typeof getProductsForCollection>;
}) {
  const PROMO_INDEX = 4;
  const showPromo = filtered.length >= PROMO_INDEX;
  const head = showPromo ? filtered.slice(0, PROMO_INDEX) : filtered;
  const tail = showPromo ? filtered.slice(PROMO_INDEX) : [];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5">
      {head.map((product, index) => (
        <CollectionProductCard
          key={product.id}
          product={product}
          index={index}
        />
      ))}
      {showPromo && <InlinePromoCard />}
      {tail.map((product, index) => (
        <CollectionProductCard
          key={product.id}
          product={product}
          index={index + PROMO_INDEX}
        />
      ))}
    </div>
  );
}

// ============================================================
//  RELATED COLLECTIONS
// ============================================================

function RelatedCollections({collections}: {collections: MockCollection[]}) {
  return (
    <section className="mt-12 pt-10 border-t border-border-light">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary tracking-tight">
            Keep browsing
          </h2>
          <p className="text-sm text-tertiary">
            More collections you might like
          </p>
        </div>
        <Link
          to="/collections"
          className="text-xs sm:text-sm font-semibold text-accent hover:underline underline-offset-2"
        >
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {collections.map((c) => (
          <Link
            key={c.id}
            to={`/collections/${c.handle}`}
            prefetch="intent"
            className="group block"
          >
            <div
              className={`
                relative overflow-hidden rounded-2xl
                bg-gradient-to-br ${c.accent} via-white to-surface-sunken
                border border-border-light
                aspect-[4/3] p-4
                transition-all duration-300 ease-[var(--ease-out)]
                group-hover:shadow-raised group-hover:-translate-y-0.5
              `}
            >
              <div className="absolute -right-4 -top-4 size-20 rounded-full bg-white/40 blur-xl" />
              <div className="relative z-10 flex flex-col h-full">
                <span className="inline-block self-start px-2 py-0.5 bg-white/90 backdrop-blur-sm text-[0.55rem] font-bold tracking-widest uppercase text-accent rounded-full mb-auto">
                  {c.eyebrow}
                </span>
                <div>
                  <h3 className="text-base font-bold text-primary group-hover:text-accent transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-[0.65rem] text-tertiary">
                    {c.productHandles.length}{' '}
                    {c.productHandles.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ============================================================
//  EMPTY STATE
// ============================================================

function EmptyState({onReset}: {onReset?: () => void}) {
  return (
    <div className="text-center py-16 px-4">
      <div className="inline-flex size-16 rounded-2xl bg-surface-sunken items-center justify-center mb-4">
        <svg
          className="size-7 text-tertiary"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 15.75 21 21m-4.5-10.5a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-primary mb-1">
        No products found
      </h3>
      <p className="text-sm text-tertiary mb-4 max-w-xs mx-auto">
        Try removing a filter or two — you might find something you like.
      </p>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 bg-accent text-white text-sm font-semibold rounded-xl shadow-card hover:shadow-raised active:scale-95 transition-all duration-200 ease-[var(--ease-out)]"
        >
          Reset filters
        </button>
      )}
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      className="size-3 text-border"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.25 4.5 7.5 7.5-7.5 7.5"
      />
    </svg>
  );
}
