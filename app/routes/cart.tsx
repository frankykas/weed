import {data, Link, type HeadersFunction} from 'react-router';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import type {Route} from './+types/cart';
import {useCart, type CartLine} from '~/lib/mockCart';
import {GigiHeader} from '~/components/GigiHeader';
import {GigiFooter} from '~/components/GigiFooter';
import cartStyles from '~/styles/gigi-cart.css?url';

export function links() {
  return [{rel: 'stylesheet', href: cartStyles}];
}

export const meta: Route.MetaFunction = () => {
  return [{title: 'Your Bag | GIGI'}];
};

export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

export async function action({request, context}: Route.ActionArgs) {
  if (!context.cart) {
    return data(
      {cart: null, errors: ['Shopify store not connected']},
      {status: 503},
    );
  }

  const {cart} = context;
  const formData = await request.formData();
  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];
      discountCodes.push(...inputs.discountCodes);
      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesAdd: {
      const formGiftCardCode = inputs.giftCardCode;
      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];
      result = await cart.addGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes as string[];
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate:
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;
  const redirectTo = formData.get('redirectTo') ?? null;

  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export async function loader({context}: Route.LoaderArgs) {
  return context.cart ? await context.cart.get() : null;
}

const SHIPPING = 5;
const TAXES = 15;

export default function Cart() {
  const {lines, subtotal, totalQuantity, updateQuantity, removeLine, hydrated} =
    useCart();
  const hasLines = lines.length > 0;
  const shipping = hasLines ? SHIPPING : 0;
  const taxes = hasLines ? TAXES : 0;
  const total = subtotal + shipping + taxes;

  return (
    <div className="gigi-site gigi-cart-page">
      <GigiHeader />

      <main className="gigi-cart-shell" aria-labelledby="cart-title">
        <h1 className="gigi-cart-title" id="cart-title">
          <em>your</em>
          <span>bag</span>
        </h1>

        <div className="gigi-cart-layout">
          <section className="gigi-cart-items" aria-label="Shopping bag">
            {!hydrated && (
              <p className="gigi-cart-empty">Loading your bag...</p>
            )}

            {hydrated && !hasLines && (
              <div className="gigi-cart-empty">
                <p>Your bag is empty.</p>
                <Link to="/shop">Shop GIGI</Link>
              </div>
            )}

            {hasLines && (
              <ul>
                {lines.map((line) => (
                  <CartRow
                    key={line.id}
                    line={line}
                    onDecrease={() =>
                      updateQuantity(line.id, line.quantity - 1)
                    }
                    onIncrease={() =>
                      updateQuantity(line.id, line.quantity + 1)
                    }
                    onRemove={() => removeLine(line.id)}
                  />
                ))}
              </ul>
            )}
          </section>

          <OrderSummary
            subtotal={subtotal}
            totalQuantity={totalQuantity}
            shipping={shipping}
            taxes={taxes}
            total={total}
          />
        </div>
      </main>

      <GigiFooter compact />
    </div>
  );
}

function CartRow({
  line,
  onDecrease,
  onIncrease,
  onRemove,
}: {
  line: CartLine;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}) {
  return (
    <li className="gigi-cart-row">
      <Link
        className="gigi-cart-row__image"
        to={`/products/${line.productHandle}`}
        aria-label={line.title}
      >
        <img src={line.image} alt={line.title} loading="lazy" />
      </Link>

      <div className="gigi-cart-row__copy">
        <div>
          <Link
            className="gigi-cart-row__title"
            to={`/products/${line.productHandle}`}
          >
            {line.title}
          </Link>
          <p>{line.subtitle}</p>
          <p>
            Size: {line.weight}
            {line.color ? ` · Color: ${line.color}` : ''}
          </p>
          <p>{line.unitPrice} each</p>
        </div>

        <div className="gigi-cart-row__controls">
          <span>Quantity</span>
          <div className="gigi-cart-stepper">
            <button
              type="button"
              onClick={onDecrease}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span>{line.quantity}</span>
            <button
              type="button"
              onClick={onIncrease}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="gigi-cart-remove"
            onClick={onRemove}
            aria-label={`Remove ${line.title}`}
          >
            Remove
          </button>
        </div>

        <strong>${(line.unitPriceValue * line.quantity).toFixed(0)} USD</strong>
      </div>
    </li>
  );
}

function OrderSummary({
  subtotal,
  totalQuantity,
  shipping,
  taxes,
  total,
}: {
  subtotal: number;
  totalQuantity: number;
  shipping: number;
  taxes: number;
  total: number;
}) {
  return (
    <aside className="gigi-cart-summary" aria-label="Order summary">
      <h2>Order Summary</h2>
      <div className="gigi-cart-summary__body">
        <div className="gigi-cart-summary__topline">
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

        <div className="gigi-cart-summary__total">
          <span>Total</span>
          <strong>${total.toFixed(0)} USD</strong>
        </div>

        <Link className="gigi-cart-checkout" to="/checkout">
          Check Out
        </Link>
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
