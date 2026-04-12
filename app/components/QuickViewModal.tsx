import {useState} from 'react';
import {Link} from 'react-router';
import {useQuickView} from '~/lib/quickView';
import {useCart} from '~/lib/mockCart';
import type {StrainType} from '~/lib/mockCatalog';
import {parsePrice} from '~/lib/collectionFilters';

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
//  MODAL
// ============================================================

export function QuickViewModal() {
  const {product, isOpen, close} = useQuickView();

  if (!product) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        aria-hidden="true"
      >
        <button
          type="button"
          className="absolute inset-0 w-full h-full cursor-default"
          onClick={close}
          aria-label="Close quick view"
          tabIndex={-1}
        />
      </div>

      {/* Panel */}
      <div
        className={`
          fixed inset-0 z-[80] flex items-center justify-center p-4
          pointer-events-none
        `}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Quick view: ${product.title}`}
          className={`
            pointer-events-auto
            relative w-full max-w-[420px] max-h-[90vh]
            bg-surface rounded-3xl shadow-overlay
            overflow-y-auto overflow-x-hidden
            transition-all duration-300 ease-[var(--ease-out)]
            ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}
          `}
        >
          <QuickViewContent product={product} close={close} />
        </div>
      </div>
    </>
  );
}

// ============================================================
//  CONTENT — split to reset state on product change
// ============================================================

function QuickViewContent({
  product,
  close,
}: {
  product: NonNullable<ReturnType<typeof useQuickView>['product']>;
  close: () => void;
}) {
  const {addLine} = useCart();
  const [selectedWeight, setSelectedWeight] = useState(
    product.weights[0]?.label ?? '',
  );
  const [activeTab, setActiveTab] = useState<'description' | 'details'>(
    'description',
  );

  const currentWeight = product.weights.find(
    (w) => w.label === selectedWeight,
  );
  const currentPrice = currentWeight?.price ?? product.price;
  const currentPriceValue = parsePrice(currentPrice);

  const handleAdd = () => {
    addLine(product, selectedWeight);
    close();
  };

  return (
    <>
      {/* ---- Image section ---- */}
      <div className={`relative ${STRAIN_BG[product.strain]} overflow-hidden`}>
        {/* Close button */}
        <button
          type="button"
          onClick={close}
          className="
            absolute top-3.5 left-3.5 z-30
            size-9 flex items-center justify-center
            bg-white/80 backdrop-blur-sm rounded-full
            text-primary shadow-card
            hover:bg-white transition-colors
            active:scale-95
          "
          aria-label="Close"
        >
          <ChevronLeftIcon />
        </button>

        {/* Strain badge */}
        <span
          className={`absolute top-3.5 right-3.5 z-30 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider rounded-full ${STRAIN_BADGE[product.strain]}`}
        >
          {product.strain}
        </span>

        {/* THC badge */}
        <span className="absolute bottom-3.5 right-3.5 z-30 px-2 py-0.5 bg-black/40 backdrop-blur-sm text-[0.6rem] font-bold text-white rounded-lg">
          {product.thc} THC
        </span>

        {/* Image */}
        <div className="relative aspect-[4/3] flex items-center justify-center">
          <div
            className={`absolute inset-8 rounded-[40%_60%_55%_45%/50%_40%_60%_50%] ${STRAIN_BLOB[product.strain]}`}
          />
          <img
            src={product.image}
            alt={product.title}
            className="relative z-10 w-[55%] h-[55%] object-contain drop-shadow-xl"
          />
        </div>
      </div>

      {/* ---- Details section ---- */}
      <div className="px-5 pt-4 pb-5">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((s) => (
              <StarIcon key={s} filled={s <= Math.round(product.rating)} />
            ))}
          </div>
          <span className="text-xs font-semibold text-primary">
            {product.rating}
          </span>
          <span className="text-[0.65rem] text-tertiary">
            ({product.reviewCount})
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-primary tracking-tight leading-tight mb-0.5">
          {product.title}
        </h2>
        <p className="text-xs text-tertiary mb-4">{product.subtitle}</p>

        {/* Tabs */}
        <div className="flex border-b border-border-light mb-3">
          <TabButton
            active={activeTab === 'description'}
            onClick={() => setActiveTab('description')}
          >
            Description
          </TabButton>
          <TabButton
            active={activeTab === 'details'}
            onClick={() => setActiveTab('details')}
          >
            Details
          </TabButton>
        </div>

        {/* Tab content */}
        <div className="mb-5 min-h-[4.5rem]">
          {activeTab === 'description' ? (
            <p className="text-sm text-secondary leading-relaxed line-clamp-4">
              {product.description}
            </p>
          ) : (
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
          )}
        </div>

        {/* Effects */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {product.effects.slice(0, 4).map((effect) => (
            <span
              key={effect}
              className="px-2.5 py-0.5 bg-accent-light text-accent text-[0.65rem] font-medium rounded-full"
            >
              {effect}
            </span>
          ))}
        </div>

        {/* Weight selector */}
        <div className="mb-5">
          <span className="block text-[0.65rem] font-semibold text-secondary uppercase tracking-widest mb-2.5">
            Select size
          </span>
          <div className="flex gap-2">
            {product.weights.map((w) => {
              const active = selectedWeight === w.label;
              return (
                <button
                  key={w.label}
                  type="button"
                  onClick={() => setSelectedWeight(w.label)}
                  className={`
                    flex-1 flex flex-col items-center
                    py-2 px-2
                    rounded-xl text-center
                    transition-all duration-150
                    active:scale-95
                    ${
                      active
                        ? 'bg-accent text-white shadow-card'
                        : 'bg-surface-sunken text-primary hover:bg-border-light'
                    }
                  `}
                >
                  <span className="text-xs font-bold">{w.label}</span>
                  <span
                    className={`text-[0.6rem] mt-0.5 ${active ? 'text-white/70' : 'text-tertiary'}`}
                  >
                    {w.price}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Add to bag */}
        <button
          type="button"
          onClick={handleAdd}
          className="
            w-full flex items-center justify-center gap-2
            h-12
            bg-accent text-white
            text-sm font-semibold
            rounded-full
            transition-all duration-200 ease-[var(--ease-out)]
            hover:bg-accent-hover
            active:scale-[0.98]
            shadow-card
          "
        >
          <BagIcon />
          Add to Bag — {currentPrice}
        </button>

        {/* View full page link */}
        <Link
          to={`/products/${product.handle}`}
          onClick={close}
          className="block mt-3 text-center text-xs font-medium text-accent hover:underline underline-offset-2"
        >
          View full details →
        </Link>
      </div>
    </>
  );
}

// ============================================================
//  SMALL COMPONENTS
// ============================================================

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        pb-2 px-1 mr-4 text-sm font-medium transition-colors
        ${
          active
            ? 'text-primary border-b-2 border-accent'
            : 'text-tertiary hover:text-secondary'
        }
      `}
    >
      {children}
    </button>
  );
}

// ============================================================
//  ICONS
// ============================================================

function ChevronLeftIcon() {
  return (
    <svg
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5 8.25 12l7.5-7.5"
      />
    </svg>
  );
}

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
