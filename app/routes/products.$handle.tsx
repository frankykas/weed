import {useState} from 'react';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
import {
  getMockProductByHandle,
  getRelatedMockProducts,
  type MockProduct,
  type StrainType,
} from '~/lib/mockCatalog';
import {useCart} from '~/lib/mockCart';
import {useQuickView} from '~/lib/quickView';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `Greenly — ${data?.product.title ?? ''}`},
    {rel: 'canonical', href: `/products/${data?.product.handle}`},
  ];
};

export async function loader({params}: Route.LoaderArgs) {
  const {handle} = params;
  if (!handle) {
    throw new Response('Product not found', {status: 404});
  }

  const product = getMockProductByHandle(handle);
  if (!product) {
    throw new Response(`Product "${handle}" not found`, {status: 404});
  }

  const related = getRelatedMockProducts(handle, 4);
  return {product, related};
}

// ============================================================
//  VISUAL TOKENS
// ============================================================

const STRAIN_BADGE: Record<StrainType, string> = {
  Sativa: 'bg-amber-400 text-amber-950',
  Indica: 'bg-violet-400 text-violet-950',
  Hybrid: 'bg-emerald-400 text-emerald-950',
  CBD: 'bg-teal-400 text-teal-950',
};

const STRAIN_BG: Record<StrainType, string> = {
  Sativa: 'bg-amber-50',
  Indica: 'bg-violet-50',
  Hybrid: 'bg-emerald-50',
  CBD: 'bg-teal-50',
};

const STRAIN_BLOB: Record<StrainType, string> = {
  Sativa: 'bg-amber-200/40',
  Indica: 'bg-violet-200/40',
  Hybrid: 'bg-emerald-200/40',
  CBD: 'bg-teal-200/40',
};

// ============================================================
//  PAGE
// ============================================================

export default function Product() {
  const {product, related} = useLoaderData<typeof loader>();
  const {addLine} = useCart();

  const [selectedWeight, setSelectedWeight] = useState(
    product.weights[0]?.label ?? '',
  );
  const [quantity, setQuantity] = useState(1);
  const [expandedSection, setExpandedSection] = useState<string | null>(
    'description',
  );

  const currentWeight = product.weights.find(
    (w) => w.label === selectedWeight,
  );

  const handleAdd = () => {
    addLine(product, selectedWeight, quantity);
    setQuantity(1);
  };

  return (
    <>
      <div className="max-w-content mx-auto sm:grid sm:grid-cols-[1.1fr_1fr] sm:gap-8 sm:px-gutter sm:pt-block pb-28 sm:pb-section">
        {/* ---- IMAGE COLUMN ---- */}
        <div className="sm:sticky sm:top-[var(--header-height)] sm:self-start">
          <div
            className={`relative aspect-square ${STRAIN_BG[product.strain]} sm:rounded-2xl overflow-hidden flex items-center justify-center`}
          >
            <div
              className={`absolute inset-8 rounded-[40%_60%_55%_45%/50%_40%_60%_50%] ${STRAIN_BLOB[product.strain]}`}
            />
            <img
              src={product.image}
              alt={product.title}
              className="relative z-10 w-[65%] h-[65%] object-contain drop-shadow-xl"
            />

            <span
              className={`absolute top-4 left-4 z-20 px-3 py-1 text-xs font-bold rounded-xl ${STRAIN_BADGE[product.strain]}`}
            >
              {product.strain}
            </span>

            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
              <button
                type="button"
                className="size-9 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl text-secondary hover:text-primary transition-colors shadow-card"
                aria-label="Save to wishlist"
              >
                <HeartIcon />
              </button>
              <button
                type="button"
                className="size-9 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl text-secondary hover:text-primary transition-colors shadow-card"
                aria-label="Share"
              >
                <ShareIcon />
              </button>
            </div>

            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-xl shadow-card">
              <span className="text-accent">
                <ShieldCheckIcon />
              </span>
              <span className="text-[0.6rem] font-bold text-primary uppercase tracking-wide">
                Lab Tested
              </span>
            </div>
          </div>
        </div>

        {/* ---- INFO COLUMN ---- */}
        <div className="px-gutter sm:px-0 sm:py-block">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-tertiary mb-3 pt-4 sm:pt-0">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRightMini />
            <Link
              to={`/collections/${product.category}`}
              className="hover:text-primary transition-colors capitalize"
            >
              {product.category}
            </Link>
            <ChevronRightMini />
            <span className="text-primary font-medium truncate">
              {product.title}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2.5 py-0.5 text-[0.6rem] font-bold rounded-lg ${STRAIN_BADGE[product.strain]}`}
            >
              {product.strain}
            </span>
            <span className="flex items-center gap-1 text-[0.6rem] font-medium text-accent">
              <ShieldCheckIcon /> Verified
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-primary leading-snug tracking-tight mb-1">
            {product.title}
          </h1>
          <p className="text-sm text-tertiary mb-3">{product.subtitle}</p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon
                  key={s}
                  filled={s <= Math.round(product.rating)}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-primary">
              {product.rating}
            </span>
            <span className="text-xs text-tertiary">
              ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-3 mb-5">
            <StatCell label="THC" value={product.thc} />
            <StatCell label="CBD" value={product.cbd} />
            <StatCell label="Type" value={product.strain} />
          </div>

          {/* Effects */}
          <div className="mb-5">
            <span className="block text-xs font-semibold text-primary uppercase tracking-wide mb-2.5">
              Effects
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.effects.map((effect) => (
                <span
                  key={effect}
                  className="px-3 py-1 bg-accent-light text-accent text-xs font-medium rounded-full"
                >
                  {effect}
                </span>
              ))}
            </div>
          </div>

          {/* Terpenes */}
          <div className="mb-5">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wide mb-2.5">
              <FlaskIcon /> Terpenes
            </span>
            <div className="space-y-2">
              {product.terpenes.map((t) => (
                <div key={t.name} className="flex items-center gap-3">
                  <span
                    className={`size-2.5 rounded-full ${t.color} shrink-0`}
                  />
                  <span className="text-sm text-primary flex-1">{t.name}</span>
                  <span className="text-xs font-medium text-tertiary">
                    {t.pct}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-border-light mb-5" />

          {/* Weight */}
          <div className="mb-5">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wide mb-2.5">
              <LeafIcon /> Size
            </span>
            <div className="flex flex-wrap gap-2">
              {product.weights.map((w) => (
                <button
                  key={w.label}
                  type="button"
                  onClick={() => setSelectedWeight(w.label)}
                  className={`
                    flex flex-col items-center
                    min-w-[3.5rem] px-3 py-2
                    rounded-xl text-center
                    transition-all duration-150
                    active:scale-95
                    ${
                      selectedWeight === w.label
                        ? 'bg-accent text-white shadow-card'
                        : 'bg-surface-sunken text-primary hover:bg-border-light'
                    }
                  `}
                >
                  <span className="text-sm font-bold">{w.label}</span>
                  <span
                    className={`text-[0.6rem] mt-0.5 ${selectedWeight === w.label ? 'text-white/70' : 'text-tertiary'}`}
                  >
                    {w.price}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <span className="block text-xs font-semibold text-primary uppercase tracking-wide mb-2.5">
              Quantity
            </span>
            <div className="inline-flex items-center bg-surface-sunken rounded-xl">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="p-2.5 text-secondary hover:text-primary disabled:opacity-30 transition-colors"
                aria-label="Decrease quantity"
              >
                <MinusIcon />
              </button>
              <span className="min-w-[2rem] text-center text-sm font-semibold text-primary tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-2.5 text-secondary hover:text-primary transition-colors"
                aria-label="Increase quantity"
              >
                <PlusIcon />
              </button>
            </div>
          </div>

          {/* Desktop add to cart */}
          <div className="hidden sm:flex items-center gap-3 mb-8">
            <button
              type="button"
              onClick={handleAdd}
              className="
                flex-1 flex items-center justify-center gap-2
                h-12
                bg-accent text-white
                text-sm font-semibold
                rounded-full
                transition-all duration-200 ease-[var(--ease-out)]
                hover:bg-accent-hover
                active:scale-[0.98]
              "
            >
              <BagIcon />
              Add to Bag — {currentWeight?.price ?? product.price}
            </button>
            <button
              type="button"
              className="size-12 flex items-center justify-center rounded-full border border-border-light text-secondary hover:text-primary hover:border-border transition-colors"
              aria-label="Save to wishlist"
            >
              <HeartIcon />
            </button>
          </div>

          <hr className="border-border-light mb-0" />

          {/* Accordions */}
          <Accordion
            title="Description"
            id="description"
            expanded={expandedSection === 'description'}
            onToggle={() =>
              setExpandedSection(
                expandedSection === 'description' ? null : 'description',
              )
            }
          >
            <p className="text-sm text-secondary leading-relaxed">
              {product.description}
            </p>
          </Accordion>

          <Accordion
            title="Details & Growing"
            id="details"
            expanded={expandedSection === 'details'}
            onToggle={() =>
              setExpandedSection(
                expandedSection === 'details' ? null : 'details',
              )
            }
          >
            <ul className="space-y-1.5">
              {product.details.map((d) => (
                <li
                  key={d}
                  className="flex items-start gap-2 text-sm text-secondary"
                >
                  <span className="mt-1.5 size-1 rounded-full bg-accent shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </Accordion>

          <Accordion
            title="Shipping & Legal"
            id="shipping"
            expanded={expandedSection === 'shipping'}
            onToggle={() =>
              setExpandedSection(
                expandedSection === 'shipping' ? null : 'shipping',
              )
            }
          >
            <div className="space-y-2 text-sm text-secondary leading-relaxed">
              <p>
                Discreet packaging. Same-day dispatch on orders placed before
                2pm.
              </p>
              <p>
                Free delivery on orders over $50. Standard delivery 1–3
                business days.
              </p>
              <p>Must be 21+ to purchase. Valid ID required at delivery.</p>
            </div>
          </Accordion>
        </div>
      </div>

      {/* ---- Related products ---- */}
      {related.length > 0 && (
        <div className="max-w-content mx-auto px-gutter pb-6 sm:pb-section">
          <h2 className="text-lg font-bold text-primary tracking-tight mb-4">
            You might also like
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {related.map((r) => (
              <RelatedCard key={r.id} product={r} />
            ))}
          </div>
        </div>
      )}

      {/* ---- Sticky mobile add to bag ---- */}
      <div className="fixed bottom-16 inset-x-0 z-40 sm:hidden pb-[env(safe-area-inset-bottom)]">
        <div className="bg-surface/95 backdrop-blur-xl border-t border-border-light">
          <div className="px-gutter py-2.5 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-primary leading-tight">
                {currentWeight?.price ?? product.price}
              </p>
              <p className="text-[0.6rem] text-tertiary">
                {selectedWeight} — {product.strain}
              </p>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="
                flex items-center justify-center gap-1.5
                px-6 h-11
                bg-accent text-white
                text-sm font-semibold
                rounded-full
                active:scale-[0.97]
              "
            >
              <BagIcon />
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
//  RELATED CARD
// ============================================================

function RelatedCard({product}: {product: MockProduct}) {
  const {open} = useQuickView();
  return (
    <Link to={`/products/${product.handle}`} prefetch="intent" className="group">
      <div
        className={`relative rounded-2xl overflow-hidden ${STRAIN_BG[product.strain]} aspect-square flex items-center justify-center mb-2`}
      >
        <div
          className={`absolute inset-4 rounded-[40%_60%_55%_45%/50%_40%_60%_50%] ${STRAIN_BLOB[product.strain]}`}
        />
        <img
          src={product.image}
          alt={product.title}
          className="relative z-10 w-[62%] h-[62%] object-contain drop-shadow-lg transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105"
        />
        <span
          className={`absolute top-2.5 left-2.5 z-20 px-2 py-0.5 text-[0.6rem] font-bold rounded-lg ${STRAIN_BADGE[product.strain]}`}
        >
          {product.strain}
        </span>
        <span className="absolute top-2.5 right-2.5 z-20 px-1.5 py-0.5 bg-black/40 backdrop-blur-sm text-[0.6rem] font-bold text-white rounded-lg">
          {product.thc} THC
        </span>

        {/* Quick View hover button */}
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
          <EyeSmallIcon />
        </button>
      </div>
      <h3 className="text-sm font-semibold text-primary leading-snug mb-0.5 group-hover:text-accent transition-colors">
        {product.title}
      </h3>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-accent">{product.price}</span>
        <span className="text-[0.6rem] text-tertiary font-medium">
          ★ {product.rating}
        </span>
      </div>
    </Link>
  );
}

function EyeSmallIcon() {
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

// ============================================================
//  STAT CELL
// ============================================================

function StatCell({label, value}: {label: string; value: string}) {
  return (
    <div className="flex-1 bg-surface-sunken rounded-xl px-3.5 py-2.5 text-center">
      <p className="text-[0.6rem] font-medium text-tertiary uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className="text-lg font-bold text-primary">{value}</p>
    </div>
  );
}

// ============================================================
//  ACCORDION
// ============================================================

function Accordion({
  title,
  id,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  id: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border-light">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`section-${id}`}
        className="w-full flex items-center justify-between py-4 text-sm font-medium text-primary"
      >
        {title}
        <ChevronIcon
          className={`text-tertiary transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        id={`section-${id}`}
        className={`
          overflow-hidden transition-all duration-300 ease-[var(--ease-out)]
          ${expanded ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 pb-0 opacity-0'}
        `}
      >
        {children}
      </div>
    </div>
  );
}

// ============================================================
//  ICONS
// ============================================================

function StarIcon({filled}: {filled: boolean}) {
  return (
    <svg
      className={`size-3.5 ${filled ? 'text-amber-400' : 'text-border'}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.935-2.186 2.25 2.25 0 0 0-3.935 2.186Z"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
}

function PlusIcon() {
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
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );
}

function ChevronIcon({className = ''}: {className?: string}) {
  return (
    <svg
      className={`size-4 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

function ChevronRightMini() {
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

function ShieldCheckIcon() {
  return (
    <svg
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
      />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
      />
    </svg>
  );
}
