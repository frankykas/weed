import {useState} from 'react';
import type {Route} from './+types/profile';
import profileStyles from '~/styles/gigi-profile.css?url';

export function links() {
  return [{rel: 'stylesheet', href: profileStyles}];
}

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Profile | GIGI'},
    {name: 'description', content: 'Your GIGI profile, classes and reservations.'},
  ];
};

const img = (name: string) => `/gigi/${name}`;

// Placeholder account data — to be replaced by the customer's real Shopify
// account details once a store is connected.
const PROFILE = {
  name: 'Ghaliya Ahli',
  avatar: 'founder-ghaliya-converted.jpg',
  facts: [
    {value: 'Female', label: 'Gender'},
    {value: '30', label: 'Age'},
    {value: '29/02/1996', label: 'Birthday'},
  ],
  milestone: "You've taken 100 classes with us!",
  month: [
    {label: 'Total', value: '8'},
    {label: 'Booked', value: '3'},
    {label: 'Remaining', value: '1'},
  ],
  reservations: [
    {cls: 'Lagree Mega Pro', studio: 'Midriff', date: '09/05/2026', time: '8:00 AM'},
    {cls: 'Lagree Mega Pro', studio: 'Midriff', date: '10/05/2026', time: '8:00 AM'},
    {cls: 'Lagree Mega Pro', studio: 'Nad al Sheba', date: '11/05/2026', time: '8:00 AM'},
  ],
};

export default function ProfilePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [open, setOpen] = useState({
    classes: true,
    reservations: true,
    subscription: false,
  });
  const toggle = (key: keyof typeof open) =>
    setOpen((current) => ({...current, [key]: !current[key]}));

  return (
    <div className="gigi-site gigi-profile-page">
      <GigiNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <section className="gigi-pf">
        <header className="gigi-pf-header">
          <a className="gigi-pf-logo" href="/" aria-label="GIGI home">
            <img src={img('gigi-logo-primary.png')} alt="GIGI" />
          </a>
          <button
            className="gigi-pf-menu"
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            aria-controls="gigi-menu"
          >
            Menu
          </button>
        </header>

        <div className="gigi-pf-identity">
          <img
            className="gigi-pf-avatar"
            src={img(PROFILE.avatar)}
            alt={PROFILE.name}
          />
          <h1 className="gigi-pf-name">{PROFILE.name}</h1>
          <dl className="gigi-pf-facts">
            {PROFILE.facts.map((fact) => (
              <div className="gigi-pf-fact" key={fact.label}>
                <dt>{fact.value}</dt>
                <dd>{fact.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Accordion
          title="Classes"
          isOpen={open.classes}
          onToggle={() => toggle('classes')}
        >
          <div className="gigi-pf-milestone">
            <div>
              <p className="gigi-pf-strong">Your milestones</p>
              <p>{PROFILE.milestone}</p>
            </div>
            <a className="gigi-pf-book" href="/book">
              Book Now
            </a>
          </div>
          <p className="gigi-pf-strong gigi-pf-month-label">This Month</p>
          <div className="gigi-pf-month">
            {PROFILE.month.map((stat) => (
              <div className="gigi-pf-stat" key={stat.label}>
                <span className="gigi-pf-stat__label">{stat.label}</span>
                <span className="gigi-pf-stat__value">{stat.value}</span>
              </div>
            ))}
          </div>
        </Accordion>

        <Accordion
          title="Reservations"
          isOpen={open.reservations}
          onToggle={() => toggle('reservations')}
        >
          <div className="gigi-pf-table" role="table">
            <div className="gigi-pf-row gigi-pf-row--head" role="row">
              <span role="columnheader">Class</span>
              <span role="columnheader">Studio</span>
              <span role="columnheader">Date</span>
              <span role="columnheader">Time</span>
            </div>
            {PROFILE.reservations.map((r) => (
              <div className="gigi-pf-row" role="row" key={`${r.date}-${r.studio}`}>
                <span role="cell">{r.cls}</span>
                <span role="cell">{r.studio}</span>
                <span role="cell">{r.date}</span>
                <span role="cell">{r.time}</span>
              </div>
            ))}
          </div>
        </Accordion>

        <Accordion
          title="Subscription"
          isOpen={open.subscription}
          onToggle={() => toggle('subscription')}
        >
          <p className="gigi-pf-empty">No active subscription yet.</p>
        </Accordion>
      </section>

      <GigiFooter compact />
    </div>
  );
}

function Accordion({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="gigi-pf-acc">
      <button
        className="gigi-pf-acc__head"
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <h2>{title}</h2>
        <span className={`gigi-pf-toggle ${isOpen ? 'is-open' : ''}`} aria-hidden="true" />
      </button>
      {isOpen && <div className="gigi-pf-acc__body">{children}</div>}
    </section>
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
