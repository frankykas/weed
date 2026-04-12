import {Link} from 'react-router';
import type {CollectionFilters, FilterFacets} from '~/lib/collectionFilters';

// ============================================================
//  QUICK EFFECTS BAR
//  Shows top effects in this collection as colored shortcut pills.
//  Tap to apply/remove the effect filter in one action.
// ============================================================

const EFFECT_STYLES: Record<
  string,
  {bg: string; bgActive: string; text: string}
> = {
  Relaxed: {
    bg: 'bg-violet-50 hover:bg-violet-100',
    bgActive: 'bg-violet-500 text-white',
    text: 'text-violet-700',
  },
  Energetic: {
    bg: 'bg-amber-50 hover:bg-amber-100',
    bgActive: 'bg-amber-500 text-white',
    text: 'text-amber-700',
  },
  Happy: {
    bg: 'bg-yellow-50 hover:bg-yellow-100',
    bgActive: 'bg-yellow-500 text-white',
    text: 'text-yellow-800',
  },
  Focused: {
    bg: 'bg-sky-50 hover:bg-sky-100',
    bgActive: 'bg-sky-500 text-white',
    text: 'text-sky-700',
  },
  Creative: {
    bg: 'bg-fuchsia-50 hover:bg-fuchsia-100',
    bgActive: 'bg-fuchsia-500 text-white',
    text: 'text-fuchsia-700',
  },
  Sleepy: {
    bg: 'bg-indigo-50 hover:bg-indigo-100',
    bgActive: 'bg-indigo-500 text-white',
    text: 'text-indigo-700',
  },
  Calm: {
    bg: 'bg-teal-50 hover:bg-teal-100',
    bgActive: 'bg-teal-500 text-white',
    text: 'text-teal-700',
  },
  Uplifted: {
    bg: 'bg-orange-50 hover:bg-orange-100',
    bgActive: 'bg-orange-500 text-white',
    text: 'text-orange-700',
  },
  Social: {
    bg: 'bg-pink-50 hover:bg-pink-100',
    bgActive: 'bg-pink-500 text-white',
    text: 'text-pink-700',
  },
  Balanced: {
    bg: 'bg-emerald-50 hover:bg-emerald-100',
    bgActive: 'bg-emerald-500 text-white',
    text: 'text-emerald-700',
  },
};

const DEFAULT_STYLE = {
  bg: 'bg-lime-50 hover:bg-lime-100',
  bgActive: 'bg-lime-500 text-white',
  text: 'text-lime-700',
};

export function QuickEffectsBar({
  filters,
  setFilters,
  facets,
  max = 8,
}: {
  filters: CollectionFilters;
  setFilters: (f: CollectionFilters) => void;
  facets: FilterFacets;
  max?: number;
}) {
  if (facets.effects.length === 0) return null;
  const effects = facets.effects.slice(0, max);

  const toggle = (effect: string) => {
    const active = filters.effects.includes(effect);
    setFilters({
      ...filters,
      effects: active
        ? filters.effects.filter((e) => e !== effect)
        : [...filters.effects, effect],
    });
  };

  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2.5">
        <SparkleIcon className="size-3.5 text-accent" />
        <h2 className="text-xs font-bold uppercase tracking-wider text-tertiary">
          Shop by effect
        </h2>
      </div>
      <div className="overflow-x-auto scrollbar-none -mx-gutter px-gutter">
        <div className="flex gap-2 pb-1">
          {effects.map((effect) => {
            const active = filters.effects.includes(effect);
            const style = EFFECT_STYLES[effect] ?? DEFAULT_STYLE;
            return (
              <button
                key={effect}
                type="button"
                onClick={() => toggle(effect)}
                className={`
                  shrink-0 px-3.5 py-2 rounded-xl
                  text-xs font-bold
                  border
                  transition-all duration-200 ease-[var(--ease-out)]
                  active:scale-95
                  ${
                    active
                      ? `${style.bgActive} border-transparent shadow-card`
                      : `${style.bg} ${style.text} border-border-light hover:shadow-card`
                  }
                `.trim()}
              >
                {effect}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  VALUE PROPS STRIP
//  Trust-builder row: Lab Tested / Discreet / Fast / Returns
// ============================================================

export function ValuePropsStrip() {
  const props = [
    {
      icon: <BeakerIcon className="size-5" />,
      title: 'Lab Tested',
      subtitle: 'Third-party verified',
      accent: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    },
    {
      icon: <PackageIcon className="size-5" />,
      title: 'Discreet',
      subtitle: 'Plain packaging',
      accent: 'bg-sky-50 text-sky-700 border-sky-200/60',
    },
    {
      icon: <BoltIcon className="size-5" />,
      title: 'Fast Delivery',
      subtitle: 'Same-day in area',
      accent: 'bg-amber-50 text-amber-700 border-amber-200/60',
    },
    {
      icon: <ReturnIcon className="size-5" />,
      title: 'Easy Returns',
      subtitle: '30-day guarantee',
      accent: 'bg-violet-50 text-violet-700 border-violet-200/60',
    },
  ];

  return (
    <div className="mb-6 overflow-x-auto scrollbar-none -mx-gutter px-gutter">
      <div className="flex gap-2.5 sm:grid sm:grid-cols-4 sm:gap-3">
        {props.map((p) => (
          <div
            key={p.title}
            className={`shrink-0 sm:shrink flex items-center gap-3 px-3.5 py-3 rounded-2xl border ${p.accent} min-w-[180px] sm:min-w-0`}
          >
            <div className="shrink-0 size-10 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm">
              {p.icon}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold leading-tight">{p.title}</div>
              <div className="text-[0.65rem] opacity-80 leading-tight">
                {p.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
//  INLINE PROMO CARD (fits in product grid)
// ============================================================

export function InlinePromoCard() {
  return (
    <Link
      to="/collections/all"
      prefetch="intent"
      className="group block relative overflow-hidden rounded-2xl aspect-square bg-gradient-to-br from-lime-300 via-emerald-400 to-teal-500 p-4 sm:p-5 flex flex-col justify-between text-white shadow-card hover:shadow-raised transition-all duration-300 ease-[var(--ease-out)] hover:-translate-y-0.5"
    >
      <div className="absolute -right-6 -top-6 size-24 rounded-full bg-white/20 blur-xl" />
      <div className="absolute -left-6 -bottom-6 size-28 rounded-full bg-white/15 blur-2xl" />

      <div className="relative z-10">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/25 backdrop-blur-sm rounded-full text-[0.55rem] font-bold tracking-widest uppercase">
          <SparkleIcon className="size-2.5" />
          Deal
        </span>
      </div>

      <div className="relative z-10">
        <div className="text-2xl sm:text-3xl font-black tracking-tight leading-none mb-1">
          Bundle 3
        </div>
        <div className="text-2xl sm:text-3xl font-black tracking-tight leading-none mb-2">
          Save 15%
        </div>
        <p className="text-[0.65rem] sm:text-xs opacity-90 leading-snug mb-3">
          Mix &amp; match any 3 items in one order
        </p>
        <div className="inline-flex items-center gap-1 text-[0.65rem] sm:text-xs font-bold group-hover:gap-2 transition-all duration-200">
          Shop the deal
          <ArrowRightIcon className="size-3" />
        </div>
      </div>
    </Link>
  );
}

// ============================================================
//  STRAIN FINDER CTA BANNER
// ============================================================

export function StrainFinderCTA() {
  return (
    <section className="mt-10">
      <Link
        to="/"
        prefetch="intent"
        className="group block relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 px-5 py-6 sm:px-10 sm:py-10 text-white shadow-card hover:shadow-raised transition-all duration-300 ease-[var(--ease-out)]"
      >
        {/* Decorative blobs */}
        <div className="absolute -right-16 -top-16 size-56 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 size-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-24 top-8 size-20 rounded-full bg-lime-300/30 blur-2xl hidden sm:block" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="shrink-0 size-14 sm:size-16 flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30">
            <WandIcon className="size-7 sm:size-8" />
          </div>
          <div className="flex-1">
            <span className="inline-block mb-2 px-2.5 py-1 bg-white/20 backdrop-blur-sm text-[0.6rem] font-bold tracking-widest uppercase rounded-full">
              Not sure where to start?
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight mb-1">
              Take the Strain Finder quiz
            </h2>
            <p className="text-sm sm:text-base opacity-90 max-w-lg leading-relaxed">
              Answer 3 quick questions and we&apos;ll match you to the perfect
              pick in under a minute.
            </p>
          </div>
          <div className="shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-white text-violet-700 rounded-2xl text-sm font-bold shadow-card group-hover:gap-3 group-hover:shadow-raised transition-all duration-200">
            Start the quiz
            <ArrowRightIcon className="size-4" />
          </div>
        </div>
      </Link>
    </section>
  );
}

// ============================================================
//  ICONS
// ============================================================

function SparkleIcon({className}: {className?: string}) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowRightIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
      />
    </svg>
  );
}

function BeakerIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c.251.023.501.05.75.082m-.75-.082a24.301 24.301 0 0 0-4.5 0m4.5 0v5.714c0 .597.237 1.17.659 1.591L14.25 14.5m0 0 1.546 1.546a2.25 2.25 0 0 0 3.182 0l.621-.621M14.25 14.5 9.75 18.75m0 0a3 3 0 1 1-3-3.75m3 3.75a3 3 0 1 0-3-3.75"
      />
    </svg>
  );
}

function PackageIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
      />
    </svg>
  );
}

function BoltIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 13.5 13.5 3l-4.5 8.25h6.75L6 21l4.5-7.5H3.75Z"
      />
    </svg>
  );
}

function ReturnIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
      />
    </svg>
  );
}

function WandIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
      />
    </svg>
  );
}
