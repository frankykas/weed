import {useEffect, useRef, useState} from 'react';
import type {Route} from './+types/_index';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'GIGI | Lagree, redefined'},
    {
      name: 'description',
      content:
        'GIGI is a wellness and lifestyle brand redefining the Lagree experience.',
    },
  ];
};

const img = (name: string) => `/gigi/${name}`;

export default function Homepage() {
  const heroRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const updateTagOffset = () => {
      if (!heroRef.current || !tagRef.current) return;

      const rect = heroRef.current.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / 360, 0), 1);
      const offset = -70 + progress * 70;

      tagRef.current.style.setProperty('--tag-offset', `${offset}px`);
    };

    updateTagOffset();
    window.addEventListener('scroll', updateTagOffset, {passive: true});
    window.addEventListener('resize', updateTagOffset);

    return () => {
      window.removeEventListener('scroll', updateTagOffset);
      window.removeEventListener('resize', updateTagOffset);
    };
  }, []);

  return (
    <div className="gigi-site">
      <GigiNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <section className="gigi-hero" id="home" ref={heroRef}>
        <div className="gigi-hero__top">
          <GigiLogo />
          <button
            className="gigi-pill"
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            aria-controls="gigi-menu"
          >
            Menu
          </button>
          <div className="gigi-tag" ref={tagRef}>
            <img src={img('tag.png')} alt="GIGI hanging tag" />
          </div>
        </div>
        <div className="gigi-mosaic">
          <Tile image="mosaic-1.jpg" />
          <Tile label="Our Story" tone="olive" to="/about" />
          <Tile image="mosaic-2.jpg" />
          <Tile label="Shop Now" tone="rose" />
          <Tile label="Book Now" tone="burgundy" />
          <Tile image="mosaic-3.jpg" />
          <Tile label="Collaborate with GIGI" tone="cream" />
          <Tile image="mosaic-4.jpg" />
        </div>
        <div className="gigi-welcome">
          <div className="gigi-welcome__heading">
            <h1>Welcome to Gigi</h1>
            <p>Wellness, redefined.</p>
          </div>
          <GigiMark />
          <p className="gigi-intro">
            Gigi is a modern wellness and movement destination designed to
            inspire a healthier, more connected way of living. Rooted in
            community, mindful movement, and meaningful experiences, Gigi
            brings together fitness, recovery, and lifestyle in a space where
            people come not only to move, but to belong. More than a studio,
            Gigi is a community built around feeling good, living well, and
            creating lasting connections.
          </p>
        </div>
      </section>

      <section className="gigi-location">
        <div className="gigi-section-label">
          <h2><em>our</em> locations</h2>
          <div>
            <button type="button">Midriff</button>
            <button type="button">Nad Al Sheba</button>
            <button type="button">New Location</button>
            <button type="button">New Location</button>
          </div>
        </div>
        <div className="gigi-location__image">
          <img src={img('location-studio.jpg')} alt="Lagree studio" />
          <h2>Where movement, wellness, and community come together.</h2>
        </div>
        <GigiFooter compact />
      </section>

    </div>
  );
}

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
      <a href="#home" onClick={onClose}>Home</a>
      <a href="/about" onClick={onClose}><em>Our</em> Story</a>
      <a href="/packages" onClick={onClose}>Get Started <small>Classes Packages Book Now</small></a>
      <a href="/shop" onClick={onClose}>Shop</a>
      <a href="/collab" onClick={onClose}>Collaborate with Gigi</a>
      <a href="#contact" onClick={onClose}>Stay in Touch</a>
    </nav>
  );
}

function GigiLogo() {
  return (
    <a className="gigi-logo" href="#home" aria-label="GIGI home">
      <img src={img('gigi-logo-primary.png')} alt="GIGI" />
    </a>
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

function GigiMark() {
  return <img className="gigi-mark" src={img('gigi-framed-butter.png')} alt="GIGI" />;
}

function Tile({
  image,
  label,
  tone,
  to,
}: {
  image?: string;
  label?: string;
  tone?: 'olive' | 'rose' | 'burgundy' | 'cream';
  to?: string;
}) {
  return (
    <a className={`gigi-tile ${tone ? `gigi-tile--${tone}` : ''}`} href={to ?? (label === 'Book Now' ? '#book' : '#')}>
      {image && <img src={img(image)} alt="" />}
      {label && <span>{label}</span>}
      {label && (
        <small>
          <LongArrowIcon />
        </small>
      )}
    </a>
  );
}

function LongArrowIcon() {
  return (
    <svg viewBox="0 0 128 32" aria-hidden="true" focusable="false">
      <path d="M4 16h105.5" />
      <path d="M94 5.5 110.5 16 94 26.5" />
    </svg>
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
