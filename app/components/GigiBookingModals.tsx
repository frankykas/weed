import {useEffect, type ReactNode} from 'react';

type LightboxProps = {
  children: ReactNode;
  labelledBy: string;
  onClose: () => void;
  variant?: 'signin' | 'confirm';
};

function GigiLightbox({
  children,
  labelledBy,
  onClose,
  variant = 'signin',
}: LightboxProps) {
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
    <div className="gigi-modal-overlay" role="presentation">
      <button
        className="gigi-modal-scrim"
        type="button"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div
        className={`gigi-modal gigi-modal--${variant}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        <button
          className="gigi-modal__close"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>
  );
}

export function GigiSignInBookingModal({onClose}: {onClose: () => void}) {
  return (
    <GigiLightbox labelledBy="gigi-signin-title" onClose={onClose}>
      <h2 id="gigi-signin-title" className="gigi-modal__title">
        Welcome!
      </h2>
      <p className="gigi-modal__subtitle">Sign In</p>
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
        <a className="gigi-modal__link" href="/account/login">
          I Forgot my password
        </a>
        <a
          className="gigi-modal__submit"
          href="/account/login?return_to=%2Fbook%23book-now"
        >
          Log In
        </a>
        <a
          className="gigi-modal__link"
          href="/account/login?return_to=%2Fbook%23book-now"
        >
          I don&apos;t have an account.
        </a>
      </form>
    </GigiLightbox>
  );
}

export type GigiBookingClass = {
  name: string;
  staff?: string;
  time: string;
  bookUrl: string;
};

export function GigiBookingConfirmationModal({
  bookingClass,
  onClose,
}: {
  bookingClass: GigiBookingClass;
  onClose: () => void;
}) {
  return (
    <GigiLightbox
      labelledBy="gigi-confirm-title"
      onClose={onClose}
      variant="confirm"
    >
      <h2 id="gigi-confirm-title" className="gigi-modal__title">
        Booking Confirmation
      </h2>
      <div className="gigi-modal__class">
        <strong>{bookingClass.name}</strong>
        {bookingClass.staff && <em>{bookingClass.staff}</em>}
        <span>{bookingClass.time}</span>
      </div>
      <a className="gigi-modal__submit" href={bookingClass.bookUrl}>
        Confirm
      </a>
      <button className="gigi-modal__link" type="button" onClick={onClose}>
        I&apos;m still thinking about it
      </button>
    </GigiLightbox>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
