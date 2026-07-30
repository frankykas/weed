import {useState} from 'react';
import {useLoaderData} from 'react-router';
import type {Route} from './+types/book-preview';
import bookStyles from '~/styles/gigi-book.css?url';
import {getBookingSchedule, type MindbodyEnv} from '~/lib/mindbody.server';

export function links() {
  return [{rel: 'stylesheet', href: bookStyles}];
}

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Book Now (preview) | GIGI'},
    {name: 'robots', content: 'noindex'},
    {
      name: 'description',
      content: 'GIGI class schedule — custom calendar preview.',
    },
  ];
};

export async function loader({context}: Route.LoaderArgs) {
  // Dev (MiniOxygen) exposes vars on context.env; the Vercel Node runtime
  // (mock-mode base handler) does not, so fall back to process.env there.
  const ctxEnv = (context as unknown as {env?: MindbodyEnv}).env;
  const procEnv =
    typeof process !== 'undefined'
      ? (process.env as unknown as MindbodyEnv)
      : undefined;
  const env: MindbodyEnv =
    ctxEnv && ctxEnv.MINDBODY_API_KEY ? ctxEnv : procEnv ?? {};
  const schedule = await getBookingSchedule(env);
  return {schedule};
}

const img = (name: string) => `/gigi/${name}`;

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function BookPreviewPage() {
  const {schedule} = useLoaderData<typeof loader>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [locationId, setLocationId] = useState<number | null>(
    schedule.locations[0]?.id ?? null,
  );

  const activeLoc = locationId ?? schedule.locations[0]?.id ?? null;

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

        {schedule.locations.length > 0 && (
          <div className="gigi-book-locations" role="group" aria-label="Studio">
            {schedule.locations.map((loc) => (
              <button
                key={loc.id}
                type="button"
                className={`gigi-book-location ${
                  activeLoc === loc.id ? 'is-active' : ''
                }`}
                aria-pressed={activeLoc === loc.id}
                onClick={() => setLocationId(loc.id)}
              >
                {loc.name}
              </button>
            ))}
          </div>
        )}

        <div className="gigi-book-grid-wrap">
          {!schedule.configured ? (
            <p className="gigi-book-note">
              Booking schedule isn&apos;t connected yet.
            </p>
          ) : schedule.classes.length === 0 ? (
            <p className="gigi-book-note">No classes scheduled this week.</p>
          ) : (
            <div className="gigi-book-cal" role="grid" aria-label="Weekly schedule">
              {DAYS.map((label, dayIdx) => {
                const dayClasses = schedule.classes.filter(
                  (c) =>
                    c.day === dayIdx &&
                    (activeLoc == null || c.locationId === activeLoc),
                );
                return (
                  <div className="gigi-book-col" role="gridcell" key={label}>
                    <div className="gigi-book-day">{label}</div>
                    <div className="gigi-book-col__slots">
                      {dayClasses.length === 0 ? (
                        <span className="gigi-book-empty" aria-hidden="true">
                          &mdash;
                        </span>
                      ) : (
                        dayClasses.map((c) =>
                          c.isFull ? (
                            <div className="gigi-book-slot is-full" key={c.id}>
                              <img
                                src={img('gigi-mark-rose.png')}
                                alt=""
                                aria-hidden="true"
                              />
                              <strong>{c.name}</strong>
                              <em>Class Full</em>
                              <span>{c.time}</span>
                            </div>
                          ) : (
                            <a
                              className="gigi-book-slot"
                              href={c.bookUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              key={c.id}
                            >
                              <strong>{c.name}</strong>
                              {c.staff && <em>{c.staff}</em>}
                              <span>{c.time}</span>
                            </a>
                          ),
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {schedule.sandbox && (
          <p className="gigi-book-note gigi-book-note--sandbox">
            Preview using MindBody&apos;s free <strong>sandbox</strong> data —
            real GIGI classes appear here once the studio enables live MindBody
            API access.
          </p>
        )}
      </section>

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
