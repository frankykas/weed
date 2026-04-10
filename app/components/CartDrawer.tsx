import {useState} from 'react';

// ============================================================
//  TYPES
// ============================================================

interface CartItem {
  id: string;
  title: string;
  variant: string;
  strain: string;
  price: string;
  quantity: number;
  image: string;
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  className?: string;
}

// ============================================================
//  MOCK DATA
// ============================================================

const MOCK_ITEMS: CartItem[] = [
  {
    id: '1',
    title: 'Kali Mist',
    variant: '3.5g — Sativa',
    strain: 'Sativa',
    price: '$42.00',
    quantity: 1,
    image: '/bud.webp',
  },
  {
    id: '2',
    title: 'Granddaddy Purple',
    variant: '7g — Indica',
    strain: 'Indica',
    price: '$85.00',
    quantity: 1,
    image: '/bud.webp',
  },
  {
    id: '3',
    title: 'Wedding Cake',
    variant: '1g — Hybrid',
    strain: 'Hybrid',
    price: '$15.00',
    quantity: 2,
    image: '/bud.webp',
  },
];

const STRAIN_DOT: Record<string, string> = {
  Sativa: 'bg-amber-400',
  Indica: 'bg-violet-400',
  Hybrid: 'bg-emerald-400',
  CBD: 'bg-sky-400',
};

// ============================================================
//  ICONS
// ============================================================

function CloseIcon() {
  return (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  );
}

function LeafOutlineIcon() {
  return (
    <svg className="size-8 text-tertiary" viewBox="0 0 24 24" fill="none" strokeWidth={1.2} stroke="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  );
}

// ============================================================
//  CART DRAWER
// ============================================================

export function CartDrawer({open, onClose, className = ''}: CartDrawerProps) {
  const [items, setItems] = useState(MOCK_ITEMS);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {...item, quantity: Math.max(1, item.quantity + delta)}
          : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return sum + price * item.quantity;
  }, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-50
          bg-black/50 backdrop-blur-sm
          transition-opacity duration-300 ease-[var(--ease-in-out)]
          ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`
          fixed inset-x-0 bottom-0 z-50
          sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[400px]
          transition-transform duration-300 ease-[var(--ease-out)]
          ${open
            ? 'translate-y-0 sm:translate-x-0'
            : 'translate-y-full sm:translate-y-0 sm:translate-x-full'}
          ${className}
        `}
      >
        <div className="relative flex flex-col h-[85dvh] sm:h-full bg-surface rounded-t-2xl sm:rounded-none shadow-overlay">
          {/* Drag handle — mobile only */}
          <div className="flex justify-center pt-2 pb-0 sm:hidden">
            <div className="w-9 h-1 rounded-full bg-border" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-3 pb-3 sm:pt-5">
            <div>
              <h2 className="text-base font-bold text-primary">Your Bag</h2>
              <p className="text-xs text-tertiary">
                {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="size-8 flex items-center justify-center rounded-full bg-surface-sunken text-secondary hover:text-primary transition-colors"
            >
              <CloseIcon />
            </button>
          </div>

          <hr className="border-border-light mx-5" />

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {items.length === 0 ? (
              <EmptyState />
            ) : (
              <ul className="space-y-0">
                {items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onIncrement={() => updateQuantity(item.id, 1)}
                    onDecrement={() => updateQuantity(item.id, -1)}
                    onRemove={() => removeItem(item.id)}
                  />
                ))}
              </ul>
            )}
          </div>

          {/* Summary */}
          {items.length > 0 && (
            <div className="shrink-0 border-t border-border-light px-5 pt-4 pb-5">
              {/* Promo */}
              <button
                type="button"
                className="
                  w-full flex items-center justify-between
                  px-3.5 py-2.5 mb-4
                  bg-surface-sunken rounded-xl
                  text-xs text-tertiary
                  hover:text-secondary transition-colors
                "
              >
                <span>Have a promo code?</span>
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>

              {/* Totals */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Subtotal</span>
                  <span className="font-medium text-primary">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Delivery</span>
                  <span className="text-tertiary text-xs">Calculated at checkout</span>
                </div>
                <hr className="border-border-light !my-2.5" />
                <div className="flex justify-between">
                  <span className="text-sm font-bold text-primary">Total</span>
                  <span className="text-lg font-bold text-primary">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout */}
              <button
                type="button"
                className="
                  w-full flex items-center justify-center gap-2
                  h-12
                  bg-accent text-white
                  text-sm font-semibold
                  rounded-full
                  transition-all duration-200 ease-[var(--ease-out)]
                  hover:bg-accent-hover
                  active:scale-[0.98]
                "
              >
                <LockIcon />
                Checkout — ${subtotal.toFixed(2)}
              </button>

              <div className="flex items-center justify-center gap-1.5 mt-3">
                <span className="text-accent"><ShieldIcon /></span>
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
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}) {
  return (
    <li className="flex gap-3.5 py-4 border-b border-border-light last:border-0">
      {/* Thumb — pastel bg with bud */}
      <div className="shrink-0 size-[72px] rounded-xl overflow-hidden bg-lime-50 flex items-center justify-center">
        <img src={item.image} alt={item.title} className="w-[70%] h-[70%] object-contain" />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-primary leading-snug line-clamp-1">{item.title}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`size-2 rounded-full ${STRAIN_DOT[item.strain] ?? 'bg-tertiary'}`} />
              <p className="text-xs text-tertiary">{item.variant}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 p-0.5 text-tertiary hover:text-error transition-colors"
            aria-label={`Remove ${item.title}`}
          >
            <TrashIcon />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2">
          {/* Stepper */}
          <div className="inline-flex items-center bg-surface-sunken rounded-lg">
            <button
              type="button"
              onClick={onDecrement}
              disabled={item.quantity <= 1}
              className="p-1.5 text-secondary hover:text-primary disabled:opacity-30 transition-colors"
              aria-label="Decrease"
            >
              <MinusIcon />
            </button>
            <span className="min-w-[1.5rem] text-center text-xs font-semibold text-primary">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={onIncrement}
              className="p-1.5 text-secondary hover:text-primary transition-colors"
              aria-label="Increase"
            >
              <PlusIcon />
            </button>
          </div>

          <span className="text-sm font-bold text-accent">{item.price}</span>
        </div>
      </div>
    </li>
  );
}

// ============================================================
//  EMPTY STATE
// ============================================================

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="size-16 rounded-full bg-surface-sunken flex items-center justify-center mb-5">
        <LeafOutlineIcon />
      </div>
      <h3 className="text-base font-bold text-primary mb-1">Your bag is empty</h3>
      <p className="text-sm text-tertiary max-w-[220px] mb-6">
        Browse our selection and find your perfect strain.
      </p>
      <button
        type="button"
        className="
          px-6 py-2.5
          bg-accent text-white
          text-sm font-medium
          rounded-full
          transition-all duration-200 ease-[var(--ease-out)]
          hover:bg-accent-hover
          active:scale-[0.97]
        "
      >
        Start Shopping
      </button>
    </div>
  );
}
