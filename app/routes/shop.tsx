import {useState} from 'react';
import {Link} from 'react-router';
import type {Route} from './+types/shop';
import shopStyles from '~/styles/gigi-shop.css?url';
import {GIGI_PRODUCTS, type GigiProduct} from '~/lib/gigiProducts';

export function links() {
  return [{rel: 'stylesheet', href: shopStyles}];
}

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Shop | GIGI'},
    {name: 'description', content: 'Shop GIGI clothing and accessories.'},
  ];
};

const img = (name: string) => `/gigi/${name}`;

const CLOTHING = GIGI_PRODUCTS.filter((p) => p.category === 'clothing');
const ACCESSORIES = GIGI_PRODUCTS.filter((p) => p.category === 'accessories');

const FILTERS = [
  {id: 'all', label: 'All'},
  {id: 'clothing', label: 'Clothing'},
  {id: 'accessories', label: 'Accessories'},
] as const;

export default function ShopPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');
  const cartCount = 1;

  const showClothing = filter === 'all' || filter === 'clothing';
  const showAccessories = filter === 'all' || filter === 'accessories';
  const showLifestyle = filter === 'all';

  return (
    <div className="gigi-site gigi-shop-page">
      <GigiNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className="gigi-shop-top">
      <header className="gigi-shop-header">
        <a className="gigi-shop-logo" href="/" aria-label="GIGI home">
          <img src={img('gigi-logo-burgundy.png')} alt="GIGI" />
        </a>
        <div className="gigi-shop-header__actions">
          <a className="gigi-shop-bag" href="/cart" aria-label={`Cart, ${cartCount} items`}>
            <BagIcon />
            {cartCount > 0 && <span className="gigi-shop-bag__count">{cartCount}</span>}
          </a>
          <button
            className="gigi-shop-menu"
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            aria-controls="gigi-menu"
          >
            Menu
          </button>
        </div>
      </header>

      <nav className="gigi-shop-filter" aria-label="Product categories">
        <div className="gigi-shop-tabs">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`gigi-shop-tab ${filter === f.id ? 'is-active' : ''}`}
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </nav>

      <section className="gigi-shop-hero" aria-label="GIGI shop">
        <img
          className="gigi-shop-hero__mark"
          src={img('gigi-logo-primary.png')}
          alt="GIGI"
        />
      </section>
      </div>

      {showClothing && (
        <ProductSection title="Clothing" products={CLOTHING} />
      )}

      {showLifestyle && (
        <section className="gigi-shop-lifestyle" aria-label="The collection">
          <figure>
            <img src={img('mosaic-2.jpg')} alt="GIGI tote — sorre is the new rich" />
          </figure>
          <figure>
            <img src={img('mosaic-3.jpg')} alt="Wearing GIGI" />
          </figure>
        </section>
      )}

      {showAccessories && (
        <ProductSection
          title="Accessories"
          products={ACCESSORIES}
        />
      )}

      <GigiFooter compact />
    </div>
  );
}

function ProductSection({
  title,
  products,
}: {
  title: string;
  products: GigiProduct[];
}) {
  return (
    <section className="gigi-shop-section">
      <h2 className="gigi-shop-section__title">{title}</h2>
      <div className="gigi-shop-grid">
        {products.map((product) => (
          <article className="gigi-shop-card" key={product.handle}>
            <Link
              to={`/products/${product.handle}`}
              prefetch="intent"
              className="gigi-shop-card__img"
              aria-label={product.name}
            >
              <img src={img(product.image)} alt={product.name} loading="lazy" />
            </Link>
            <div className="gigi-shop-card__meta">
              <Link to={`/products/${product.handle}`} className="gigi-shop-card__name">
                {product.name}
              </Link>
              <span className="gigi-shop-card__price">{product.price}</span>
            </div>
            <Link
              to={`/products/${product.handle}`}
              prefetch="intent"
              className="gigi-shop-card__cart"
            >
              Add to cart
            </Link>
          </article>
        ))}
      </div>
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
