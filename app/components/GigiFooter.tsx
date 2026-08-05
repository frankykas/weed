const img = (name: string) => `/gigi/${name}`;

/**
 * The shared GIGI footer. `dark` drops the burgundy panel background for pages
 * that already sit on burgundy; `compact` tightens the inner padding.
 *
 * The newsletter input's colour is page-specific — it reads the
 * `--gigi-newsletter-*` custom properties set on each page wrapper in app.css.
 */
export function GigiFooter({
  compact,
  dark,
}: {
  compact?: boolean;
  dark?: boolean;
}) {
  return (
    <footer
      className={`gigi-footer ${compact ? 'is-compact' : ''} ${
        dark ? 'is-dark' : ''
      }`}
    >
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
