import {memo, useEffect, useRef, useState} from 'react';
import type {Route} from './+types/book';
import bookStyles from '~/styles/gigi-book.css?url';

export function links() {
  return [{rel: 'stylesheet', href: bookStyles}];
}

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Book Now | GIGI'},
    {
      name: 'description',
      content: 'Book your GIGI Lagree class — view the weekly schedule by studio.',
    },
  ];
};

const img = (name: string) => `/gigi/${name}`;

export default function BookPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="gigi-site gigi-book-page">
      <GigiNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <section className="gigi-book">
        <header className="gigi-book-header">
          <a className="gigi-book-logo" href="/" aria-label="GIGI home">
            <img src={img('gigi-logo-brown.png')} alt="GIGI" />
          </a>
          <button
            className="gigi-book-menu"
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            aria-controls="gigi-menu"
          >
            Menu
          </button>
        </header>

        <h1 className="gigi-book-title">Book Now</h1>

        <div className="gigi-book-widget-wrap">
          <MindbodyWidget />
        </div>
      </section>

      <GigiFooter compact />
    </div>
  );
}

/**
 * MindBody Healcode "class_lists" widget (b798508380b). Unlike the branded-web
 * Schedules embed, this one renders its markup inline (no iframe), loading its
 * styles/assets from *.mindbodyonline.com. Rendered once (memo, no props) so
 * React never reconciles the nodes the loader script injects into it.
 */
const MindbodyWidget = memo(function MindbodyWidget() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.innerHTML =
      '<healcode-widget data-type="class_lists" data-widget-partner="object" data-widget-id="b798508380b" data-widget-version="0"></healcode-widget>';
    const SRC = 'https://widgets.mindbodyonline.com/javascripts/healcode.js';
    if (!document.querySelector(`script[src="${SRC}"]`)) {
      const script = document.createElement('script');
      script.src = SRC;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return <div className="gigi-book-widget" ref={hostRef} />;
});

function GigiNav({
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
      <a href="/" onClick={onClose}>Home</a>
      <a href="/about" onClick={onClose}><em>Our</em> Story</a>
      <a href="/packages" onClick={onClose}>Get Started</a>
      <span className="gigi-menu-sub">
        <a href="/packages" onClick={onClose}>Classes</a>
        <a href="/packages" onClick={onClose}>Packages</a>
        <a href="/book" onClick={onClose}>Book Now</a>
      </span>
      <a href="/shop" onClick={onClose}>Shop</a>
      <a href="/collab" onClick={onClose}>Collaborate with Gigi</a>
      <a href="/#contact" onClick={onClose}>Stay in Touch</a>
    </nav>
  );
}

function GigiFooter({compact, dark}: {compact?: boolean; dark?: boolean}) {
  return (
    <footer className={`gigi-footer ${compact ? 'is-compact' : ''} ${dark ? 'is-dark' : ''}`}>
      <div>
        <p>Follow Us</p>
        <div className="gigi-socials"><button>Instagram</button><button>Tik Tok</button></div>
        <p>Join our Newsletter</p>
        <div className="gigi-newsletter">
          <input aria-label="email" placeholder="email" />
          <button>Send</button>
        </div>
        <p>Contact Us</p>
        <small>Studio 00, 01234 St, Dubai, UAE<br />+971 50 111 2222</small>
      </div>
      <img className="gigi-footer-mark" src={img('g-footer.png')} alt="GIGI" />
    </footer>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 9V7a4 4 0 0 1 8 0v2" />
      <path d="M5.5 8.5h13l1 12h-15l1-12Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.5 18a7.5 7.5 0 1 1 5.3-2.2L21 21" />
    </svg>
  );
}
