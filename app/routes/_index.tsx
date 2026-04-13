import {Link} from 'react-router';
import type {Route} from './+types/_index';
import {StrainFinder} from '~/components/StrainFinder';
import {BottomNavigation} from '~/components/BottomNavigation';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Greenly — Premium Cannabis'}];
};

export async function loader({context}: Route.LoaderArgs) {
  // When a Shopify store is connected, you can query real data here.
  // For now, the page renders entirely from mock data defined below.
  return {};
}

// ============================================================
//  TYPES
// ============================================================

type StrainType = 'Sativa' | 'Indica' | 'Hybrid' | 'CBD';

interface Product {
  id: string;
  handle: string;
  title: string;
  strain: StrainType;
  thc: string;
  price: string;
  image: string;
  bgColor: string;
  blobColor: string;
}

// ============================================================
//  MOCK DATA
// ============================================================

const CATEGORIES = [
  {label: 'Flower', icon: <CatFlowerIcon />, to: '/collections/flower'},
  {label: 'Pre-Rolls', icon: <CatPreRollIcon />, to: '/collections/pre-rolls'},
  {label: 'Edibles', icon: <CatEdibleIcon />, to: '/collections/edibles'},
  {label: 'Concentrates', icon: <CatConcentrateIcon />, to: '/collections/concentrates'},
  {label: 'Vapes', icon: <CatVapeIcon />, to: '/collections/vapes'},
  {label: 'CBD', icon: <CatCBDIcon />, to: '/collections/cbd'},
];

const DEAL_OF_THE_DAY = {
  title: 'OG Kush — Top Shelf',
  subtitle: 'Hand-Trimmed · Lab Tested',
  originalPrice: '$79.99',
  salePrice: '$64.99',
  discount: '19% OFF',
  rating: 4,
  image: '/bud.webp',
};

const POPULAR_STRAINS: Product[] = [
  {
    id: 'p1',
    handle: 'blue-dream',
    title: 'Blue Dream',
    strain: 'Hybrid',
    thc: '21%',
    price: '$45',
    image: '/bud.webp',
    bgColor: 'bg-sky-50',
    blobColor: 'bg-sky-200/60',
  },
  {
    id: 'p2',
    handle: 'girl-scout-cookies',
    title: 'Girl Scout Cookies',
    strain: 'Hybrid',
    thc: '25%',
    price: '$52',
    image: '/bud.webp',
    bgColor: 'bg-amber-50',
    blobColor: 'bg-amber-200/60',
  },
  {
    id: 'p3',
    handle: 'northern-lights',
    title: 'Northern Lights',
    strain: 'Indica',
    thc: '18%',
    price: '$40',
    image: '/bud.webp',
    bgColor: 'bg-violet-50',
    blobColor: 'bg-violet-200/60',
  },
];

const PRODUCTS: Product[] = [
  {
    id: '1',
    handle: 'kali-mist',
    title: 'Kali Mist',
    strain: 'Sativa',
    thc: '22%',
    price: '$42.00',
    image: '/bud.webp',
    bgColor: 'bg-amber-50',
    blobColor: 'bg-amber-200/50',
  },
  {
    id: '2',
    handle: 'granddaddy-purple',
    title: 'Granddaddy Purple',
    strain: 'Indica',
    thc: '20%',
    price: '$48.00',
    image: '/bud.webp',
    bgColor: 'bg-purple-50',
    blobColor: 'bg-purple-200/50',
  },
  {
    id: '3',
    handle: 'orange-bud',
    title: 'Orange Bud',
    strain: 'Hybrid',
    thc: '19%',
    price: '$38.00',
    image: '/bud.webp',
    bgColor: 'bg-orange-50',
    blobColor: 'bg-orange-200/50',
  },
  {
    id: '4',
    handle: 'amnesia-haze',
    title: 'Amnesia Haze',
    strain: 'Sativa',
    thc: '24%',
    price: '$52.00',
    image: '/bud.webp',
    bgColor: 'bg-lime-50',
    blobColor: 'bg-lime-200/50',
  },
  {
    id: '5',
    handle: 'wedding-cake-flower',
    title: 'Wedding Cake',
    strain: 'Hybrid',
    thc: '25%',
    price: '$55.00',
    image: '/bud.webp',
    bgColor: 'bg-rose-50',
    blobColor: 'bg-rose-200/50',
  },
  {
    id: '6',
    handle: 'gorilla-glue-flower',
    title: 'Gorilla Glue',
    strain: 'Indica',
    thc: '26%',
    price: '$58.00',
    image: '/bud.webp',
    bgColor: 'bg-teal-50',
    blobColor: 'bg-teal-200/50',
  },
];

const TRUST_BADGES = [
  {icon: <LabIcon />, label: 'Lab Tested', sub: '3rd party verified'},
  {icon: <OrganicIcon />, label: 'Organic', sub: 'No pesticides'},
  {icon: <TruckIcon />, label: 'Discreet', sub: 'Plain packaging'},
  {icon: <ShieldIcon />, label: 'ID Verified', sub: 'Safe delivery'},
];

const STRAIN_COLORS: Record<StrainType, string> = {
  Sativa: 'bg-amber-400 text-amber-950',
  Indica: 'bg-violet-400 text-violet-950',
  Hybrid: 'bg-emerald-400 text-emerald-950',
  CBD: 'bg-sky-400 text-sky-950',
};

// ============================================================
//  HOMEPAGE
// ============================================================

export default function Homepage() {
  return (
    <div className="pb-24 sm:pb-0 bg-bg min-h-screen">
      {/* ---- Hero ---- */}
      <div className="px-gutter pt-5 pb-2">
        <p className="text-xs font-medium text-accent tracking-wide uppercase mb-1">
          Premium Cannabis
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight leading-tight mb-1">
          Elevate your experience
        </h1>
        <p className="text-sm text-secondary leading-relaxed max-w-md">
          Curated strains, lab-tested potency, delivered discreetly to your
          door.
        </p>
      </div>

      {/* ---- Strain Finder CTA ---- */}
      <div className="px-gutter pt-4">
        <StrainFinder />
      </div>

      {/* ---- Categories ---- */}
      <div className="pt-6 px-gutter">
        <h2 className="text-lg font-bold text-primary tracking-tight mb-3">
          Browse Categories
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              to={cat.to}
              prefetch="intent"
              className="
                flex flex-col items-center gap-1.5
                py-3.5 px-2
                bg-surface rounded-2xl
                border border-border-light
                transition-all duration-200 ease-[var(--ease-out)]
                hover:border-accent/30 hover:shadow-card hover:-translate-y-0.5
                active:scale-95
                group
              "
            >
              <span className="text-primary">{cat.icon}</span>
              <span className="text-xs font-semibold text-primary group-hover:text-accent transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* ---- Deal of the Day ---- */}
      <div className="px-gutter pt-7">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-red-500">
              <FireIcon />
            </span>
            <h2 className="text-lg font-bold text-primary tracking-tight">
              Deal of the Day
            </h2>
          </div>
          <DealTimer />
        </div>
        <DealCard />
      </div>

      {/* ---- Trust Bar ---- */}
      <div className="px-gutter pt-7">
        <div className="overflow-x-auto scrollbar-none -mx-gutter px-gutter">
          <div className="flex gap-3 pb-1">
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge.label}
                className="
                  shrink-0 flex items-center gap-2.5
                  px-4 py-3
                  bg-surface rounded-2xl
                  border border-border-light
                "
              >
                <div className="size-9 rounded-xl bg-accent-light flex items-center justify-center text-accent shrink-0">
                  {badge.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-primary leading-snug">
                    {badge.label}
                  </p>
                  <p className="text-[0.6rem] text-tertiary">{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---- Trending Now — horizontal scroll ---- */}
      <div className="pt-7">
        <div className="flex items-center justify-between px-gutter mb-3">
          <div className="flex items-center gap-1.5">
            <span className="text-orange-500">
              <TrendingIcon />
            </span>
            <h2 className="text-lg font-bold text-primary tracking-tight">
              Trending Now
            </h2>
          </div>
          <Link
            to="/collections/all"
            className="flex items-center gap-0.5 text-xs font-medium text-accent"
          >
            See all <ArrowRightIcon />
          </Link>
        </div>

        <div className="overflow-x-auto scrollbar-none">
          <div className="flex gap-3 px-gutter pb-1">
            {POPULAR_STRAINS.map((strain) => (
              <PopularStrainCard key={strain.id} product={strain} />
            ))}
            <Link
              to="/collections/all"
              className="shrink-0 w-[140px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface-sunken/50 hover:border-accent/30 hover:bg-accent-light/20 transition-colors"
            >
              <span className="text-tertiary mb-1">
                <PlusCircleIcon />
              </span>
              <span className="text-xs font-medium text-tertiary">
                View all
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ---- Promo Banner ---- */}
      <div className="px-gutter pt-7">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 px-5 py-5 sm:py-6">
          <div className="absolute -right-10 -top-10 size-44 rounded-full bg-white/[0.06]" />
          <div className="absolute right-20 -bottom-10 size-32 rounded-full bg-white/[0.04]" />

          <div className="relative z-10 flex items-center gap-4">
            <div className="flex-1">
              <span className="inline-block px-2 py-0.5 bg-white/15 text-[0.55rem] font-bold tracking-widest uppercase text-white/90 rounded-full mb-2">
                New Customers
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug mb-1">
                Get 15% off your first order
              </h3>
              <p className="text-[0.7rem] text-white/60 leading-relaxed mb-3">
                Use code <span className="font-bold text-white/90">GREENLY15</span> at
                checkout. Min. order $50.
              </p>
              <Link
                to="/collections/all"
                className="
                  inline-flex items-center gap-1.5
                  px-4 py-2
                  bg-white text-emerald-800
                  text-xs font-bold
                  rounded-full
                  transition-all duration-200
                  hover:shadow-raised
                  active:scale-95
                "
              >
                Shop Now
                <svg
                  className="size-3.5"
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
              </Link>
            </div>
            <div className="hidden sm:block shrink-0 w-[120px]">
              <img
                src="/bud.webp"
                alt=""
                className="w-full object-contain opacity-60"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ---- Shop All ---- */}
      <div className="px-gutter pt-7 pb-section">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-primary tracking-tight">
            Shop All
          </h2>
          <Link
            to="/collections/all"
            className="flex items-center gap-0.5 text-xs font-medium text-accent"
          >
            View all <ArrowRightIcon />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* ---- Legal footer ---- */}
      <div className="px-gutter pb-6 text-center">
        <p className="text-[0.6rem] text-tertiary leading-relaxed">
          Must be 21+ to purchase. Valid government-issued ID required at
          delivery. Products are tested for potency and contaminants.
        </p>
      </div>

      {/* ---- Bottom nav ---- */}
      <BottomNavigation
        items={[
          {label: 'Home', icon: <HomeFilledIcon />, active: true},
          {label: 'Wishlist', icon: <HeartIcon />},
          {label: 'Bag', icon: <BagIcon />},
          {label: 'Account', icon: <UserIcon />},
        ]}
      />
    </div>
  );
}

// ============================================================
//  DEAL CARD
// ============================================================

function DealCard() {
  return (
    <Link
      to="/products/og-kush"
      prefetch="intent"
      className="block relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 p-5 min-h-[230px]"
    >
      {/* Decorative shapes */}
      <div className="absolute -right-6 -top-6 size-36 rounded-full bg-white/[0.07]" />
      <div className="absolute right-16 -bottom-8 size-28 rounded-full bg-white/[0.05]" />

      {/* Sale badge */}
      <div className="absolute top-3.5 right-3.5 z-20">
        <span className="px-2.5 py-1 bg-red-500 text-white text-[0.6rem] font-bold rounded-lg shadow-lg">
          {DEAL_OF_THE_DAY.discount}
        </span>
      </div>

      {/* Text side */}
      <div className="relative z-10 max-w-[55%]">
        <span className="inline-block px-2.5 py-0.5 mb-2.5 bg-white/15 backdrop-blur-sm text-[0.6rem] font-bold tracking-widest uppercase text-white/90 rounded-full">
          Staff Pick
        </span>

        <div className="flex gap-0.5 text-yellow-300 mb-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <StarIcon key={i} filled={i <= DEAL_OF_THE_DAY.rating} />
          ))}
        </div>

        <h3 className="text-base font-bold text-white leading-snug mb-0.5">
          {DEAL_OF_THE_DAY.title}
        </h3>
        <p className="text-[0.65rem] text-blue-200/70 mb-3">
          {DEAL_OF_THE_DAY.subtitle}
        </p>

        <div className="flex items-end gap-2.5">
          <p className="text-xl font-extrabold text-white">
            {DEAL_OF_THE_DAY.salePrice}
          </p>
          <p className="text-sm text-white/40 line-through mb-0.5">
            {DEAL_OF_THE_DAY.originalPrice}
          </p>
        </div>

        <span
          className="
            mt-3
            inline-flex items-center gap-1
            px-4 py-1.5
            bg-white text-blue-700
            text-xs font-bold
            rounded-full
            shadow-raised
            transition-all duration-200
            hover:bg-blue-50
            active:scale-95
          "
        >
          Shop Now
        </span>
      </div>

      {/* Product image */}
      <div className="absolute right-0 bottom-0 top-0 w-[45%] flex items-center justify-center pointer-events-none">
        <img
          src={DEAL_OF_THE_DAY.image}
          alt={DEAL_OF_THE_DAY.title}
          className="w-[75%] h-[75%] object-contain drop-shadow-2xl"
        />
      </div>
    </Link>
  );
}

// ============================================================
//  DEAL TIMER
// ============================================================

function DealTimer() {
  // Mock countdown — in production you'd use a real timer
  return (
    <div className="flex items-center gap-1">
      <TimerBlock value="08" />
      <span className="text-xs font-bold text-tertiary">:</span>
      <TimerBlock value="42" />
      <span className="text-xs font-bold text-tertiary">:</span>
      <TimerBlock value="15" />
    </div>
  );
}

function TimerBlock({value}: {value: string}) {
  return (
    <span className="inline-flex items-center justify-center min-w-[1.75rem] px-1.5 py-0.5 bg-primary text-white text-[0.65rem] font-bold rounded-md tabular-nums">
      {value}
    </span>
  );
}

// ============================================================
//  POPULAR STRAIN CARD (horizontal scroll)
// ============================================================

function PopularStrainCard({product}: {product: Product}) {
  return (
    <Link
      to={`/products/${product.handle}`}
      prefetch="intent"
      className="group shrink-0 w-[140px]"
    >
      <div
        className={`
          relative rounded-2xl overflow-hidden
          ${product.bgColor}
          aspect-[3/4]
          flex items-center justify-center
          mb-2
        `}
      >
        <div
          className={`absolute inset-3 rounded-[45%_55%_50%_50%/55%_45%_55%_45%] ${product.blobColor}`}
        />
        <img
          src={product.image}
          alt={product.title}
          className="relative z-10 w-[60%] h-[60%] object-contain drop-shadow-lg transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-110"
        />
        <span
          className={`absolute top-2 left-2 z-20 px-1.5 py-0.5 text-[0.55rem] font-bold rounded-md ${STRAIN_COLORS[product.strain]}`}
        >
          {product.strain}
        </span>
      </div>
      <h3 className="text-xs font-semibold text-primary leading-snug mb-0.5 truncate">
        {product.title}
      </h3>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-accent">{product.price}</span>
        <span className="text-[0.6rem] text-tertiary font-medium">
          THC {product.thc}
        </span>
      </div>
    </Link>
  );
}

// ============================================================
//  PRODUCT CARD (grid)
// ============================================================

function ProductCard({product}: {product: Product}) {
  return (
    <Link
      to={`/products/${product.handle}`}
      prefetch="intent"
      className="group"
    >
      <div
        className={`
          relative rounded-2xl overflow-hidden
          ${product.bgColor}
          aspect-square
          flex items-center justify-center
          mb-2
        `}
      >
        <div
          className={`absolute inset-4 rounded-[40%_60%_55%_45%/50%_40%_60%_50%] ${product.blobColor}`}
        />
        <img
          src={product.image}
          alt={product.title}
          className="relative z-10 w-[62%] h-[62%] object-contain drop-shadow-lg transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105"
        />

        <span
          className={`absolute top-2.5 left-2.5 z-20 px-2 py-0.5 text-[0.6rem] font-bold rounded-lg ${STRAIN_COLORS[product.strain]}`}
        >
          {product.strain}
        </span>

        <span className="absolute top-2.5 right-2.5 z-20 px-1.5 py-0.5 bg-black/40 backdrop-blur-sm text-[0.6rem] font-bold text-white rounded-lg">
          {product.thc} THC
        </span>

        <span
          className="
            absolute bottom-2.5 right-2.5 z-20
            size-8 flex items-center justify-center
            bg-white/90 backdrop-blur-sm
            rounded-xl shadow-card
            text-accent
            opacity-0 translate-y-1
            transition-all duration-200 ease-[var(--ease-out)]
            group-hover:opacity-100 group-hover:translate-y-0
          "
        >
          <svg
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </span>
      </div>

      <h3 className="text-sm font-semibold text-primary leading-snug mb-0.5 group-hover:text-accent transition-colors">
        {product.title}
      </h3>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-accent">{product.price}</span>
        <span className="text-[0.6rem] text-tertiary font-medium">
          {product.thc} THC
        </span>
      </div>
    </Link>
  );
}

// ============================================================
//  MOOD ICONS — Premium outline style, size-6
// ============================================================

function MoodRelaxIcon() {
  return (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
    </svg>
  );
}

function MoodEnergizeIcon() {
  return (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
  );
}

function MoodCreateIcon() {
  return (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  );
}

function MoodSleepIcon() {
  return (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  );
}

function MoodSocialIcon() {
  return (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  );
}

function MoodReliefIcon() {
  return (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  );
}

// ============================================================
//  CATEGORY ICONS — Premium outline style, size-6
// ============================================================

function CatFlowerIcon() {
  return (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75c3.314 0 6-2.015 6-4.5 0-1.655-1.196-3.112-3-3.87.804-.758 1.5-1.88 1.5-3.13 0-2.485-2.015-4.5-4.5-4.5S7.5 4.765 7.5 7.25c0 1.25.696 2.372 1.5 3.13-1.804.758-3 2.215-3 3.87 0 2.485 2.686 4.5 6 4.5Zm0 0v2.5" />
    </svg>
  );
}

function CatPreRollIcon() {
  return (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z" />
    </svg>
  );
}

function CatEdibleIcon() {
  return (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Z" />
    </svg>
  );
}

function CatConcentrateIcon() {
  return (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M5 14.5l-1.751 1.751a1.519 1.519 0 0 0 .19 2.327c3.146 2.056 6.966 3.172 10.811 3.172 1.522 0 3.013-.173 4.45-.501a1.516 1.516 0 0 0 .899-2.373L19.8 15.3M5 14.5l2.25 2.25" />
    </svg>
  );
}

function CatVapeIcon() {
  return (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z" />
    </svg>
  );
}

function CatCBDIcon() {
  return (
    <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M5 14.5l-1.751 1.751a1.519 1.519 0 0 0 .19 2.327c3.146 2.056 6.966 3.172 10.811 3.172 1.522 0 3.013-.173 4.45-.501a1.516 1.516 0 0 0 .899-2.373L19.8 15.3M5 14.5l2.25 2.25" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9" />
    </svg>
  );
}

// ============================================================
//  ICONS
// ============================================================

function FireIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      className="size-4"
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

function PlusCircleIcon() {
  return (
    <svg
      className="size-6"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

function StarIcon({filled}: {filled: boolean}) {
  return (
    <svg
      className="size-3.5"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
      />
    </svg>
  );
}

function HomeFilledIcon() {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
      <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
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

function UserIcon() {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  );
}

function LabIcon() {
  return (
    <svg
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M5 14.5l-1.751 1.751a1.519 1.519 0 0 0 .19 2.327c3.146 2.056 6.966 3.172 10.811 3.172 1.522 0 3.013-.173 4.45-.501a1.516 1.516 0 0 0 .899-2.373L19.8 15.3M5 14.5l2.25 2.25"
      />
    </svg>
  );
}

function OrganicIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.988-1.106a48.554 48.554 0 0 0-10.024 0 1.106 1.106 0 0 0-.988 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
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
      strokeWidth={1.5}
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

// ============================================================
//  GRAPHQL
// ============================================================

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
