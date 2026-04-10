import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

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

export function ProductItem({
  product,
  loading,
  index = 0,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
  index?: number;
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const bg = PASTEL_BGS[index % PASTEL_BGS.length];
  const blob = BLOB_COLORS[index % BLOB_COLORS.length];

  return (
    <Link
      className="group block"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
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
            loading={loading ?? (index < 8 ? 'eager' : 'lazy')}
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
