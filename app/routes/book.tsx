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
 * MindBody Healcode "class_lists" widget (b798508380b). It renders inline (no
 * iframe): a short list of locations, each with a "View Schedule" link that
 * loads that location's real weekly schedule inline.
 *
 * We drive it into the GIGI design: build our own location CTA toggle, load
 * the first location's schedule by default, and swap schedules when another
 * CTA is clicked (by driving the widget's own list/back-to-list links).
 * Rendered once (memo, no props) so React never reconciles the injected nodes.
 */
const MindbodyWidget = memo(function MindbodyWidget() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctaBar = document.createElement('div');
    ctaBar.className = 'gigi-book-loc-cta';
    const host = document.createElement('div');
    host.className = 'gigi-book-widget';
    host.innerHTML =
      '<healcode-widget data-type="class_lists" data-widget-partner="object" data-widget-id="b798508380b" data-widget-version="0"></healcode-widget>';
    root.append(ctaBar, host);

    const SRC = 'https://widgets.mindbodyonline.com/javascripts/healcode.js';
    if (!document.querySelector(`script[src="${SRC}"]`)) {
      const s = document.createElement('script');
      s.src = SRC;
      s.async = true;
      document.body.appendChild(s);
    }

    const shortName = (n: string) =>
      (n.split(/\s[-–—]\s/).pop() || n).trim();
    const listLink = (id: string) =>
      host.querySelector<HTMLAnchorElement>(
        `.class_offered_link a[data-class-id="${id}"]`,
      );
    const backLink = () =>
      Array.from(host.querySelectorAll<HTMLAnchorElement>('a')).find((a) =>
        /back to list/i.test(a.textContent || ''),
      );
    const readLocations = () =>
      Array.from(host.querySelectorAll('.class_show'))
        .map((s) => ({
          id:
            s
              .querySelector('.class_offered_link a[data-class-id]')
              ?.getAttribute('data-class-id') || '',
          name: (s.querySelector('.class_name')?.textContent || '').trim(),
        }))
        .filter((l) => l.id);

    const poll = (fn: () => boolean, tries = 90) => {
      if (fn() || tries <= 0) return;
      window.setTimeout(() => poll(fn, tries - 1), 150);
    };

    // The selected location is driven by ?loc — clicking a CTA reloads with a
    // new ?loc, so each location is a clean single "View Schedule" click (the
    // one interaction the widget performs reliably) rather than an in-place
    // back-and-forth (which the widget doesn't re-trigger cleanly).
    const wantId = new URLSearchParams(window.location.search).get('loc') || '';
    let current = '';

    const renderCtas = (locs: {id: string; name: string}[]) => {
      ctaBar.textContent = '';
      locs.forEach((loc) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = shortName(loc.name);
        b.className =
          'gigi-book-location' + (loc.id === current ? ' is-active' : '');
        b.addEventListener('click', () => {
          if (loc.id === current) return;
          const url = new URL(window.location.href);
          url.searchParams.set('loc', loc.id);
          window.location.assign(url.toString());
        });
        ctaBar.appendChild(b);
      });
    };

    poll(() => {
      const locs = readLocations();
      if (!locs.length) return false;
      current = locs.some((l) => l.id === wantId) ? wantId : locs[0].id;
      renderCtas(locs);
      root.classList.add('is-loading');
      poll(() => {
        const link = listLink(current);
        if (link) {
          link.click();
          return true;
        }
        return false;
      });
      // If this studio has no schedule yet, stop loading and show a note
      // instead of spinning forever.
      window.setTimeout(() => {
        if (!host.querySelector('.hc_class')) {
          root.classList.remove('is-loading');
          root.classList.add('is-empty');
        }
      }, 12000);
      return true;
    });

    const obs = new MutationObserver(() => {
      // Hide the widget's own "back to list" link — our CTAs drive locations.
      const bl = backLink();
      if (bl && bl.dataset.gigiHidden !== '1') {
        bl.dataset.gigiHidden = '1';
        bl.style.position = 'absolute';
        bl.style.left = '-9999px';
      }
      if (host.querySelector('.hc_class')) root.classList.remove('is-loading');
    });
    obs.observe(host, {childList: true, subtree: true});
    return () => {
      obs.disconnect();
      root.textContent = '';
    };
  }, []);

  return <div className="gigi-book-live" ref={rootRef} />;
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
