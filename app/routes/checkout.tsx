import {useState, type FormEvent} from 'react';
import {useNavigate} from 'react-router';
import type {Route} from './+types/checkout';
import {useCart, saveLastOrder, type LastOrder} from '~/lib/mockCart';
import checkoutStyles from '~/styles/gigi-checkout.css?url';

export function links() {
  return [{rel: 'stylesheet', href: checkoutStyles}];
}

export const meta: Route.MetaFunction = () => {
  return [{title: 'Checkout | GIGI'}];
};

const img = (name: string) => `/gigi/${name}`;
const SHIPPING = 5;
const TAXES = 15;

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  number: string;
  interiorNumber: string;
  state: string;
  country: string;
  zip: string;
  references: string;
}

const EMPTY_FORM: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  street: '',
  number: '',
  interiorNumber: '',
  state: '',
  country: '',
  zip: '',
  references: '',
};

export default function Checkout() {
  const navigate = useNavigate();
  const {lines, subtotal, totalQuantity, clearCart} = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const shipping = lines.length > 0 ? SHIPPING : 0;
  const taxes = lines.length > 0 ? TAXES : 0;
  const total = subtotal + shipping + taxes;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({...current, [key]: value}));
    if (errors[key]) {
      setErrors((current) => {
        const next = {...current};
        delete next[key];
        return next;
      });
    }
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.firstName.trim()) next.firstName = 'Required';
    if (!form.lastName.trim()) next.lastName = 'Required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Valid email required';
    if (!form.street.trim()) next.street = 'Required';
    if (!form.state.trim()) next.state = 'Required';
    if (!form.country.trim()) next.country = 'Required';
    if (!form.zip.trim()) next.zip = 'Required';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 650));

    const fullName = `${form.firstName} ${form.lastName}`.trim();
    const order: LastOrder = {
      orderNumber: `GG-${Math.floor(100000 + Math.random() * 900000)}`,
      lines,
      subtotal,
      delivery: shipping,
      tax: taxes,
      total,
      placedAt: new Date().toISOString(),
      deliveryEstimate: 'Standard shipping',
      email: form.email,
      fullName,
      address: form.number ? `${form.street} ${form.number}` : form.street,
      city: form.state,
      zip: form.zip,
      deliverySlot: 'Standard',
      lastFour: '0000',
    };

    saveLastOrder(order);
    clearCart();
    void navigate('/checkout/confirmed');
  }

  return (
    <div className="gigi-site gigi-checkout-page">
      <GigiNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <header className="gigi-checkout-header">
        <a className="gigi-checkout-logo" href="/" aria-label="GIGI home">
          <img src={img('gigi-logo-cream.png')} alt="GIGI" />
        </a>
        <div className="gigi-checkout-header__actions">
          <a
            className="gigi-checkout-bag"
            href="/cart"
            aria-label={`Cart, ${totalQuantity} items`}
          >
            <BagIcon />
            {totalQuantity > 0 && (
              <span className="gigi-checkout-bag__count">{totalQuantity}</span>
            )}
          </a>
          <button
            className="gigi-checkout-menu"
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            aria-controls="gigi-menu"
          >
            Menu
          </button>
        </div>
      </header>

      <main className="gigi-checkout-shell" aria-labelledby="checkout-title">
        <form
          className="gigi-checkout-card"
          onSubmit={(event) => void onSubmit(event)}
        >
          <h1 id="checkout-title">checkout</h1>

          <div className="gigi-checkout-layout">
            <section
              className="gigi-checkout-form"
              aria-label="Checkout details"
            >
              <div className="gigi-checkout-section is-open">
                <div className="gigi-checkout-section__title">Ship to</div>
                <div className="gigi-checkout-fields">
                  <TextInput
                    value={form.firstName}
                    onChange={(value) => update('firstName', value)}
                    placeholder="First Name"
                    error={errors.firstName}
                  />
                  <TextInput
                    value={form.lastName}
                    onChange={(value) => update('lastName', value)}
                    placeholder="Last Name"
                    error={errors.lastName}
                  />
                  <TextInput
                    value={form.email}
                    onChange={(value) => update('email', value)}
                    placeholder="Email"
                    error={errors.email}
                    type="email"
                  />
                  <TextInput
                    value={form.street}
                    onChange={(value) => update('street', value)}
                    placeholder="Street"
                    error={errors.street}
                  />
                  <div className="gigi-checkout-field-row">
                    <TextInput
                      value={form.number}
                      onChange={(value) => update('number', value)}
                      placeholder="Number"
                    />
                    <TextInput
                      value={form.interiorNumber}
                      onChange={(value) => update('interiorNumber', value)}
                      placeholder="Interior Number"
                    />
                    <TextInput
                      value={form.state}
                      onChange={(value) => update('state', value)}
                      placeholder="State"
                      error={errors.state}
                    />
                    <TextInput
                      value={form.country}
                      onChange={(value) => update('country', value)}
                      placeholder="Country"
                      error={errors.country}
                    />
                  </div>
                  <TextInput
                    value={form.zip}
                    onChange={(value) => update('zip', value)}
                    placeholder="Zip Code"
                    error={errors.zip}
                  />
                  <TextInput
                    value={form.references}
                    onChange={(value) => update('references', value)}
                    placeholder="References"
                    className="gigi-checkout-reference-visual"
                  />
                </div>
              </div>

              <CheckoutFold title="Billing Address" detail="Same as Shipping" />
              <CheckoutFold
                title="Payment Method"
                detail="Credit card - 1234"
              />
              <CheckoutFold
                title="Shipping Method"
                detail="Shipments with discount"
              />
            </section>

            <OrderSummary
              subtotal={subtotal}
              totalQuantity={totalQuantity}
              shipping={shipping}
              taxes={taxes}
              total={total}
              submitting={submitting}
            />
          </div>
        </form>
      </main>

      <GigiFooter />
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  type?: string;
  className?: string;
}) {
  return (
    <label
      className={`gigi-checkout-input ${error ? 'has-error' : ''} ${className}`}
    >
      <span>{placeholder}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={placeholder}
        placeholder={placeholder}
      />
    </label>
  );
}

function CheckoutFold({title, detail}: {title: string; detail: string}) {
  return (
    <button className="gigi-checkout-fold" type="button">
      <span>
        <strong>{title}</strong>
        <small>{detail}</small>
      </span>
      <span aria-hidden="true">+</span>
    </button>
  );
}

function OrderSummary({
  subtotal,
  totalQuantity,
  shipping,
  taxes,
  total,
  submitting,
}: {
  subtotal: number;
  totalQuantity: number;
  shipping: number;
  taxes: number;
  total: number;
  submitting: boolean;
}) {
  return (
    <aside className="gigi-checkout-summary" aria-label="Order summary">
      <h2>Order Summary</h2>
      <div className="gigi-checkout-summary__body">
        <div className="gigi-checkout-summary__topline">
          <span>{productsLabel(totalQuantity)}</span>
          <strong>${subtotal.toFixed(0)} USD</strong>
        </div>

        <dl>
          <div>
            <dt>Shipping</dt>
            <dd>${shipping.toFixed(0)} USD</dd>
          </div>
          <div>
            <dt>Taxes</dt>
            <dd>${taxes.toFixed(0)} USD</dd>
          </div>
        </dl>

        <div className="gigi-checkout-summary__total">
          <span>Total</span>
          <strong>${total.toFixed(0)} USD</strong>
        </div>

        <button
          className="gigi-checkout-pay"
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'Processing' : 'Pay Now'}
        </button>
      </div>
    </aside>
  );
}

function GigiNav({isOpen, onClose}: {isOpen: boolean; onClose: () => void}) {
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
      <a href="/" onClick={onClose}>
        Home
      </a>
      <a href="/about" onClick={onClose}>
        <em>Our</em> Story
      </a>
      <a href="/packages" onClick={onClose}>
        Get Started
      </a>
      <span className="gigi-menu-sub">
        <a href="/packages" onClick={onClose}>
          Classes
        </a>
        <a href="/packages" onClick={onClose}>
          Packages
        </a>
        <a href="/book" onClick={onClose}>
          Book Now
        </a>
      </span>
      <a href="/shop" onClick={onClose}>
        Shop
      </a>
      <a href="/collab" onClick={onClose}>
        Collaborate with Gigi
      </a>
      <a href="/#contact" onClick={onClose}>
        Stay in Touch
      </a>
    </nav>
  );
}

function GigiFooter() {
  return (
    <footer className="gigi-footer is-compact is-dark">
      <div>
        <p>Follow Us</p>
        <div className="gigi-socials">
          <button>Instagram</button>
          <button>Tik Tok</button>
        </div>
        <p>Join our Newsletter</p>
        <div className="gigi-newsletter">
          <input aria-label="email" placeholder="email" />
          <button>Send</button>
        </div>
        <p>Contact Us</p>
        <small>
          Studio 00, 01234 St, Dubai, UAE
          <br />
          +971 50 111 2222
        </small>
      </div>
      <img className="gigi-footer-mark" src={img('g-footer.png')} alt="GIGI" />
    </footer>
  );
}

function productsLabel(totalQuantity: number) {
  if (totalQuantity === 0) return 'No Products';
  if (totalQuantity === 1) return 'One Product';
  if (totalQuantity === 2) return 'Two Products';
  return `${totalQuantity} Products`;
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
