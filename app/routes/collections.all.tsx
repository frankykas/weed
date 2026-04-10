import {useState} from 'react';
import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/collections.all';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import type {CollectionItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Greenly — All Products'}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
  ]);
  return {products};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

// ============================================================
//  FILTER TABS
// ============================================================

const FILTER_TABS = ['All', 'Sativa', 'Indica', 'Hybrid', 'CBD'] as const;

// ============================================================
//  PAGE
// ============================================================

export default function AllProducts() {
  const {products} = useLoaderData<typeof loader>();
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <div className="max-w-content mx-auto px-gutter pb-section">
      {/* Header */}
      <div className="pt-6 pb-2 sm:pt-8">
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
        <p className="text-sm text-secondary leading-relaxed max-w-xl mb-4">
          Browse our full selection of premium cannabis products.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="overflow-x-auto scrollbar-none -mx-gutter px-gutter">
        <div className="flex gap-2 pb-4">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveFilter(tab)}
              className={`
                shrink-0 px-4 py-2
                rounded-xl text-sm font-medium
                transition-all duration-200 ease-[var(--ease-out)]
                active:scale-95
                ${
                  activeFilter === tab
                    ? 'bg-accent text-white shadow-card'
                    : 'bg-surface text-secondary border border-border-light hover:border-accent/30 hover:text-primary'
                }
              `.trim()}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <PaginatedResourceSection<CollectionItemFragment>
        connection={products}
        resourcesClassName="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5"
      >
        {({node: product, index}) => (
          <CatalogProductCard
            key={product.id}
            product={product}
            index={index}
          />
        )}
      </PaginatedResourceSection>
    </div>
  );
}

// ============================================================
//  PRODUCT CARD
// ============================================================

const PASTEL_BGS = [
  'bg-lime-50',
  'bg-purple-50',
  'bg-amber-50',
  'bg-sky-50',
  'bg-rose-50',
  'bg-teal-50',
  'bg-orange-50',
  'bg-violet-50',
];

const BLOB_COLORS = [
  'bg-lime-200/40',
  'bg-purple-200/40',
  'bg-amber-200/40',
  'bg-sky-200/40',
  'bg-rose-200/40',
  'bg-teal-200/40',
  'bg-orange-200/40',
  'bg-violet-200/40',
];

function CatalogProductCard({
  product,
  index,
}: {
  product: CollectionItemFragment;
  index: number;
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const bg = PASTEL_BGS[index % PASTEL_BGS.length];
  const blob = BLOB_COLORS[index % BLOB_COLORS.length];

  return (
    <Link to={variantUrl} prefetch="intent" className="group block">
      {/* Image */}
      <div
        className={`relative rounded-2xl overflow-hidden ${bg} aspect-square flex items-center justify-center mb-2.5`}
      >
        <div
          className={`absolute inset-4 rounded-[40%_60%_55%_45%/50%_40%_60%_50%] ${blob}`}
        />
        {image ? (
          <Image
            alt={image.altText || product.title}
            data={image}
            loading={index < 8 ? 'eager' : 'lazy'}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="relative z-10 w-[62%] h-[62%] object-contain drop-shadow-lg transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105"
          />
        ) : (
          <div className="relative z-10 w-[62%] h-[62%] flex items-center justify-center">
            <img
              src="/bud.webp"
              alt={product.title}
              className="w-full h-full object-contain drop-shadow-lg transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105"
            />
          </div>
        )}

        {/* Quick add */}
        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className="
            absolute bottom-2.5 right-2.5 z-20
            size-8 flex items-center justify-center
            bg-white/90 backdrop-blur-sm
            rounded-xl shadow-card
            text-accent
            opacity-0 translate-y-1
            transition-all duration-200 ease-[var(--ease-out)]
            group-hover:opacity-100 group-hover:translate-y-0
            active:scale-90
          "
        >
          <svg
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>

      {/* Info */}
      <h3 className="text-sm font-semibold text-primary leading-snug mb-0.5 line-clamp-1">
        {product.title}
      </h3>
      <span className="text-sm font-bold text-accent">
        <Money data={product.priceRange.minVariantPrice} />
      </span>
    </Link>
  );
}

// ============================================================
//  ICONS
// ============================================================

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

// ============================================================
//  GRAPHQL
// ============================================================

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
` as const;

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;
