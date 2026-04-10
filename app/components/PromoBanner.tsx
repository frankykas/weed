interface PromoBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  badge?: string;
  className?: string;
}

export function PromoBanner({
  title,
  subtitle,
  description,
  image,
  ctaLabel,
  onCtaClick,
  badge,
  className = '',
}: PromoBannerProps) {
  return (
    <section
      className={`
        relative
        bg-surface rounded-2xl
        shadow-card
        border border-border-light
        ${className}
      `.trim()}
    >
      <div className="flex flex-col sm:flex-row sm:items-stretch">
        {/* Text */}
        <div className="relative z-10 flex-1 flex flex-col justify-center p-block sm:py-section sm:pl-section sm:pr-grid">
          {badge && (
            <span className="self-start mb-2.5 px-2.5 py-1 bg-accent text-white text-[0.625rem] font-bold tracking-widest uppercase rounded-full">
              {badge}
            </span>
          )}

          {subtitle && (
            <p className="text-xs font-medium tracking-wide uppercase text-tertiary mb-1">
              {subtitle}
            </p>
          )}

          <h2 className="text-xl sm:text-2xl font-semibold text-primary leading-tight tracking-tight mb-2">
            {title}
          </h2>

          {description && (
            <p className="text-sm text-secondary leading-relaxed mb-5 max-w-sm">
              {description}
            </p>
          )}

          {ctaLabel && (
            <button
              type="button"
              onClick={onCtaClick}
              className="
                self-start
                inline-flex items-center gap-1.5
                px-5 py-2.5
                bg-accent text-white
                text-sm font-medium
                rounded-full
                transition-all duration-200 ease-[var(--ease-out)]
                hover:bg-accent-hover hover:shadow-card
                active:scale-[0.97]
              "
            >
              {ctaLabel}
              <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </button>
          )}
        </div>

        {/* Image — slight lift on desktop via negative margin */}
        <div className="relative sm:w-[42%] shrink-0 p-block sm:p-element">
          <img
            src={image}
            alt={title}
            className="
              w-full h-full min-h-[200px]
              object-cover
              rounded-xl
              sm:-mt-4 sm:-mb-4 sm:-mr-1
              sm:shadow-raised
            "
          />
        </div>
      </div>
    </section>
  );
}
