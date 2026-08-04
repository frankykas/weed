import {useEffect, useMemo, useState, type ReactNode} from 'react';

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

export function GigiSignInBookingModal({
  initialConnected = false,
  onClose,
  packageName,
}: {
  initialConnected?: boolean;
  onClose: () => void;
  packageName?: string;
}) {
  const [status, setStatus] = useState<
    'idle' | 'connecting' | 'connected' | 'error'
  >(initialConnected ? 'connected' : 'idle');
  const [error, setError] = useState('');
  const mindbodyLoginUrl = useMemo(() => {
    const params = new URLSearchParams({
      return_to: '/packages?mindbody=connected#packages',
    });
    return `/mindbody/login?${params.toString()}`;
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== 'gigi:mindbody-connected') return;

      if (event.data.connected) {
        setStatus('connected');
        setError('');
        return;
      }

      setStatus('error');
      setError(event.data.error || 'Mindbody login could not be completed.');
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'gigi:mindbody-auth' || !event.newValue) return;
      try {
        const payload = JSON.parse(event.newValue) as {
          connected?: boolean;
          error?: string;
        };
        if (payload.connected) {
          setStatus('connected');
          setError('');
        } else if (payload.error) {
          setStatus('error');
          setError(payload.error);
        }
      } catch {
        setStatus('error');
        setError('Mindbody login could not be completed.');
      }
    };

    window.addEventListener('message', onMessage);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('message', onMessage);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return (
    <GigiLightbox labelledBy="gigi-signin-title" onClose={onClose}>
      <h2 id="gigi-signin-title" className="gigi-modal__title">
        Welcome!
      </h2>
      <p className="gigi-modal__subtitle">
        {status === 'connected' ? 'Mindbody Connected' : 'Sign In'}
      </p>

      {status === 'connected' ? (
        <div className="gigi-modal__form">
          <p className="gigi-modal__note">
            {packageName
              ? `${packageName} is ready.`
              : 'Your Mindbody account is ready.'}
          </p>
          <a className="gigi-modal__submit" href="/book#book-now">
            Confirm
          </a>
          <button className="gigi-modal__link" type="button" onClick={onClose}>
            I&apos;m still thinking about it
          </button>
        </div>
      ) : (
        <div className="gigi-modal__form">
          <p className="gigi-modal__note">
            Log in securely through Mindbody, then come back here to continue.
          </p>
          <a
            className="gigi-modal__submit"
            href={mindbodyLoginUrl}
            target="gigi-mindbody-login"
            onClick={() => setStatus('connecting')}
          >
            Continue with Mindbody
          </a>
          {status === 'connecting' && (
            <button
              className="gigi-modal__link"
              type="button"
              onClick={() => setStatus('connected')}
            >
              I&apos;ve logged in
            </button>
          )}
          {status === 'error' && (
            <p className="gigi-modal__error" role="alert">
              {error}
            </p>
          )}
        </div>
      )}
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
