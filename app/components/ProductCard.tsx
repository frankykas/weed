interface ProductCardProps {
  title: string;
  price: string;
  image: string;
  tags?: string[];
  className?: string;
}

export function ProductCard({
  title,
  price,
  image,
  tags,
  className = '',
}: ProductCardProps) {
  return (
    <article
      className={`group ${className}`.trim()}
    >
      {/* IMAGE — Inset with negative margin so it overlaps
          the card below. Uses margin-based overlap instead of
          absolute positioning so it flows naturally in any grid. */}
      <div className="px-3 sm:px-4">
        <div className="relative -mb-6">
          <img
            src={image}
            alt={title}
            className="
              w-full aspect-[3/4] object-cover
              rounded-xl
              shadow-raised
              -rotate-1
              transition-all duration-500 ease-[var(--ease-out)]
              group-hover:rotate-0
              group-hover:-translate-y-1.5
              group-hover:shadow-overlay
            "
          />
        </div>
      </div>

      {/* CARD BODY */}
      <div
        className="
          bg-surface rounded-xl
          shadow-card
          border border-border-light
          px-4 pt-9 pb-4
          transition-shadow duration-300 ease-[var(--ease-out)]
          group-hover:shadow-raised
        "
      >
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="
                  px-2 py-0.5
                  bg-surface-sunken
                  text-tertiary text-[0.625rem] font-semibold
                  tracking-wide uppercase
                  rounded-full
                "
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-sm font-semibold text-primary leading-snug line-clamp-2 mb-1.5">
          {title}
        </h3>

        {/* Price */}
        <p className="text-sm font-medium text-secondary">
          {price}
        </p>
      </div>
    </article>
  );
}
