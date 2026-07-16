import {useEffect, useRef, useState} from 'react';
import type {Route} from './+types/about';
import aboutStyles from '~/styles/gigi-about.css?url';

export function links() {
  return [{rel: 'stylesheet', href: aboutStyles}];
}

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Our Story | GIGI'},
    {
      name: 'description',
      content:
        'Discover GIGI, a wellness and lifestyle brand redefining movement, culture, and community.',
    },
  ];
};

const img = (name: string) => `/gigi/${name}`;

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    trackRef,
    activeValue,
    scrollByCard,
    dragHandlers,
    isDragging,
  } = useValuesCarousel();

  return (
    <div className="gigi-site gigi-about-page">
      <GigiNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <section className="gigi-about-hero">
        <header className="gigi-about-header">
          <a className="gigi-about-logo" href="/" aria-label="GIGI home">
            <img src={img('gigi-logo-burgundy.png')} alt="GIGI" />
          </a>
          <button
            className="gigi-about-menu"
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            aria-controls="gigi-menu"
          >
            Menu
          </button>
        </header>

        <div className="gigi-about-content">
          <div className="gigi-about-image-wrap">
            <img
              className="gigi-about-image"
              src={img('about-image.jpg')}
              alt="GIGI Lagree studio detail"
            />
          </div>
          <article className="gigi-about-copy">
            <h1>About Us</h1>
            <p>
              Gigi is a wellness and lifestyle brand redefining the way people
              move, connect, and experience wellness. Dubai's first Emirati
              founded Lagree club, Gigi was built on the belief that wellness
              extends beyond the studio, creating a community-driven space where
              movement, culture, and meaningful experiences come together. What
              began with Lagree has evolved into a lifestyle platform offering a
              variety of movement practices, while bringing people together
              through fitness, events, collaborations, and shared experiences
              making wellness a more social, inspiring, and integrated part of
              everyday life.
            </p>
          </article>
          <img
            className="gigi-about-wordmark"
            src={img('gigi-description-soul-wine.png')}
            alt=""
            aria-hidden="true"
          />
        </div>
      </section>

      <section id="strength" className="gigi-strength-section">
        <h2>Are you ready to meet<br />your strongest self?</h2>
        <p>
          Step into a space where movement builds more than strength:<br />
          it builds confidence, connection, and the version of you that<br />
          was always meant to take center stage.
        </p>
      </section>

      <section id="founder" className="gigi-founder-section">
        <article className="gigi-founder-copy">
          <h2>Meet <em>Our</em> Founder</h2>
          <p>
            Ghaliya Ahli is a Dubai-based entrepreneur with a background in
            design management and luxury marketing. She is the Founder and
            Managing Director of Gigi, a movement and lifestyle brand that
            celebrates wellness, lifestyle, and community.
          </p>
          <p>
            As the first Emirati to introduce Lagree to Dubai, she has brought
            innovative concepts and experiences to the region.
          </p>
          <p>
            Ghaliya is dedicated to building Gigi as a community-driven brand
            that merges wellness, creativity, and luxury experiences, as Dubai
            continues to grow into a leading wellness and fitness hub.
          </p>
          <span>Ghaliya Ahli</span>
        </article>
        <img
          className="gigi-founder-photo"
          src={img('founder-ghaliya-converted.jpg')}
          alt="Ghaliya Ahli"
        />
      </section>

      <section id="values" className="gigi-values-section" aria-label="Our Values">
        <h2><em>Our</em> Values</h2>
        <button
          className="gigi-values-arrow gigi-values-arrow--prev"
          type="button"
          aria-label="Previous values"
          onClick={() => scrollByCard(-1)}
        >
          <ChevronIcon direction="left" />
        </button>
        <div
          className={`gigi-values-track ${isDragging ? 'is-dragging' : ''}`}
          ref={trackRef}
          {...dragHandlers}
        >
          {GIGI_VALUES.map((value, index) => (
            <article
              className={`gigi-value-card ${index === activeValue ? 'is-active' : ''}`}
              key={value.title}
            >
              <h3>{value.title}</h3>
              <p>{value.copy}</p>
            </article>
          ))}
        </div>
        <button
          className="gigi-values-arrow gigi-values-arrow--next"
          type="button"
          aria-label="Next values"
          onClick={() => scrollByCard(1)}
        >
          <ChevronIcon direction="right" />
        </button>
      </section>

      <GigiFooter compact />
    </div>
  );
}

/**
 * Horizontal "Our Values" carousel: arrows scroll one card with a smooth
 * animation, and the track can be click-and-dragged with the mouse. The
 * centred card is highlighted (is-active).
 */
function useValuesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeValue, setActiveValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef({down: false, startX: 0, startScroll: 0, moved: false});

  const updateActive = () => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    const cards = Array.from(
      track.querySelectorAll<HTMLElement>('.gigi-value-card'),
    );
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - center);
      if (distance < bestDist) {
        bestDist = distance;
        best = index;
      }
    });
    setActiveValue(best);
  };

  useEffect(() => {
    updateActive();
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => updateActive();
    track.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollByCard = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('.gigi-value-card');
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = card ? card.offsetWidth + gap : track.clientWidth * 0.6;
    track.scrollBy({left: direction * step, behavior: 'smooth'});
  };

  const dragHandlers = {
    onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
      const track = trackRef.current;
      if (!track) return;
      drag.current = {
        down: true,
        startX: event.clientX,
        startScroll: track.scrollLeft,
        moved: false,
      };
    },
    onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => {
      if (!drag.current.down) return;
      const track = trackRef.current;
      if (!track) return;
      const dx = event.clientX - drag.current.startX;
      if (!drag.current.moved && Math.abs(dx) > 4) {
        drag.current.moved = true;
        setIsDragging(true);
        track.setPointerCapture?.(event.pointerId);
      }
      if (drag.current.moved) {
        track.scrollLeft = drag.current.startScroll - dx;
      }
    },
    onPointerUp: (event: React.PointerEvent<HTMLDivElement>) => {
      drag.current.down = false;
      setIsDragging(false);
      trackRef.current?.releasePointerCapture?.(event.pointerId);
    },
    onPointerCancel: () => {
      drag.current.down = false;
      setIsDragging(false);
    },
  };

  return {trackRef, activeValue, scrollByCard, dragHandlers, isDragging};
}

const GIGI_VALUES = [
  {
    title: 'Mindful Movement',
    copy: 'Movement is our foundation: not to perform, but to feel, connect, and evolve.',
  },
  {
    title: 'You First',
    copy: 'Every class, every cue, every detail is designed for you to return to yourself. The focus starts with you, and eventually becomes you.',
  },
  {
    title: 'Sensual Confidence',
    copy: 'A grounded, radiant kind of self-assurance: quiet but undeniable.',
  },
  {
    title: 'Community Ritual',
    copy: 'A shared rhythm of wellness, culture, and connection that turns movement into belonging.',
  },
];

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
      <a href="/packages" onClick={onClose}>Get Started <small>Classes Packages Book Now</small></a>
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

function ChevronIcon({direction}: {direction: 'left' | 'right'}) {
  return (
    <svg viewBox="0 0 48 72" aria-hidden="true" focusable="false">
      <path d={direction === 'left' ? 'M35 8 12 36l23 28' : 'M13 8l23 28-23 28'} />
    </svg>
  );
}
