import {useEffect, useState} from 'react';
import {Link} from 'react-router';
import type {Route} from './+types/checkout_.confirmed';
import {loadLastOrder, type LastOrder} from '~/lib/mockCart';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Greenly — Order Confirmed'}];
};

export default function CheckoutConfirmed() {
  const [order, setOrder] = useState<LastOrder | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setOrder(loadLastOrder());
    setLoaded(true);
  }, []);

  if (loaded && !order) {
    return (
      <div className="max-w-content mx-auto px-gutter py-section">
        <div className="max-w-md mx-auto text-center py-16">
          <h1 className="text-2xl font-bold text-primary mb-2">
            No recent order
          </h1>
          <p className="text-sm text-tertiary mb-6">
            We couldn&apos;t find a confirmation on this device.
          </p>
          <Link
            to="/collections/all"
            className="inline-flex items-center gap-2 px-5 py-3 bg-accent text-white text-sm font-semibold rounded-full hover:bg-accent-hover transition-colors"
          >
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-content mx-auto px-gutter py-section">
        <div className="h-40" />
      </div>
    );
  }

  const placedAt = new Date(order.placedAt);
  const placedLabel = placedAt.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="max-w-content mx-auto px-gutter pt-8 sm:pt-12 pb-section">
      {/* Hero */}
      <div className="max-w-2xl mx-auto text-center mb-8 animate-fade-in">
        <div className="inline-flex size-20 rounded-full bg-accent-light items-center justify-center mb-5 animate-check-pop">
          <CheckIcon />
        </div>
        <p className="text-xs font-bold tracking-widest uppercase text-accent mb-2">
          Order placed
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight mb-2">
          Thanks, {firstName(order.fullName)}!
        </h1>
        <p className="text-sm sm:text-base text-secondary leading-relaxed">
          Your order{' '}
          <strong className="text-primary">{order.orderNumber}</strong> is on
          its way. We sent a confirmation to{' '}
          <strong className="text-primary">{order.email}</strong>.
        </p>
      </div>

      <div className="max-w-2xl mx-auto grid gap-5">
        {/* Delivery banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-lime-100 via-emerald-50 to-teal-50 border border-border-light p-5 sm:p-6">
          <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/40 blur-2xl" />
          <div className="relative z-10 flex items-start gap-4">
            <div className="shrink-0 size-12 rounded-2xl bg-white flex items-center justify-center shadow-card">
              <TruckIcon />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[0.65rem] font-bold tracking-widest uppercase text-accent mb-1">
                Estimated delivery
              </p>
              <p className="text-lg font-bold text-primary leading-tight">
                {order.deliveryEstimate}
              </p>
              <p className="text-xs text-secondary mt-1 leading-relaxed">
                To {order.address}, {order.city} {order.zip}
              </p>
              <p className="text-[0.7rem] text-tertiary mt-2">
                A valid 21+ ID will be verified at the door.
              </p>
            </div>
          </div>
        </div>

        {/* Order details card */}
        <div className="rounded-2xl border border-border-light bg-surface overflow-hidden">
          <div className="px-5 py-4 border-b border-border-light flex items-center justify-between">
            <div>
              <p className="text-[0.65rem] font-semibold text-tertiary uppercase tracking-widest">
                Order
              </p>
              <p className="text-sm font-bold text-primary">
                {order.orderNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[0.65rem] font-semibold text-tertiary uppercase tracking-widest">
                Placed
              </p>
              <p className="text-sm font-medium text-primary">{placedLabel}</p>
            </div>
          </div>

          <ul className="divide-y divide-border-light">
            {order.lines.map((line) => (
              <li key={line.id} className="flex gap-3.5 px-5 py-4">
                <div className="relative shrink-0 size-16 rounded-xl bg-surface-sunken overflow-hidden flex items-center justify-center">
                  <img
                    src={line.image}
                    alt={line.title}
                    className="w-[75%] h-[75%] object-contain drop-shadow"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-primary">
                    {line.title}
                  </p>
                  <p className="text-xs text-tertiary">
                    {line.weight} · {line.strain}
                  </p>
                  <p className="text-[0.7rem] text-tertiary mt-0.5">
                    Qty {line.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-primary tabular-nums shrink-0">
                  ${(line.unitPriceValue * line.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>

          <div className="px-5 py-4 border-t border-border-light bg-surface-sunken/50 space-y-1.5">
            <SummaryRow
              label="Subtotal"
              value={`$${order.subtotal.toFixed(2)}`}
            />
            <SummaryRow
              label="Delivery"
              value={
                order.delivery === 0 ? 'Free' : `$${order.delivery.toFixed(2)}`
              }
            />
            <SummaryRow label="Tax" value={`$${order.tax.toFixed(2)}`} />
            <div className="h-px bg-border-light my-1.5" />
            <SummaryRow
              label="Total"
              value={`$${order.total.toFixed(2)}`}
              bold
            />
            <p className="text-[0.65rem] text-tertiary pt-2">
              Paid with card ending ···· {order.lastFour}
            </p>
          </div>
        </div>

        {/* What next */}
        <div className="rounded-2xl border border-border-light bg-surface p-5">
          <h3 className="text-sm font-bold text-primary mb-3">
            What happens next
          </h3>
          <ol className="space-y-3">
            <NextStep
              step={1}
              title="Order confirmed"
              description="You'll get an email receipt in the next minute."
              active
            />
            <NextStep
              step={2}
              title="Prepared & packed"
              description="We pack it discreetly and hand it to a driver."
            />
            <NextStep
              step={3}
              title="On the way"
              description="You'll get a tracking link when the driver heads out."
            />
            <NextStep
              step={4}
              title="ID verified, delivered"
              description="Show your 21+ ID at the door and enjoy."
            />
          </ol>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/collections/all"
            className="flex-1 flex items-center justify-center h-12 bg-accent text-white text-sm font-semibold rounded-full hover:bg-accent-hover active:scale-[0.98] transition-all duration-200 ease-[var(--ease-out)]"
          >
            Keep shopping
          </Link>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center h-12 bg-surface border border-border-light text-primary text-sm font-semibold rounded-full hover:bg-surface-sunken transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  SUB COMPONENTS
// ============================================================

function SummaryRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={
          bold ? 'text-sm font-bold text-primary' : 'text-xs text-secondary'
        }
      >
        {label}
      </span>
      <span
        className={
          bold
            ? 'text-base font-bold text-primary tabular-nums'
            : 'text-xs font-medium text-primary tabular-nums'
        }
      >
        {value}
      </span>
    </div>
  );
}

function NextStep({
  step,
  title,
  description,
  active,
}: {
  step: number;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <li className="flex gap-3">
      <span
        className={`
          shrink-0 size-7 rounded-full flex items-center justify-center text-[0.7rem] font-bold
          ${
            active
              ? 'bg-accent text-white'
              : 'bg-surface-sunken text-tertiary'
          }
        `}
      >
        {step}
      </span>
      <div className="flex-1 min-w-0 pt-0.5">
        <p
          className={`text-sm font-semibold leading-tight ${active ? 'text-primary' : 'text-secondary'}`}
        >
          {title}
        </p>
        <p className="text-xs text-tertiary mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
    </li>
  );
}

function firstName(full: string) {
  return full.trim().split(/\s+/)[0] || 'there';
}

// ============================================================
//  ICONS
// ============================================================

function CheckIcon() {
  return (
    <svg
      className="size-10 text-accent"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      className="size-6 text-accent"
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
