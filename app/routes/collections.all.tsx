import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/collections.all';
import {getAllMockProducts, type MockProduct} from '~/lib/mockCatalog';
import {CollectionControls} from '~/components/CollectionControls';
import {CollectionProductCard} from '~/components/CollectionProductCard';
import {
  InlinePromoCard,
  QuickEffectsBar,
  StrainFinderCTA,
  ValuePropsStrip,
} from '~/components/CollectionExtras';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Greenly — All Products'}];
};

export async function loader() {
  return {products: getAllMockProducts()};
}

// ============================================================
//  PAGE
// ============================================================

export default function AllProducts() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="max-w-content mx-auto px-gutter pb-section">
      {/* Header */}
      <div className="pt-6 pb-4 sm:pt-8">
        <div className="flex items-center gap-2 text-xs text-tertiary mb-2">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRightIcon />
          <span className="text-primary font-medium">All Products</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight mb-1">
          All Products
        </h1>
        <p className="text-sm text-secondary leading-relaxed max-w-xl">
          Browse our full selection of premium cannabis —{' '}
          {products.length} items in stock.
        </p>
      </div>

      {/* Trust strip */}
      <ValuePropsStrip />

      {/* Controls + product grid */}
      <CollectionControls
        products={products}
        showCategoryFilter
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
    </div>
  );
}

function ProductGridWithPromo({filtered}: {filtered: MockProduct[]}) {
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
