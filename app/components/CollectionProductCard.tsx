import {useState} from 'react';
import {Link} from 'react-router';
import type {MockProduct} from '~/lib/mockCatalog';
import {getSalePercent} from '~/lib/collectionFilters';
import {useCart} from '~/lib/mockCart';
import {useQuickView} from '~/lib/quickView';

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

const STRAIN_BADGE: Record<string, string> = {
  Sativa: 'bg-amber-400 text-amber-950',
  Indica: 'bg-violet-400 text-violet-950',
  Hybrid: 'bg-emerald-400 text-emerald-950',
  CBD: 'bg-sky-400 text-sky-950',
};

interface Props {
  product: MockProduct;
  index: number;
  view?: 'grid' | 'list';
}

export function CollectionProductCard({product, index, view = 'grid'}: Props) {
  if (view === 'list') return <ListCard product={product} index={index} />;
  return <GridCard product={product} index={index} />;
}

function GridCard({product, index}: {product: MockProduct; index: number}) {
  const bg = PASTEL_BGS[index % PASTEL_BGS.length];
  const blob = BLOB_COLORS[index % BLOB_COLORS.length];
  const salePercent = getSalePercent(product.price, product.compareAtPrice);

  return (
    <Link
      to={`/products/${product.handle}`}
      prefetch="intent"
      className="group block"
    >
      <div
        className={`relative rounded-2xl overflow-hidden ${bg} aspect-square flex items-center justify-center mb-2.5`}
      >
        <div
          className={`absolute inset-4 rounded-[40%_60%_55%_45%/50%_40%_60%_50%] ${blob}`}
        />
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="relative z-10 w-[62%] h-[62%] object-contain drop-shadow-lg transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105"
        />

        <span
          className={`absolute top-2.5 left-2.5 z-20 px-2 py-0.5 text-[0.6rem] font-bold rounded-lg ${STRAIN_BADGE[product.strain]}`}
        >
          {product.strain}
        </span>

        {salePercent ? (
          <span className="absolute top-2.5 right-2.5 z-20 px-1.5 py-0.5 bg-red-500 text-[0.6rem] font-bold text-white rounded-lg shadow-card">
            -{salePercent}%
          </span>
        ) : (
          <span className="absolute top-2.5 right-2.5 z-20 px-1.5 py-0.5 bg-black/40 backdrop-blur-sm text-[0.6rem] font-bold text-white rounded-lg">
            {product.thc}
          </span>
        )}

        <WishlistButton />
        <QuickViewButton product={product} />
      </div>

      <h3 className="text-sm font-semibold text-primary leading-snug mb-0.5 line-clamp-1">
        {product.title}
      </h3>
      <p className="text-xs text-tertiary leading-snug line-clamp-1 mb-1">
        {product.subtitle}
      </p>
      <div className="flex items-center gap-1 mb-1">
        <StarIcon className="size-3 text-amber-400" />
        <span className="text-[0.7rem] font-semibold text-primary">
          {product.rating.toFixed(1)}
        </span>
        <span className="text-[0.65rem] text-tertiary">
          ({product.reviewCount})
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-accent">{product.price}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-tertiary line-through">
              {product.compareAtPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function ListCard({product, index}: {product: MockProduct; index: number}) {
  const bg = PASTEL_BGS[index % PASTEL_BGS.length];
  const blob = BLOB_COLORS[index % BLOB_COLORS.length];
  const salePercent = getSalePercent(product.price, product.compareAtPrice);

  return (
    <Link
      to={`/products/${product.handle}`}
      prefetch="intent"
      className="group block"
    >
      <div className="flex gap-4 p-3 rounded-2xl border border-border-light bg-surface hover:border-accent/30 hover:shadow-card transition-all duration-200 ease-[var(--ease-out)]">
        <div
          className={`relative shrink-0 size-24 sm:size-32 rounded-xl overflow-hidden ${bg} flex items-center justify-center`}
        >
          <div
            className={`absolute inset-2 rounded-[40%_60%_55%_45%/50%_40%_60%_50%] ${blob}`}
          />
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="relative z-10 w-[70%] h-[70%] object-contain drop-shadow transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105"
          />
          {salePercent && (
            <span className="absolute top-1.5 right-1.5 z-20 px-1.5 py-0.5 bg-red-500 text-[0.55rem] font-bold text-white rounded-md">
              -{salePercent}%
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start gap-2 mb-1">
            <span
              className={`shrink-0 px-1.5 py-0.5 text-[0.55rem] font-bold rounded-md ${STRAIN_BADGE[product.strain]}`}
            >
              {product.strain}
            </span>
            <span className="shrink-0 px-1.5 py-0.5 bg-surface-sunken text-[0.55rem] font-bold text-secondary rounded-md">
              THC {product.thc}
            </span>
            <div className="flex items-center gap-0.5 ml-auto">
              <StarIcon className="size-3 text-amber-400" />
              <span className="text-[0.7rem] font-semibold text-primary">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-[0.65rem] text-tertiary">
                ({product.reviewCount})
              </span>
            </div>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-primary leading-snug mb-0.5 line-clamp-1 group-hover:text-accent transition-colors">
            {product.title}
          </h3>
          <p className="text-xs text-tertiary leading-snug line-clamp-2 mb-2">
            {product.description}
          </p>

          <div className="hidden sm:flex flex-wrap gap-1 mb-2">
            {product.effects.slice(0, 3).map((effect) => (
              <span
                key={effect}
                className="px-2 py-0.5 bg-surface-sunken text-[0.6rem] font-medium text-secondary rounded-full"
              >
                {effect}
              </span>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-accent">
                {product.price}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-tertiary line-through">
                  {product.compareAtPrice}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <ListQuickViewButton product={product} />
              <ListAddButton product={product} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function WishlistButton() {
  const [liked, setLiked] = useState(false);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        setLiked((v) => !v);
      }}
      className="
        absolute bottom-2.5 left-2.5 z-20
        size-8 flex items-center justify-center
        bg-white/90 backdrop-blur-sm
        rounded-xl shadow-card
        opacity-0 -translate-y-1
        transition-all duration-200 ease-[var(--ease-out)]
        group-hover:opacity-100 group-hover:translate-y-0
        active:scale-90
      "
      aria-label="Save to wishlist"
    >
      <svg
        className={`size-4 ${liked ? 'fill-red-500 text-red-500' : 'fill-none text-primary'}`}
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </svg>
    </button>
  );
}

function QuickViewButton({product}: {product: MockProduct}) {
  const {open} = useQuickView();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        open(product);
      }}
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
      aria-label="Quick view"
    >
      <EyeIcon />
    </button>
  );
}

function ListAddButton({product}: {product: MockProduct}) {
  const {addLine} = useCart();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        addLine(product);
      }}
      className="px-3 py-1.5 bg-accent text-white text-xs font-semibold rounded-lg shadow-card hover:shadow-raised active:scale-95 transition-all duration-200 ease-[var(--ease-out)]"
    >
      Add
    </button>
  );
}

function ListQuickViewButton({product}: {product: MockProduct}) {
  const {open} = useQuickView();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        open(product);
      }}
      className="size-8 flex items-center justify-center rounded-lg border border-border-light text-secondary hover:text-accent hover:border-accent/30 active:scale-95 transition-all duration-200 ease-[var(--ease-out)]"
      aria-label="Quick view"
    >
      <EyeIcon />
    </button>
  );
}

function EyeIcon() {
  return (
    <svg
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}

function StarIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.005Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
