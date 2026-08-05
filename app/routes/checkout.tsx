import {useState, type FormEvent} from 'react';
import {useNavigate} from 'react-router';
import type {Route} from './+types/checkout';
import {
  useCart,
  saveLastOrder,
  type CartLine,
  type LastOrder,
} from '~/lib/mockCart';
import {GigiHeader} from '~/components/GigiHeader';
import {GigiFooter} from '~/components/GigiFooter';
import checkoutStyles from '~/styles/gigi-checkout.css?url';

export function links() {
  return [{rel: 'stylesheet', href: checkoutStyles}];
}

export const meta: Route.MetaFunction = () => {
  return [{title: 'Checkout | GIGI'}];
};

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
  const {lines, subtotal, totalQuantity, clearCart, hydrated} = useCart();
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
      <GigiHeader tone="light" />

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
              <div className="gigi-checkout-section">
                <div className="gigi-checkout-section__title">Ship to</div>
                <div className="gigi-checkout-fields">
                  <div className="gigi-checkout-field-row">
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
                  </div>
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
                  </div>
                  <div className="gigi-checkout-field-row">
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
              lines={lines}
              hydrated={hydrated}
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

      <GigiFooter compact dark />
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  type?: string;
}) {
  return (
    <label className={`gigi-checkout-input ${error ? 'has-error' : ''}`}>
      <span className="gigi-checkout-input__label">{placeholder}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
      />
      {error && <small className="gigi-checkout-input__error">{error}</small>}
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
  lines,
  hydrated,
  subtotal,
  totalQuantity,
  shipping,
  taxes,
  total,
  submitting,
}: {
  lines: CartLine[];
  hydrated: boolean;
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

        {hydrated && lines.length > 0 && (
          <ul className="gigi-checkout-lines">
            {lines.map((line) => (
              <li key={line.id} className="gigi-checkout-line">
                <span className="gigi-checkout-line__image">
                  <img src={line.image} alt="" loading="lazy" />
                  <span className="gigi-checkout-line__qty">
                    {line.quantity}
                  </span>
                </span>
                <span className="gigi-checkout-line__copy">
                  <strong>{line.title}</strong>
                  <small>
                    {line.weight}
                    {line.color ? ` · ${line.color}` : ''}
                  </small>
                </span>
                <span className="gigi-checkout-line__price">
                  ${(line.unitPriceValue * line.quantity).toFixed(0)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {hydrated && lines.length === 0 && (
          <p className="gigi-checkout-lines__empty">
            Your bag is empty. <a href="/shop">Shop GIGI</a>
          </p>
        )}

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

function productsLabel(totalQuantity: number) {
  if (totalQuantity === 0) return 'No Products';
  if (totalQuantity === 1) return 'One Product';
  if (totalQuantity === 2) return 'Two Products';
  return `${totalQuantity} Products`;
}



