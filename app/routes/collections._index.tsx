import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/collections._index';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Greenly — All Collections'}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
  ]);

  return {collections};
}

function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

// ============================================================
//  COLLECTION BG PALETTE
// ============================================================

const COLLECTION_BGS = [
  {bg: 'bg-lime-50', accent: 'from-lime-200/60'},
  {bg: 'bg-purple-50', accent: 'from-purple-200/60'},
  {bg: 'bg-amber-50', accent: 'from-amber-200/60'},
  {bg: 'bg-sky-50', accent: 'from-sky-200/60'},
  {bg: 'bg-rose-50', accent: 'from-rose-200/60'},
  {bg: 'bg-teal-50', accent: 'from-teal-200/60'},
  {bg: 'bg-orange-50', accent: 'from-orange-200/60'},
  {bg: 'bg-violet-50', accent: 'from-violet-200/60'},
];

const COLLECTION_ICONS: Record<string, string> = {
  flower: 'M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z',
  'pre-rolls':
    'M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z',
  edibles:
    'M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Z',
  concentrates:
    'M12 2.25c0 0-6.75 8.25-6.75 12.375a6.75 6.75 0 0 0 13.5 0C18.75 10.5 12 2.25 12 2.25Z',
};

// ============================================================
//  PAGE
// ============================================================

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="max-w-content mx-auto px-gutter pb-section">
      {/* Header */}
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
          Explore our curated categories — from flower and pre-rolls to edibles
          and concentrates.
        </p>
      </div>

      {/* Grid */}
      <PaginatedResourceSection<CollectionFragment>
        connection={collections}
        resourcesClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mt-6"
      >
        {({node: collection, index}) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            index={index}
          />
        )}
      </PaginatedResourceSection>
    </div>
  );
}

// ============================================================
//  COLLECTION CARD
// ============================================================

function CollectionCard({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  const palette = COLLECTION_BGS[index % COLLECTION_BGS.length];

  return (
    <Link
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      className="group block"
    >
      <div
        className={`relative rounded-2xl overflow-hidden ${palette.bg} aspect-[4/3] flex items-center justify-center`}
      >
        {/* Gradient overlay at bottom */}
        <div
          className={`absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t ${palette.accent} to-transparent`}
        />

        {collection.image ? (
          <Image
            alt={collection.image.altText || collection.title}
            data={collection.image}
            loading={index < 3 ? 'eager' : 'lazy'}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="relative z-10 w-[55%] h-[55%] object-contain drop-shadow-lg transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105"
          />
        ) : (
          <div className="relative z-10 flex flex-col items-center gap-2">
            <div className="size-14 rounded-2xl bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-card">
              <svg
                className="size-7 text-accent"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d={
                    COLLECTION_ICONS[collection.handle] ||
                    COLLECTION_ICONS.flower
                  }
                />
              </svg>
            </div>
          </div>
        )}

        {/* Product count badge */}
        <div className="absolute top-3 right-3 z-20 px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-full text-[0.65rem] font-semibold text-primary shadow-xs">
          Shop now
        </div>
      </div>

      <div className="mt-3 px-0.5">
        <h3 className="text-sm font-bold text-primary group-hover:text-accent transition-colors">
          {collection.title}
        </h3>
      </div>
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

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;
