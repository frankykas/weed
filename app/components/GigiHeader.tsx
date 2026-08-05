import {useState} from 'react';
import {useCart} from '~/lib/mockCart';

const img = (name: string) => `/gigi/${name}`;

/**
 * The shared GIGI page header — logo, bag with a live line count, and the
 * button that opens the slide-in menu.
 *
 * Most pages still carry their own copy of this markup behind a page-specific
 * class prefix (`gigi-shop-header`, `gigi-pd-header`, ...). Those are all the
 * same lockup, so new pages should use this instead.
 *
 * `tone="light"` is for pages sitting on the burgundy background, where the
 * burgundy logo and ink would disappear.
 */
export function GigiHeader({tone = 'dark'}: {tone?: 'dark' | 'light'}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {totalQuantity} = useCart();
  const isLight = tone === 'light';

  return (
    <>
      <GigiNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <header className={`gigi-header ${isLight ? 'is-light' : ''}`}>
        <a className="gigi-header__logo" href="/" aria-label="GIGI home">
          <img
            src={img(isLight ? 'gigi-logo-cream.png' : 'gigi-logo-burgundy.png')}
            alt="GIGI"
          />
        </a>
        <div className="gigi-header__actions">
          <a
            className="gigi-header__bag"
            href="/cart"
            aria-label={`Cart, ${totalQuantity} items`}
          >
            <BagIcon />
            {totalQuantity > 0 && (
              <span className="gigi-header__bag-count">{totalQuantity}</span>
            )}
          </a>
          <button
            className="gigi-header__menu"
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            aria-controls="gigi-menu"
          >
            Menu
          </button>
        </div>
      </header>
    </>
  );
}

export function GigiNav({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <nav
      className={`gigi-menu-popover ${isOpen ? 'is-open' : ''}`}
      id="gigi-menu"
      aria-hidden={!isOpen}
    >
      <div className="gigi-menu-actions">
        <button type="button" onClick={onClose} aria-label="Close menu">
          <span />
          <span />
        </button>
        <div>
          <a href="/cart" aria-label="Cart" onClick={onClose}>
            <BagIcon />
          </a>
          <a href="/profile" aria-label="Account" onClick={onClose}>
            <UserIcon />
          </a>
          <a href="/search" aria-label="Search" onClick={onClose}>
            <SearchIcon />
          </a>
        </div>
      </div>
      <a href="/" onClick={onClose}>
        Home
      </a>
      <a href="/about" onClick={onClose}>
        <em>Our</em> Story
      </a>
      <a href="/packages" onClick={onClose}>
        Get Started
      </a>
      <span className="gigi-menu-sub">
        <a href="/packages" onClick={onClose}>
          Classes
        </a>
        <a href="/packages" onClick={onClose}>
          Packages
        </a>
        <a href="/book" onClick={onClose}>
          Book Now
        </a>
      </span>
      <a href="/shop" onClick={onClose}>
        Shop
      </a>
      <a href="/collab" onClick={onClose}>
        Collaborate with Gigi
      </a>
      <a href="/#contact" onClick={onClose}>
        Stay in Touch
      </a>
    </nav>
  );
}

export function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 9V7a4 4 0 0 1 8 0v2" />
      <path d="M5.5 8.5h13l1 12h-15l1-12Z" />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.5 18a7.5 7.5 0 1 1 5.3-2.2L21 21" />
    </svg>
  );
}
