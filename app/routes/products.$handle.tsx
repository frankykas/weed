import {useEffect, useState} from 'react';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/products.$handle';
import productStyles from '~/styles/gigi-product.css?url';
import {
  GIGI_PRODUCTS,
  getGigiProduct,
  getRelatedGigiProducts,
  type GigiProduct,
} from '~/lib/gigiProducts';

export function links() {
  return [{rel: 'stylesheet', href: productStyles}];
}

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `${data?.product.name ?? 'Shop'} | GIGI`},
    {rel: 'canonical', href: `/products/${data?.product.handle}`},
  ];
};

export async function loader({params}: Route.LoaderArgs) {
  const {handle} = params;
  // Fall back to the first product so the design renders for any product URL
  // until the real Shopify catalogue is connected.
  const product = (handle && getGigiProduct(handle)) || GIGI_PRODUCTS[0];
  const related = getRelatedGigiProducts(product.handle, 6);
  return {product, related};
}

const img = (name: string) => `/gigi/${name}`;

const ACCORDIONS = [
  {id: 'details', label: 'Product Details', field: 'details'},
  {id: 'composition', label: 'Composition and Care', field: 'composition'},
  {id: 'shipping', label: 'Shipping and Returns', field: 'shipping'},
  {id: 'sizeFit', label: 'Size and Fit', field: 'sizeFit'},
] as const;

export default function Product() {
  const {product, related} = useLoaderData<typeof loader>();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(1);
  const [colorIndex, setColorIndex] = useState(0);
  const [size, setSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [openAcc, setOpenAcc] = useState<string | null>('details');
  const [railIndex, setRailIndex] = useState(0);

  // Reset selections when navigating to a different product.
  useEffect(() => {
    setColorIndex(0);
    setSize(product.sizes[0]);
    setQuantity(1);
    setOpenAcc('details');
    setRailIndex(0);
  }, [product.handle, product.sizes]);

  const addToCart = (qty = 1) => setCartCount((count) => count + qty);

  const visibleRelated = [0, 1, 2].map(
    (offset) => related[(railIndex + offset) % related.length],
  );

  return (
    <div className="gigi-site gigi-product-page">
      <GigiNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <header className="gigi-pd-header">
        <a className="gigi-pd-logo" href="/" aria-label="GIGI home">
          <img src={img('gigi-logo-burgundy.png')} alt="GIGI" />
        </a>
        <div className="gigi-pd-header__actions">
          <a className="gigi-pd-bag" href="/cart" aria-label={`Cart, ${cartCount} items`}>
            <BagIcon />
            {cartCount > 0 && <span className="gigi-pd-bag__count">{cartCount}</span>}
          </a>
          <button
            className="gigi-pd-menu"
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            aria-controls="gigi-menu"
          >
            Menu
          </button>
        </div>
      </header>

      <section className="gigi-pd" aria-label={product.name}>
        <div className="gigi-pd-gallery">
          <div className="gigi-pd-shot">
            <img src={img(product.image)} alt={`${product.name} front`} />
          </div>
          <div
            className="gigi-pd-shot gigi-pd-shot--back"
            role="img"
            aria-label={`${product.name} back`}
          />
        </div>

        <div className="gigi-pd-info">
          <h1 className="gigi-pd-info__title">{product.name}</h1>
          <p className="gigi-pd-info__tagline">{product.tagline}</p>
          <p className="gigi-pd-info__price">{product.price}</p>

          <div className="gigi-pd-field">
            <span className="gigi-pd-field__label">Colour</span>
            <div className="gigi-pd-colors">
              {product.colors.map((color, index) => (
                <button
                  key={color.name}
                  type="button"
                  className={`gigi-pd-color ${index === colorIndex ? 'is-active' : ''}`}
                  style={{background: color.hex}}
                  aria-label={color.name}
                  aria-pressed={index === colorIndex}
                  onClick={() => setColorIndex(index)}
                />
              ))}
            </div>
          </div>

          <div className="gigi-pd-field">
            <span className="gigi-pd-field__label">Size</span>
            <div className="gigi-pd-sizes">
              {product.sizes.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`gigi-pd-size ${option === size ? 'is-active' : ''}`}
                  aria-pressed={option === size}
                  onClick={() => setSize(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="gigi-pd-field">
            <span className="gigi-pd-field__label">Quantity</span>
            <div className="gigi-pd-buy">
              <div className="gigi-pd-qty">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="gigi-pd-qty__value">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                className="gigi-pd-add"
                type="button"
                onClick={() => addToCart(quantity)}
              >
                Add to Cart
              </button>
            </div>
          </div>

          <div className="gigi-pd-acc">
            {ACCORDIONS.map((acc) => {
              const isOpen = openAcc === acc.id;
              return (
                <div key={acc.id}>
                  <button
                    className="gigi-pd-acc__head"
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenAcc(isOpen ? null : acc.id)}
                  >
                    {acc.label}
                    <span
                      className={`gigi-pd-acc__icon ${isOpen ? 'is-open' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div className="gigi-pd-acc__body">{product[acc.field]}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="gigi-pd-related" aria-label="You may also like">
          <h2 className="gigi-pd-related__title">You may also like</h2>
          <div className="gigi-pd-rail">
            <button
              className="gigi-pd-arrow"
              type="button"
              aria-label="Previous"
              onClick={() =>
                setRailIndex(
                  (current) => (current - 1 + related.length) % related.length,
                )
              }
            >
              <ChevronIcon direction="left" />
            </button>
            <div className="gigi-pd-related__track">
              {visibleRelated.map((item) => (
                <RelatedCard
                  key={`${item.handle}-${railIndex}`}
                  product={item}
                  onAdd={() => addToCart(1)}
                />
              ))}
            </div>
            <button
              className="gigi-pd-arrow"
              type="button"
              aria-label="Next"
              onClick={() =>
                setRailIndex((current) => (current + 1) % related.length)
              }
            >
              <ChevronIcon direction="right" />
            </button>
          </div>
        </section>
      )}

      <GigiFooter compact />
    </div>
  );
}

function RelatedCard({
  product,
  onAdd,
}: {
  product: GigiProduct;
  onAdd: () => void;
}) {
  return (
    <article className="gigi-pd-rcard">
      <Link
        to={`/products/${product.handle}`}
        prefetch="intent"
        className="gigi-pd-rcard__img"
        aria-label={product.name}
      >
        <img src={img(product.image)} alt={product.name} loading="lazy" />
      </Link>
      <div className="gigi-pd-rcard__meta">
        <Link to={`/products/${product.handle}`} className="gigi-pd-rcard__name">
          {product.name}
        </Link>
        <span className="gigi-pd-rcard__price">{product.price}</span>
      </div>
      <button className="gigi-pd-rcard__cart" type="button" onClick={onAdd}>
        Add to Cart
      </button>
    </article>
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

function ChevronIcon({direction}: {direction: 'left' | 'right'}) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={direction === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  );
}
