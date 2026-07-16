import {useEffect, useRef, useState} from 'react';
import type {Route} from './+types/collab';
import collabStyles from '~/styles/gigi-collab.css?url';

export function links() {
  return [{rel: 'stylesheet', href: collabStyles}];
}

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Collaborate with GIGI | GIGI'},
    {
      name: 'description',
      content:
        'GIGI campaigns and collaborations — a new era of movement across Dubai and beyond.',
    },
  ];
};

const img = (name: string) => `/gigi/${name}`;

type Collab = {
  slug: string;
  title: string;
  location?: string;
  /** Number of gallery photos for this event, stored as
   *  /gigi/collab/<slug>/01.jpg … NN.jpg. Falls back to the grid thumbnail
   *  when omitted. */
  shots?: number;
};

/** The images shown in an event's lightbox (defaults to its grid thumbnail). */
const galleryFor = (c: Collab): string[] =>
  c.shots && c.shots > 0
    ? Array.from(
        {length: c.shots},
        (_, i) => `collab/${c.slug}/${String(i + 1).padStart(2, '0')}.jpg`,
      )
    : [`collab/collab-${c.slug}.jpg`];

const COLLABS: Collab[] = [
  {slug: 'burj-khalifa', title: 'GIGI x Burj Khalifa', shots: 8},
  {slug: 'siro', title: 'GIGI x Siro', location: 'Siro Hotel', shots: 17},
  {slug: 'maison-keturah', title: 'GIGI x Maison Keturah', shots: 13},
  {slug: 'barrys', title: "GIGI x Barry's", shots: 5},
  {slug: 'majilis', title: 'GIGI x Majilis', shots: 11},
  {slug: 'mad-london', title: 'GIGI x MAD London', shots: 8},
  {slug: 'lululemon', title: 'GIGI x Lululemon', shots: 6},
  {slug: 'arte', title: 'GIGI x Arte', shots: 13},
  {slug: 'ski-dubai', title: 'GIGI x Ski Dubai', shots: 12},
  {slug: 'fltr', title: 'GIGI x FLTR', location: 'Mirdif Avenue Mall', shots: 9},
  {slug: 'brand-dubai-dam', title: 'GIGI x Brand Dubai', location: 'Hatta Dam', shots: 7},
  {slug: 'brand-dubai-fountain', title: 'GIGI x Brand Dubai', location: 'Hatta Fountain', shots: 6},
  {slug: 'mihbash', title: 'GIGI x Mihbash', location: 'Jumeirah', shots: 1},
  {slug: 'arte-museum', title: 'GIGI x Arte Museum', location: 'The Dubai Mall', shots: 5},
  {slug: 'house-edition', title: 'GIGI House Edition', location: 'Alserkal Avenue', shots: 4},
  {slug: 'bentley', title: 'GIGI x Bentley', location: 'Bentley Showroom', shots: 6},
  {slug: 'galentines', title: 'Galentines', location: "Siro One Za'abeel", shots: 10},
  {slug: 'salt', title: 'GIGI x SALT', location: 'Jumeirah', shots: 5},
];

export default function CollabPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const active = activeIndex === null ? null : COLLABS[activeIndex];
  const activeGallery = active ? galleryFor(active) : [];

  // Parallax: the hero headline scrolls at ~half speed and fades as the second
  // section rises, so it stays partly visible on the way down.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = heroTextRef.current;
        if (!el) return;
        const y = window.scrollY;
        const vh = window.innerHeight || 1;
        el.style.transform = `translateY(${y * 0.5}px)`;
        el.style.opacity = String(Math.max(0, 1 - y / (vh * 0.85)));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // While the lightbox is open: lock page scroll, close on Escape, and step
  // through the open event's gallery with the arrow keys. (Deliberately no
  // mouse-wheel hijacking on the carousel — that swallowed vertical page
  // scrolling whenever the cursor sat over the photos.)
  useEffect(() => {
    if (activeIndex === null) return;
    const count = galleryFor(COLLABS[activeIndex]).length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null);
      else if (e.key === 'ArrowRight') setImgIdx((i) => (i + 1) % count);
      else if (e.key === 'ArrowLeft') setImgIdx((i) => (i - 1 + count) % count);
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeIndex]);

  const openEvent = (index: number) => {
    setImgIdx(0);
    setActiveIndex(index);
  };

  const scrollTrack = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({left: dir * el.clientWidth * 0.8, behavior: 'smooth'});
  };

  const stepImage = (dir: number) => {
    const count = activeGallery.length;
    if (count < 2) return;
    setImgIdx((i) => (i + dir + count) % count);
  };

  return (
    <div className="gigi-site gigi-collab-page">
      <GigiNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* ------------------------------ HERO ------------------------------ */}
      <section className="gigi-cl-hero">
        <header className="gigi-cl-header">
          <a className="gigi-cl-logo" href="/" aria-label="GIGI home">
            <img src={img('gigi-logo-primary.png')} alt="GIGI" />
          </a>
          <button
            className="gigi-cl-menu"
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            aria-controls="gigi-menu"
          >
            Menu
          </button>
        </header>
        <h1 className="gigi-cl-hero__title" ref={heroTextRef}>
          We&apos;re Bringing
          <br />
          Sexy Back
        </h1>
      </section>

      {/* ---------------------------- WELCOME ----------------------------- */}
      <section className="gigi-cl-welcome">
        <div className="gigi-cl-welcome__copy">
          <h2 className="gigi-cl-welcome__title">
            Welcome to <span className="gigi-cl-cal">Gigi</span>,
            <br />
            <span className="gigi-cl-bod">Wellness</span>, redefined
          </h2>
          <p>
            Gigi is a modern wellness and movement destination designed to
            inspire a healthier, more connected way of living. Rooted in
            community, mindful movement, and meaningful experiences, Gigi brings
            together fitness, recovery, and lifestyle in a space where people
            come not only to move, but to belong. More than a studio, Gigi is a
            community built around feeling good, living well, and creating
            lasting connections.
          </p>
        </div>
        <div className="gigi-cl-welcome__media">
          <img src={img('mosaic-1.jpg')} alt="GIGI merch" />
        </div>
      </section>

      {/* --------------------------- CREATIVE ----------------------------- */}
      <section className="gigi-cl-creative">
        <h2 className="gigi-cl-creative__title">
          A Creative Expression of Movement and Mindfulness.
        </h2>
        <div className="gigi-cl-creative__copy">
          <p>
            A sanctuary where movement meets mindfulness, empowering individuals
            to achieve balance, strength, and holistic well-being. Our Lagree
            and wellness studio is dedicated to redefining self-care through
            expertly curated classes, personalized guidance, and an atmosphere
            of tranquility.
          </p>
          <p>
            Rooted in elegance and innovation, we blend the art of mindful
            movement with modern wellness practices, creating a transformative
            experience that nurtures the body, mind, and soul. Gigi is dedicated
            to take a movement to be the region&apos;s most exclusive Lagree and
            wellness studio, setting a new standard for luxury, expertise, and
            holistic transformation.
          </p>
          <p>
            Through community, connection, and conscious living, we inspire our
            clients to move with intention, embrace vitality, and cultivate
            lifelong wellness.
          </p>
        </div>
      </section>

      {/* ---------------------------- EVENTS ------------------------------ */}
      <section className="gigi-cl-events" aria-label="Collaborations">
        <h2 className="gigi-cl-events__title">A New Era of Movement</h2>
        <div className="gigi-cl-carousel">
          <div className="gigi-cl-track" ref={trackRef}>
            <div className="gigi-cl-track__inner">
              {COLLABS.map((collab, index) => (
                <button
                  type="button"
                  className="gigi-cl-tile"
                  key={collab.slug}
                  onClick={() => openEvent(index)}
                  aria-label={`View the ${collab.title} gallery`}
                >
                  <img
                    src={img(`collab/collab-${collab.slug}.jpg`)}
                    alt={collab.title}
                    loading="lazy"
                  />
                  <span className="gigi-cl-tile__caption">
                    <span className="gigi-cl-tile__title">{collab.title}</span>
                    {collab.location && (
                      <span className="gigi-cl-tile__loc">{collab.location}</span>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="gigi-cl-arrows">
            <button
              type="button"
              onClick={() => scrollTrack(-1)}
              aria-label="Scroll to previous events"
            >
              &#8249;
            </button>
            <button
              type="button"
              onClick={() => scrollTrack(1)}
              aria-label="Scroll to more events"
            >
              &#8250;
            </button>
          </div>
        </div>

        <div className="gigi-cl-events__note">
          <h3>Campaigns and Collabs</h3>
          <p>
            Our strong brand loyalty means the GIGI community shows up, wherever
            we go. From events to pop-ups, they engage beyond the studio walls.
          </p>
        </div>

        <p className="gigi-cl-outro">Move, the Gigi Way.</p>
      </section>

      {active && (
        <div
          className="gigi-cl-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} gallery`}
          onClick={() => setActiveIndex(null)}
        >
          {activeGallery.length > 1 && (
            <button
              type="button"
              className="gigi-cl-lb-nav is-prev"
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                stepImage(-1);
              }}
            >
              &#8249;
            </button>
          )}

          <figure
            className="gigi-cl-lb-figure"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={img(activeGallery[imgIdx])}
              alt={`${active.title} — image ${imgIdx + 1} of ${activeGallery.length}`}
            />
          </figure>

          {activeGallery.length > 1 && (
            <button
              type="button"
              className="gigi-cl-lb-nav is-next"
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                stepImage(1);
              }}
            >
              &#8250;
            </button>
          )}

          <div
            className="gigi-cl-lb-footer"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="gigi-cl-lb-caption">
              <span className="gigi-cl-lb-title">{active.title}</span>
              {active.location && (
                <span className="gigi-cl-lb-loc">{active.location}</span>
              )}
            </p>
            {activeGallery.length > 1 && (
              <div className="gigi-cl-lb-dots">
                {activeGallery.map((src, i) => (
                  <button
                    type="button"
                    key={src}
                    className={`gigi-cl-lb-dot ${i === imgIdx ? 'is-active' : ''}`}
                    aria-label={`Show image ${i + 1}`}
                    aria-current={i === imgIdx}
                    onClick={() => setImgIdx(i)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <GigiFooter compact />
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
