import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {MockProduct} from '~/lib/mockCatalog';
import {parsePrice} from '~/lib/collectionFilters';

// ============================================================
//  TYPES
// ============================================================

export interface CartLine {
  id: string;
  productHandle: string;
  title: string;
  subtitle: string;
  strain: string;
  image: string;
  weight: string;
  unitPrice: string;
  unitPriceValue: number;
  quantity: number;
}

interface CartContextValue {
  lines: CartLine[];
  totalQuantity: number;
  subtotal: number;
  isOpen: boolean;
  lastAddedId: string | null;
  hydrated: boolean;
  addLine: (
    product: MockProduct,
    weightLabel?: string,
    qty?: number,
  ) => void;
  updateQuantity: (id: string, qty: number) => void;
  removeLine: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'greenly:cart:v1';
const ORDER_STORAGE_KEY = 'greenly:lastOrder:v1';

// ============================================================
//  PROVIDER
// ============================================================

export function CartProvider({children}: {children: ReactNode}) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) setLines(parsed);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Persist on every change after hydration
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  // Clear the lastAddedId marker after the animation finishes
  useEffect(() => {
    if (!lastAddedId) return;
    const t = window.setTimeout(() => setLastAddedId(null), 800);
    return () => window.clearTimeout(t);
  }, [lastAddedId]);

  // Lock body scroll while the drawer is open
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  const addLine = useCallback(
    (product: MockProduct, weightLabel?: string, qty = 1) => {
      const weight = weightLabel ?? product.weights[0]?.label ?? 'default';
      const weightOption = product.weights.find((w) => w.label === weight);
      const unitPrice = weightOption?.price ?? product.price;
      const unitPriceValue = parsePrice(unitPrice);
      const id = `${product.handle}:${weight}`;

      setLines((prev) => {
        const existing = prev.find((line) => line.id === id);
        if (existing) {
          return prev.map((line) =>
            line.id === id
              ? {...line, quantity: line.quantity + qty}
              : line,
          );
        }
        return [
          ...prev,
          {
            id,
            productHandle: product.handle,
            title: product.title,
            subtitle: product.subtitle,
            strain: product.strain,
            image: product.image,
            weight,
            unitPrice,
            unitPriceValue,
            quantity: qty,
          },
        ];
      });
      setLastAddedId(id);
      setIsOpen(true);
    },
    [],
  );

  const updateQuantity = useCallback((id: string, qty: number) => {
    setLines((prev) => {
      if (qty <= 0) return prev.filter((line) => line.id !== id);
      return prev.map((line) =>
        line.id === id ? {...line, quantity: qty} : line,
      );
    });
  }, []);

  const removeLine = useCallback((id: string) => {
    setLines((prev) => prev.filter((line) => line.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setLines([]);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalQuantity = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = lines.reduce(
    (sum, l) => sum + l.unitPriceValue * l.quantity,
    0,
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      totalQuantity,
      subtotal,
      isOpen,
      lastAddedId,
      hydrated,
      addLine,
      updateQuantity,
      removeLine,
      clearCart,
      openCart,
      closeCart,
    }),
    [
      lines,
      totalQuantity,
      subtotal,
      isOpen,
      lastAddedId,
      hydrated,
      addLine,
      updateQuantity,
      removeLine,
      clearCart,
      openCart,
      closeCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}

// ============================================================
//  LAST-ORDER SNAPSHOT (for the confirmation page)
// ============================================================

export interface LastOrder {
  orderNumber: string;
  lines: CartLine[];
  subtotal: number;
  delivery: number;
  tax: number;
  total: number;
  placedAt: string;
  deliveryEstimate: string;
  email: string;
  fullName: string;
  address: string;
  city: string;
  zip: string;
  deliverySlot: string;
  lastFour: string;
}

export function saveLastOrder(order: LastOrder) {
  try {
    window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
  } catch {
    /* ignore */
  }
}

export function loadLastOrder(): LastOrder | null {
  try {
    const raw = window.localStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LastOrder;
  } catch {
    return null;
  }
}
