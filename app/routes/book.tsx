import {useState} from 'react';
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

const LOCATIONS = [
  {id: 'midriff', label: 'Midriff'},
  {id: 'nad-al-sheba', label: 'Nad Al Sheba'},
] as const;

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const ROWS = 4;
// Which cell shows as fully booked (row index, day index). Placeholder until the
// booking platform feeds real availability.
const FULL_CELL = {row: 1, day: 4};

export default function BookPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useState<(typeof LOCATIONS)[number]['id']>(
    'midriff',
  );
  const [selected, setSelected] = useState<string | null>(null);

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

        <div className="gigi-book-locations" role="group" aria-label="Studio">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              type="button"
              className={`gigi-book-location ${
                location === loc.id ? 'is-active' : ''
              }`}
              aria-pressed={location === loc.id}
              onClick={() => setLocation(loc.id)}
            >
              {loc.label}
            </button>
          ))}
        </div>

        <div className="gigi-book-grid-wrap">
          <div className="gigi-book-grid" role="grid" aria-label="Weekly schedule">
            {DAYS.map((day) => (
              <div className="gigi-book-day" role="columnheader" key={day}>
                {day}
              </div>
            ))}

            {Array.from({length: ROWS}).flatMap((_, row) =>
              DAYS.map((day, col) => {
                const key = `${location}-${row}-${col}`;
                const isFull = row === FULL_CELL.row && col === FULL_CELL.day;

                if (isFull) {
                  return (
                    <div
                      className="gigi-book-slot is-full"
                      role="gridcell"
                      key={key}
                    >
                      <img src={img('gigi-mark-rose.png')} alt="" aria-hidden="true" />
                      <em>Class Full</em>
                    </div>
                  );
                }

                return (
                  <button
                    className={`gigi-book-slot ${
                      selected === key ? 'is-selected' : ''
                    }`}
                    type="button"
                    role="gridcell"
                    aria-pressed={selected === key}
                    key={key}
                    onClick={() =>
                      setSelected((current) => (current === key ? null : key))
                    }
                  >
                    <strong>Lagree Mega Pro</strong>
                    <em>Samantha</em>
                    <span>7:00 AM</span>
                  </button>
                );
              }),
            )}
          </div>
        </div>
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
