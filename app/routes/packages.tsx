import {useEffect, useState} from 'react';
import type {Route} from './+types/packages';
import packagesStyles from '~/styles/gigi-packages.css?url';

export function links() {
  return [{rel: 'stylesheet', href: packagesStyles}];
}

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Get Started | GIGI'},
    {
      name: 'description',
      content:
        'Get started with GIGI — explore Lagree classes and packages and book your place.',
    },
  ];
};

const img = (name: string) => `/gigi/${name}`;

export default function PackagesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <div className="gigi-site gigi-packages-page">
      <GigiNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <section className="gigi-pk-hero">
        <header className="gigi-pk-header">
          <a className="gigi-pk-logo" href="/" aria-label="GIGI home">
            <img src={img('gigi-logo-primary.png')} alt="GIGI" />
          </a>
          <button
            className="gigi-pk-menu"
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            aria-controls="gigi-menu"
          >
            Menu
          </button>
        </header>
        <h1 className="gigi-pk-title">Get Started</h1>
      </section>

      <section className="gigi-pk-focus">
        <p>
          And let the focus stay on you&hellip;
          <br />
          <strong>until the focus is on you.</strong>
        </p>
      </section>

      <section
        className="gigi-pk-packages"
        id="packages"
        aria-label="Classes and packages"
      >
        <div className="gigi-pk-packages__list">
          {GIGI_PACKAGES.map((pkg) => (
            <article
              className={`gigi-pk-card gigi-pk-card--${pkg.tone}`}
              key={pkg.title.join(' ')}
            >
              <h3 className="gigi-pk-card__title">
                {pkg.title[0]}
                <br />
                {pkg.title[1]}
              </h3>
              <div className="gigi-pk-card__body">
                <p className="gigi-pk-card__blurb">{pkg.blurb}</p>
                <p className="gigi-pk-card__valid">{pkg.validity}</p>
                <p className="gigi-pk-card__price">{pkg.price}</p>
                <button
                  className="gigi-pk-card__cta"
                  type="button"
                  onClick={() => setIsBookingOpen(true)}
                >
                  Book Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <GigiFooter compact />

      {isBookingOpen && (
        <BookingModal onClose={() => setIsBookingOpen(false)} />
      )}
    </div>
  );
}

function BookingModal({onClose}: {onClose: () => void}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="gigi-modal-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="gigi-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gigi-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="gigi-modal__close"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon />
        </button>
        <h2 id="gigi-modal-title" className="gigi-modal__title">
          Welcome!
        </h2>
        <p className="gigi-modal__subtitle">Sign In</p>
        {/* Placeholder form — the booking platform will be wired in here later. */}
        <form
          className="gigi-modal__form"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            className="gigi-modal__field"
            type="email"
            placeholder="E MAIL"
            aria-label="Email"
            autoComplete="email"
          />
          <input
            className="gigi-modal__field"
            type="password"
            placeholder="PASSWORD"
            aria-label="Password"
            autoComplete="current-password"
          />
          <button className="gigi-modal__link" type="button">
            I Forgot my password
          </button>
          {/* Placeholder: stands in for post-login until the booking platform
              is integrated — routes through to the Book Now schedule. */}
          <a className="gigi-modal__submit" href="/book">
            Log In
          </a>
          <button className="gigi-modal__link" type="button">
            I don&apos;t have an account.
          </button>
        </form>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

const GIGI_PACKAGES: {
  title: [string, string];
  blurb: string;
  validity: string;
  price: string;
  tone: 'burgundy-rose' | 'burgundy-cream' | 'rose' | 'olive';
}[] = [
  {
    title: ['Discovery', 'Package'],
    blurb:
      'Perfect for new clients wanting to experience Gigi (3 classes). *One time purchase only.',
    validity: 'Valid for 2 weeks.',
    price: 'AED 250',
    tone: 'burgundy-rose',
  },
  {
    title: ['Single', 'Class'],
    blurb: 'For those who choose themselves first.',
    validity: 'Valid for 2 weeks.',
    price: 'AED 155',
    tone: 'rose',
  },
  {
    title: ['Five', 'Classes'],
    blurb: 'For those who are starting to get it.',
    validity: 'Valid for one month.',
    price: 'AED 700',
    tone: 'olive',
  },
  {
    title: ['Ten', 'Classes'],
    blurb: 'For the fully committed Gigi girls.',
    validity: 'Valid for three months.',
    price: 'AED 1,300',
    tone: 'burgundy-cream',
  },
  {
    title: ['Fifteen', 'Classes'],
    blurb: 'On your way to becoming an expert.',
    validity: 'Valid for four months.',
    price: 'AED 1,815',
    tone: 'burgundy-rose',
  },
  {
    title: ['Twenty', 'Classes'],
    blurb: 'Advanced Mastery Unlocked.',
    validity: 'Valid for six months.',
    price: 'AED 2,600',
    tone: 'rose',
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
