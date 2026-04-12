import {Link} from 'react-router';
import {useCart, type CartLine} from '~/lib/mockCart';

// ============================================================
//  STRAIN DOT COLORS
// ============================================================

const STRAIN_DOT: Record<string, string> = {
  Sativa: 'bg-amber-400',
  Indica: 'bg-violet-400',
  Hybrid: 'bg-emerald-400',
  CBD: 'bg-sky-400',
};

// ============================================================
//  CART DRAWER
// ============================================================

export function CartDrawer() {
  const {
    lines,
    isOpen,
    closeCart,
    updateQuantity,
    removeLine,
    subtotal,
    totalQuantity,
    lastAddedId,
  } = useCart();

  const FREE_SHIPPING_THRESHOLD = 50;
  const progress = Math.min(1, subtotal / FREE_SHIPPING_THRESHOLD);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close cart"
        tabIndex={isOpen ? 0 : -1}
        onClick={closeCart}
        className={`
          fixed inset-0 z-[70]
          bg-black/50 backdrop-blur-sm
          transition-opacity duration-300 ease-[var(--ease-in-out)]
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `.trim()}
      />

      {/* Panel */}
      <div
        className={`
          fixed inset-x-0 bottom-0 z-[70]
          sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[420px]
          transition-transform duration-300 ease-[var(--ease-out)]
          ${
            isOpen
              ? 'translate-y-0 sm:translate-x-0'
              : 'translate-y-full sm:translate-y-0 sm:translate-x-full'
          }
        `.trim()}
        aria-hidden={!isOpen}
      >
        <div className="relative flex flex-col h-[88dvh] sm:h-full bg-surface rounded-t-3xl sm:rounded-none shadow-overlay">
          {/* Mobile grab handle */}
          <div className="flex justify-center pt-2 pb-0 sm:hidden">
            <div className="w-9 h-1 rounded-full bg-border" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-3 pb-4 sm:pt-5">
            <div>
              <h2 className="text-base font-bold text-primary">Your Bag</h2>
              <p className="text-xs text-tertiary">
                {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
              </p>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="size-9 flex items-center justify-center rounded-xl bg-surface-sunken text-secondary hover:text-primary transition-colors active:scale-90"
              aria-label="Close cart"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Free shipping progress */}
          {lines.length > 0 && (
            <div className="px-5 pb-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-xs text-secondary">
                  <TruckIcon className="size-3.5 text-accent" />
                  {amountToFreeShipping > 0 ? (
                    <span>
                      Add{' '}
                      <span className="font-bold text-primary">
                        ${amountToFreeShipping.toFixed(2)}
                      </span>{' '}
                      for free delivery
                    </span>
                  ) : (
                    <span className="font-bold text-accent">
                      You unlocked free delivery!
                    </span>
                  )}
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-surface-sunken overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-lime-400 via-emerald-500 to-teal-500 transition-all duration-500 ease-[var(--ease-out)]"
                  style={{width: `${progress * 100}%`}}
                />
              </div>
            </div>
          )}

          <hr className="border-border-light mx-5" />

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {lines.length === 0 ? (
              <EmptyState onClose={closeCart} />
            ) : (
              <ul className="space-y-0">
                {lines.map((line) => (
                  <CartItemRow
                    key={line.id}
                    line={line}
                    justAdded={line.id === lastAddedId}
                    onIncrement={() =>
                      updateQuantity(line.id, line.quantity + 1)
                    }
                    onDecrement={() =>
                      updateQuantity(line.id, line.quantity - 1)
                    }
                    onRemove={() => removeLine(line.id)}
                  />
                ))}
              </ul>
            )}
          </div>

          {/* Summary */}
          {lines.length > 0 && (
            <div className="shrink-0 border-t border-border-light px-5 pt-4 pb-5 bg-surface">
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Subtotal</span>
                  <span className="font-semibold text-primary">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Delivery</span>
                  <span className="text-xs text-tertiary">
                    {amountToFreeShipping > 0
                      ? 'Calculated at checkout'
                      : 'Free'}
                  </span>
                </div>
                <hr className="border-border-light !my-2.5" />
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-primary">Total</span>
                  <span className="text-xl font-bold text-primary">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                onClick={closeCart}
                className="
                  w-full flex items-center justify-center gap-2
                  h-12
                  bg-accent text-white
                  text-sm font-bold
                  rounded-2xl shadow-card
                  transition-all duration-200 ease-[var(--ease-out)]
                  hover:shadow-raised hover:bg-accent-hover
                  active:scale-[0.98]
                "
              >
                <LockIcon />
                Checkout — ${subtotal.toFixed(2)}
              </Link>

              <div className="flex items-center justify-center gap-1.5 mt-3">
                <ShieldIcon className="size-3.5 text-accent" />
                <p className="text-[0.6rem] text-tertiary">
                  Discreet packaging &middot; ID verified delivery
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ============================================================
//  CART ITEM ROW
// ============================================================

function CartItemRow({
  line,
  justAdded,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  line: CartLine;
  justAdded: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}) {
  return (
    <li
      className={`
        flex gap-3.5 py-4 border-b border-border-light last:border-0
        ${justAdded ? 'animate-cart-pop' : ''}
      `.trim()}
    >
      {/* Thumb */}
      <div className="shrink-0 size-[76px] rounded-xl overflow-hidden bg-lime-50 flex items-center justify-center relative">
        <div className="absolute inset-2 rounded-[40%_60%_55%_45%/50%_40%_60%_50%] bg-lime-200/40" />
        <img
          src={line.image}
          alt={line.title}
          className="relative z-10 w-[72%] h-[72%] object-contain drop-shadow"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-primary leading-snug line-clamp-1">
              {line.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`size-2 rounded-full ${STRAIN_DOT[line.strain] ?? 'bg-tertiary'}`}
              />
              <p className="text-xs text-tertiary">
                {line.weight} &middot; {line.strain}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 p-1 rounded-lg text-tertiary hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label={`Remove ${line.title}`}
          >
            <TrashIcon />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Stepper */}
          <div className="inline-flex items-center bg-surface-sunken rounded-xl border border-border-light">
            <button
              type="button"
              onClick={onDecrement}
              className="p-1.5 text-secondary hover:text-primary active:scale-90 transition-all"
              aria-label="Decrease quantity"
            >
              <MinusIcon />
            </button>
            <span className="min-w-[1.75rem] text-center text-xs font-bold text-primary tabular-nums">
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={onIncrement}
              className="p-1.5 text-secondary hover:text-primary active:scale-90 transition-all"
              aria-label="Increase quantity"
            >
              <PlusIcon />
            </button>
          </div>

          <span className="text-sm font-bold text-accent tabular-nums">
            ${(line.unitPriceValue * line.quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </li>
  );
}

// ============================================================
//  EMPTY STATE
// ============================================================

function EmptyState({onClose}: {onClose: () => void}) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-8">
      <div className="size-20 rounded-2xl bg-gradient-to-br from-lime-100 to-emerald-100 flex items-center justify-center mb-5">
        <LeafOutlineIcon />
      </div>
      <h3 className="text-base font-bold text-primary mb-1">
        Your bag is empty
      </h3>
      <p className="text-sm text-tertiary max-w-[240px] mb-6 leading-relaxed">
        Browse our selection and find your perfect strain.
      </p>
      <Link
        to="/collections/all"
        onClick={onClose}
        className="
          px-5 py-2.5
          bg-accent text-white
          text-sm font-semibold
          rounded-xl shadow-card
          transition-all duration-200 ease-[var(--ease-out)]
          hover:bg-accent-hover hover:shadow-raised
          active:scale-[0.97]
        "
      >
        Start shopping
      </Link>
    </div>
  );
}

// ============================================================
//  ICONS
// ============================================================

function CloseIcon() {
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
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      className="size-3.5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      className="size-3.5"
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
  );
}

function TrashIcon() {
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
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      />
    </svg>
  );
}

function LockIcon() {
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
        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    </svg>
  );
}

function LeafOutlineIcon() {
  return (
    <svg
      className="size-9 text-accent"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.4}
      stroke="currentColor"
    >
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
    </svg>
  );
}

function ShieldIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
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

function TruckIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9-1.5h.375a1.125 1.125 0 0 0 1.125-1.125V9.75m0 0V6.375c0-.621.504-1.125 1.125-1.125H14.25M2.25 15.75v1.5c0 .414.336.75.75.75H5.25m9-12h2.67c.483 0 .933.253 1.183.666l2.67 4.44c.173.287.263.615.263.948v3.446c0 .414-.336.75-.75.75h-1.5m-14.25 0H3M16.5 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0"
      />
    </svg>
  );
}
