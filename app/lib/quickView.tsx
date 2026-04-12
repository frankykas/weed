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

interface QuickViewContextValue {
  product: MockProduct | null;
  isOpen: boolean;
  open: (product: MockProduct) => void;
  close: () => void;
}

const QuickViewContext = createContext<QuickViewContextValue | null>(null);

export function QuickViewProvider({children}: {children: ReactNode}) {
  const [product, setProduct] = useState<MockProduct | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((p: MockProduct) => {
    setProduct(p);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Delay clearing the product so the exit animation plays on real content
    setTimeout(() => setProduct(null), 300);
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setTimeout(() => setProduct(null), 300);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const value = useMemo(
    () => ({product, isOpen, open, close}),
    [product, isOpen, open, close],
  );

  return (
    <QuickViewContext.Provider value={value}>
      {children}
    </QuickViewContext.Provider>
  );
}

export function useQuickView() {
  const ctx = useContext(QuickViewContext);
  if (!ctx) {
    throw new Error('useQuickView must be used within a QuickViewProvider');
  }
  return ctx;
}
