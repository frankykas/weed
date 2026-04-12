import {useState, type FormEvent} from 'react';
import {Link, useNavigate} from 'react-router';
import type {Route} from './+types/checkout';
import {useCart, saveLastOrder, type LastOrder} from '~/lib/mockCart';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Greenly — Checkout'}];
};

const DELIVERY_SLOTS = [
  {id: 'asap', label: 'ASAP', detail: '30–60 min', fee: 6},
  {id: 'today-evening', label: 'Today evening', detail: '5pm – 9pm', fee: 4},
  {id: 'tomorrow-am', label: 'Tomorrow AM', detail: '9am – 12pm', fee: 3},
  {id: 'tomorrow-pm', label: 'Tomorrow PM', detail: '1pm – 5pm', fee: 3},
];

const FREE_SHIPPING_THRESHOLD = 50;
const TAX_RATE = 0.0875;

interface FormState {
  email: string;
  fullName: string;
  phone: string;
  address: string;
  apt: string;
  city: string;
  zip: string;
  slotId: string;
  cardNumber: string;
  cardExp: string;
  cardCvc: string;
  cardName: string;
  saveInfo: boolean;
  idConfirmed: boolean;
}

const EMPTY_FORM: FormState = {
  email: '',
  fullName: '',
  phone: '',
  address: '',
  apt: '',
  city: '',
  zip: '',
  slotId: 'asap',
  cardNumber: '',
  cardExp: '',
  cardCvc: '',
  cardName: '',
  saveInfo: true,
  idConfirmed: false,
};

export default function Checkout() {
  const navigate = useNavigate();
  const {lines, subtotal, totalQuantity, clearCart, hydrated} = useCart();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const slot =
    DELIVERY_SLOTS.find((s) => s.id === form.slotId) ?? DELIVERY_SLOTS[0];
  const deliveryFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : slot.fee;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + deliveryFee + tax;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({...f, [key]: value}));
    if (errors[key as string]) {
      setErrors((e) => {
        const next = {...e};
        delete next[key as string];
        return next;
      });
    }
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email required';
    if (form.fullName.trim().length < 2) e.fullName = 'Name required';
    if (form.phone.replace(/\D/g, '').length < 7) e.phone = 'Phone required';
    if (form.address.trim().length < 3) e.address = 'Address required';
    if (form.city.trim().length < 2) e.city = 'City required';
    if (!/^\d{5}$/.test(form.zip)) e.zip = '5-digit ZIP';
    if (form.cardNumber.replace(/\D/g, '').length < 13)
      e.cardNumber = 'Card number invalid';
    if (!/^\d{2}\/\d{2}$/.test(form.cardExp)) e.cardExp = 'MM/YY';
    if (!/^\d{3,4}$/.test(form.cardCvc)) e.cardCvc = 'CVC';
    if (form.cardName.trim().length < 2) e.cardName = 'Name on card required';
    if (!form.idConfirmed) e.idConfirmed = 'You must confirm 21+';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) {
      // scroll to first error
      const firstKey = Object.keys(errors)[0];
      if (firstKey) {
        document.getElementById(`field-${firstKey}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      return;
    }
    setSubmitting(true);

    // Simulate processing
    await new Promise((r) => setTimeout(r, 900));

    const lastFour = form.cardNumber.replace(/\D/g, '').slice(-4);
    const orderNumber = `GL-${Math.floor(100000 + Math.random() * 900000)}`;
    const order: LastOrder = {
      orderNumber,
      lines,
      subtotal,
      delivery: deliveryFee,
      tax,
      total,
      placedAt: new Date().toISOString(),
      deliveryEstimate: `${slot.label} — ${slot.detail}`,
      email: form.email,
      fullName: form.fullName,
      address: form.apt ? `${form.address}, ${form.apt}` : form.address,
      city: form.city,
      zip: form.zip,
      deliverySlot: slot.label,
      lastFour,
    };

    saveLastOrder(order);
    clearCart();
    void navigate('/checkout/confirmed');
  }

  // Empty cart state
  if (hydrated && lines.length === 0) {
    return (
      <div className="max-w-content mx-auto px-gutter py-section">
        <div className="max-w-md mx-auto text-center py-16">
          <div className="inline-flex size-20 rounded-2xl bg-surface-sunken items-center justify-center mb-5">
            <BagOutlineIcon />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            Your bag is empty
          </h1>
          <p className="text-sm text-tertiary mb-6 leading-relaxed">
            Add something to your bag before heading to checkout.
          </p>
          <Link
            to="/collections/all"
            className="inline-flex items-center gap-2 px-5 py-3 bg-accent text-white text-sm font-semibold rounded-full hover:bg-accent-hover transition-colors"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto px-gutter pt-6 sm:pt-10 pb-section">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-xs text-tertiary mb-2">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRightMini />
          <span className="text-primary font-medium">Checkout</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
          Checkout
        </h1>
        <p className="text-sm text-secondary mt-1">
          Secure, discreet delivery — 21+ with valid ID on arrival.
        </p>
      </div>

      <form
        onSubmit={(e) => void onSubmit(e)}
        className="grid gap-8 lg:grid-cols-[1fr_380px] lg:gap-10 items-start"
      >
        {/* ============ LEFT: form sections ============ */}
        <div className="space-y-6">
          {/* Contact */}
          <Section
            step={1}
            title="Contact"
            description="We'll text you delivery updates."
          >
            <Field
              id="field-email"
              label="Email"
              error={errors.email}
              input={
                <input
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass(errors.email)}
                />
              }
            />
            <Field
              id="field-phone"
              label="Phone"
              error={errors.phone}
              input={
                <input
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className={inputClass(errors.phone)}
                />
              }
            />
          </Section>

          {/* Delivery */}
          <Section
            step={2}
            title="Delivery address"
            description="Driver will verify ID at the door."
          >
            <Field
              id="field-fullName"
              label="Full name"
              error={errors.fullName}
              input={
                <input
                  type="text"
                  autoComplete="name"
                  value={form.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  placeholder="Jane Appleseed"
                  className={inputClass(errors.fullName)}
                />
              }
            />
            <Field
              id="field-address"
              label="Street address"
              error={errors.address}
              input={
                <input
                  type="text"
                  autoComplete="address-line1"
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  placeholder="123 Main St"
                  className={inputClass(errors.address)}
                />
              }
            />
            <Field
              id="field-apt"
              label="Apartment, suite, etc. (optional)"
              input={
                <input
                  type="text"
                  autoComplete="address-line2"
                  value={form.apt}
                  onChange={(e) => update('apt', e.target.value)}
                  placeholder="Apt 4B"
                  className={inputClass()}
                />
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <Field
                id="field-city"
                label="City"
                error={errors.city}
                input={
                  <input
                    type="text"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(e) => update('city', e.target.value)}
                    placeholder="Brooklyn"
                    className={inputClass(errors.city)}
                  />
                }
              />
              <Field
                id="field-zip"
                label="ZIP"
                error={errors.zip}
                input={
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    value={form.zip}
                    onChange={(e) =>
                      update('zip', e.target.value.replace(/\D/g, '').slice(0, 5))
                    }
                    placeholder="11201"
                    className={inputClass(errors.zip)}
                  />
                }
              />
            </div>
          </Section>

          {/* Delivery slot */}
          <Section
            step={3}
            title="Delivery window"
            description="Pick the slot that works for you."
          >
            <div className="grid grid-cols-2 gap-2.5">
              {DELIVERY_SLOTS.map((s) => {
                const active = form.slotId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => update('slotId', s.id)}
                    className={`
                      relative text-left rounded-2xl border p-3.5
                      transition-all duration-200 ease-[var(--ease-out)]
                      ${
                        active
                          ? 'border-accent bg-accent-light shadow-card'
                          : 'border-border-light bg-surface hover:border-border'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-primary">
                        {s.label}
                      </span>
                      {active && (
                        <span className="size-4 rounded-full bg-accent flex items-center justify-center">
                          <CheckMini />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-tertiary">{s.detail}</p>
                    <p className="text-[0.7rem] font-semibold text-accent mt-1">
                      {subtotal >= FREE_SHIPPING_THRESHOLD
                        ? 'Free'
                        : `$${s.fee.toFixed(2)}`}
                    </p>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Payment */}
          <Section
            step={4}
            title="Payment"
            description="Encrypted. We never store full card details."
          >
            <Field
              id="field-cardNumber"
              label="Card number"
              error={errors.cardNumber}
              input={
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    value={form.cardNumber}
                    onChange={(e) =>
                      update(
                        'cardNumber',
                        formatCardNumber(e.target.value),
                      )
                    }
                    placeholder="1234 1234 1234 1234"
                    className={inputClass(errors.cardNumber) + ' pr-12'}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary">
                    <CardIcon />
                  </span>
                </div>
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <Field
                id="field-cardExp"
                label="Expiry"
                error={errors.cardExp}
                input={
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    value={form.cardExp}
                    onChange={(e) =>
                      update('cardExp', formatExpiry(e.target.value))
                    }
                    placeholder="MM/YY"
                    className={inputClass(errors.cardExp)}
                  />
                }
              />
              <Field
                id="field-cardCvc"
                label="CVC"
                error={errors.cardCvc}
                input={
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    value={form.cardCvc}
                    onChange={(e) =>
                      update(
                        'cardCvc',
                        e.target.value.replace(/\D/g, '').slice(0, 4),
                      )
                    }
                    placeholder="123"
                    className={inputClass(errors.cardCvc)}
                  />
                }
              />
            </div>
            <Field
              id="field-cardName"
              label="Name on card"
              error={errors.cardName}
              input={
                <input
                  type="text"
                  autoComplete="cc-name"
                  value={form.cardName}
                  onChange={(e) => update('cardName', e.target.value)}
                  placeholder="Jane Appleseed"
                  className={inputClass(errors.cardName)}
                />
              }
            />
          </Section>

          {/* Compliance */}
          <div className="rounded-2xl border border-border-light bg-surface-sunken p-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                id="field-idConfirmed"
                type="checkbox"
                checked={form.idConfirmed}
                onChange={(e) => update('idConfirmed', e.target.checked)}
                className="mt-0.5 size-4 rounded border-border text-accent focus:ring-accent/30"
              />
              <span className="text-xs text-secondary leading-relaxed">
                I confirm I am <strong className="text-primary">21+</strong>{' '}
                and will present a valid government-issued ID to the driver.
                Orders delivered to unverified recipients will be returned.
              </span>
            </label>
            {errors.idConfirmed && (
              <p className="text-xs text-error mt-2">{errors.idConfirmed}</p>
            )}
          </div>
        </div>

        {/* ============ RIGHT: order summary ============ */}
        <aside className="lg:sticky lg:top-24">
          <div className="rounded-2xl border border-border-light bg-surface overflow-hidden shadow-card">
            <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
              <h2 className="text-sm font-bold text-primary">Order summary</h2>
              <span className="text-[0.7rem] font-medium text-tertiary">
                {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Line items */}
            <ul className="divide-y divide-border-light max-h-[20rem] overflow-y-auto">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-3 px-5 py-3">
                  <div className="relative shrink-0 size-14 rounded-xl bg-surface-sunken overflow-hidden flex items-center justify-center">
                    <img
                      src={line.image}
                      alt={line.title}
                      className="w-[75%] h-[75%] object-contain drop-shadow"
                    />
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center bg-primary text-white text-[0.6rem] font-bold rounded-full">
                      {line.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-primary truncate">
                      {line.title}
                    </p>
                    <p className="text-[0.7rem] text-tertiary truncate">
                      {line.weight} · {line.strain}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-primary tabular-nums shrink-0">
                    ${(line.unitPriceValue * line.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>

            {/* Promo input */}
            <div className="px-5 py-3 border-t border-border-light">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code"
                  className="flex-1 px-3 py-2 text-xs bg-surface-sunken border border-transparent rounded-lg focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                />
                <button
                  type="button"
                  className="px-3 py-2 text-xs font-semibold text-secondary hover:text-primary transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Totals */}
            <div className="px-5 py-4 border-t border-border-light space-y-1.5 bg-surface-sunken/50">
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <Row
                label="Delivery"
                value={
                  deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`
                }
                highlight={deliveryFee === 0}
              />
              <Row label="Tax" value={`$${tax.toFixed(2)}`} />
              <div className="h-px bg-border-light my-2" />
              <Row
                label="Total"
                value={`$${total.toFixed(2)}`}
                bold
              />
            </div>

            {/* Place order button */}
            <div className="p-5 border-t border-border-light">
              <button
                type="submit"
                disabled={submitting}
                className="
                  w-full flex items-center justify-center gap-2
                  h-12
                  bg-accent text-white
                  text-sm font-semibold
                  rounded-full
                  transition-all duration-200 ease-[var(--ease-out)]
                  hover:bg-accent-hover
                  active:scale-[0.98]
                  disabled:opacity-60 disabled:cursor-not-allowed
                "
              >
                {submitting ? (
                  <>
                    <SpinnerIcon />
                    Processing…
                  </>
                ) : (
                  <>
                    <LockIcon />
                    Place order — ${total.toFixed(2)}
                  </>
                )}
              </button>
              <p className="text-[0.65rem] text-tertiary text-center mt-3 leading-relaxed">
                By placing your order you agree to our Terms and confirm
                you&apos;re 21+.
              </p>
            </div>
          </div>

          {/* Trust row */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <TrustBadge icon={<ShieldIcon />} label="Lab tested" />
            <TrustBadge icon={<LockIcon />} label="Encrypted" />
            <TrustBadge icon={<TruckIcon />} label="Discreet" />
          </div>
        </aside>
      </form>
    </div>
  );
}

// ============================================================
//  SUBCOMPONENTS
// ============================================================

function Section({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border-light bg-surface p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-4">
        <span className="shrink-0 size-7 rounded-full bg-accent-light text-accent text-xs font-bold flex items-center justify-center">
          {step}
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-primary leading-tight">
            {title}
          </h2>
          {description && (
            <p className="text-xs text-tertiary mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({
  id,
  label,
  input,
  error,
}: {
  id: string;
  label: string;
  input: React.ReactNode;
  error?: string;
}) {
  return (
    <label htmlFor={id} className="block" id={id}>
      <span className="block text-[0.7rem] font-semibold text-secondary uppercase tracking-wide mb-1.5">
        {label}
      </span>
      {input}
      {error && <p className="text-xs text-error mt-1">{error}</p>}
    </label>
  );
}

function Row({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`text-xs ${bold ? 'font-bold text-primary text-sm' : 'text-secondary'}`}
      >
        {label}
      </span>
      <span
        className={`tabular-nums ${
          bold
            ? 'font-bold text-primary text-base'
            : highlight
              ? 'font-semibold text-accent text-xs'
              : 'font-medium text-primary text-xs'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function TrustBadge({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-surface-sunken py-2.5 text-tertiary">
      <span className="text-secondary">{icon}</span>
      <span className="text-[0.6rem] font-semibold text-secondary">
        {label}
      </span>
    </div>
  );
}

function inputClass(error?: string) {
  return `w-full px-3.5 py-2.5 text-sm bg-surface border rounded-xl outline-none transition-colors ${
    error
      ? 'border-error focus:ring-2 focus:ring-error/20'
      : 'border-border-light focus:border-accent focus:ring-2 focus:ring-accent/20'
  }`;
}

function formatCardNumber(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 19);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 4);
  if (d.length < 3) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

// ============================================================
//  ICONS
// ============================================================

function ChevronRightMini() {
  return (
    <svg
      className="size-3 text-border"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.25 4.5 7.5 7.5-7.5 7.5"
      />
    </svg>
  );
}

function CheckMini() {
  return (
    <svg
      className="size-3 text-white"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={3}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-4.875a1.125 1.125 0 0 0-1.125 1.125v2.25c0 .621.504 1.125 1.125 1.125h4.875"
      />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg
      className="size-5"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="size-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        strokeOpacity="0.25"
        strokeLinecap="round"
      />
      <path d="M21 12a9 9 0 0 0-9-9" strokeLinecap="round" />
    </svg>
  );
}

function BagOutlineIcon() {
  return (
    <svg
      className="size-8 text-tertiary"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
      />
    </svg>
  );
}
