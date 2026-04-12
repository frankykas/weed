import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/collections._index';
import {
  mockCollections,
  mockProducts,
  getProductsForCollection,
  type MockCollection,
} from '~/lib/mockCatalog';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Greenly — All Collections'}];
};

export async function clientLoader() {
  const collections = mockCollections.map((collection) => ({
    ...collection,
    productCount: getProductsForCollection(collection.handle).length,
    previewImage: '/bud.webp',
  }));
  return {
    collections,
    totalProducts: mockProducts.length,
  };
}

type EnrichedCollection = MockCollection & {
  productCount: number;
  previewImage: string;
};

// ============================================================
//  PAGE
// ============================================================

export default function Collections() {
  const {collections, totalProducts} = useLoaderData<typeof clientLoader>();
  const featured = collections[0];
  const rest = collections.slice(1);

  return (
    <div className="max-w-content mx-auto px-gutter pb-section">
      {/* Breadcrumb + header */}
      <div className="pt-6 pb-2 sm:pt-8">
        <div className="flex items-center gap-2 text-xs text-tertiary mb-2">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRightIcon />
          <span className="text-primary font-medium">Collections</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight mb-1">
          Browse Collections
        </h1>
        <p className="text-sm text-secondary leading-relaxed max-w-xl">
          Explore our curated categories — from top-shelf flower and pre-rolls
          to edibles, concentrates, and CBD wellness picks.
        </p>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5 mb-6">
        <StatCard value={String(collections.length)} label="Collections" />
        <StatCard value={String(totalProducts)} label="Products" />
        <StatCard value="4.7★" label="Avg rating" />
      </div>

      {/* Featured hero collection */}
      {featured && <FeaturedCollection collection={featured} />}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-6">
        {rest.map((collection, index) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
//  FEATURED COLLECTION
// ============================================================

function FeaturedCollection({collection}: {collection: EnrichedCollection}) {
  return (
    <Link
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      className="group block"
    >
      <div
        className={`
          relative overflow-hidden rounded-3xl
          bg-gradient-to-br ${collection.accent} via-white to-surface-sunken
          border border-border-light
          px-5 py-6 sm:px-10 sm:py-12
          transition-all duration-300 ease-[var(--ease-out)]
          group-hover:shadow-raised group-hover:-translate-y-0.5
        `}
      >
        <div className="absolute -right-10 -top-10 size-48 rounded-full bg-white/40 blur-3xl" />
        <div className="absolute left-20 -bottom-10 size-40 rounded-full bg-white/30 blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[0.6rem] font-bold tracking-widest uppercase text-accent rounded-full">
              <SparkleIcon className="size-3" />
              Featured
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight mb-2">
              {collection.title}
            </h2>
            <p className="text-sm sm:text-base text-secondary leading-relaxed max-w-lg mb-4">
              {collection.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-white border border-border-light rounded-full text-xs font-semibold text-primary">
                {collection.productCount} products
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-accent text-white rounded-full text-xs font-bold group-hover:gap-2 transition-all duration-200">
                Shop now
                <ArrowRightIcon className="size-3" />
              </span>
            </div>
          </div>
          <div className="relative shrink-0 size-40 sm:size-56">
            <div className="absolute inset-0 rounded-[40%_60%_55%_45%/50%_40%_60%_50%] bg-white/50" />
            <img
              src={collection.previewImage}
              alt={collection.title}
              className="relative z-10 w-full h-full object-contain drop-shadow-xl transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ============================================================
//  COLLECTION CARD
// ============================================================

function CollectionCard({
  collection,
  index,
}: {
  collection: EnrichedCollection;
  index: number;
}) {
  return (
    <Link
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      className="group block"
    >
      <div
        className={`
          relative rounded-3xl overflow-hidden
          bg-gradient-to-br ${collection.accent} via-white to-surface-sunken
          border border-border-light
          aspect-[4/3]
          flex items-center justify-center
          transition-all duration-300 ease-[var(--ease-out)]
          group-hover:shadow-raised group-hover:-translate-y-0.5
        `}
      >
        <div className="absolute -right-6 -top-6 size-28 rounded-full bg-white/40 blur-2xl" />
        <div className="absolute left-6 -bottom-6 size-24 rounded-full bg-white/30 blur-2xl" />

        <img
          src={collection.previewImage}
          alt={collection.title}
          loading={index < 3 ? 'eager' : 'lazy'}
          className="relative z-10 w-[50%] h-[50%] object-contain drop-shadow-xl transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105"
        />

        {/* Badge */}
        <div className="absolute top-3 left-3 z-20 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[0.6rem] font-bold tracking-widest uppercase text-accent">
          {collection.eyebrow}
        </div>
        <div className="absolute top-3 right-3 z-20 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[0.65rem] font-semibold text-primary shadow-xs">
          {collection.productCount}{' '}
          {collection.productCount === 1 ? 'item' : 'items'}
        </div>
      </div>

      <div className="mt-3 px-0.5">
        <h3 className="text-base font-bold text-primary group-hover:text-accent transition-colors">
          {collection.title}
        </h3>
        <p className="text-xs text-tertiary leading-snug line-clamp-2 mt-0.5">
          {collection.description}
        </p>
      </div>
    </Link>
  );
}

function StatCard({value, label}: {value: string; label: string}) {
  return (
    <div className="rounded-2xl border border-border-light bg-surface px-3 py-3 text-center sm:text-left">
      <div className="text-lg sm:text-xl font-bold text-primary leading-none">
        {value}
      </div>
      <div className="text-[0.65rem] sm:text-xs font-medium text-tertiary mt-1 uppercase tracking-wider">
        {label}
      </div>
    </div>
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

function ArrowRightIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
      />
    </svg>
  );
}

function SparkleIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
