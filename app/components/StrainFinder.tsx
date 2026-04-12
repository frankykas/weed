import {useState} from 'react';
import {Link} from 'react-router';

// ============================================================
//  TYPES
// ============================================================

interface QuizOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface QuizStep {
  title: string;
  subtitle: string;
  options: QuizOption[];
}

export type RecommendationStrain = 'Sativa' | 'Indica' | 'Hybrid' | 'CBD';

export interface StrainFinderRecommendation {
  title: string;
  description: string;
  strain: RecommendationStrain;
  collection: string;
  bg: string;
  accent: string;
  thc: string;
  price: string;
  vibeLabel: string;
}

interface RecommendationProduct {
  id: string;
  title: string;
  strain: RecommendationStrain;
  thc: string;
  price: string;
  image: string;
  bgColor: string;
  blobColor: string;
}

// ============================================================
//  QUIZ DATA
// ============================================================

const QUIZ_STEPS: QuizStep[] = [
  {
    title: "What's the vibe?",
    subtitle: "Pick the mood you're going for",
    options: [
      {
        id: 'relax',
        label: 'Unwind',
        icon: <MoonIcon />,
        description: 'Melt into the couch',
      },
      {
        id: 'energize',
        label: 'Energize',
        icon: <BoltIcon />,
        description: 'Get stuff done',
      },
      {
        id: 'create',
        label: 'Create',
        icon: <SparklesIcon />,
        description: 'Unlock ideas',
      },
      {
        id: 'social',
        label: 'Socialize',
        icon: <ChatIcon />,
        description: 'Good times with friends',
      },
      {
        id: 'sleep',
        label: 'Sleep',
        icon: <CloudIcon />,
        description: 'Drift off peacefully',
      },
      {
        id: 'relief',
        label: 'Relief',
        icon: <HeartPulseIcon />,
        description: 'Ease the tension',
      },
    ],
  },
  {
    title: 'Experience level?',
    subtitle: 'No judgment — we tailor the potency',
    options: [
      {
        id: 'newbie',
        label: 'First time',
        icon: <SeedlingIcon />,
        description: 'Gentle introduction',
      },
      {
        id: 'casual',
        label: 'Casual',
        icon: <LeafSmallIcon />,
        description: 'Once in a while',
      },
      {
        id: 'regular',
        label: 'Regular',
        icon: <PlantIcon />,
        description: 'I know my strains',
      },
      {
        id: 'connoisseur',
        label: 'Connoisseur',
        icon: <TreeIcon />,
        description: 'Bring the fire',
      },
    ],
  },
  {
    title: 'How do you like it?',
    subtitle: 'Pick your preferred consumption method',
    options: [
      {
        id: 'flower',
        label: 'Flower',
        icon: <FlameIcon />,
        description: 'Classic buds',
      },
      {
        id: 'prerolls',
        label: 'Pre-Rolls',
        icon: <CigaretteIcon />,
        description: 'Ready to go',
      },
      {
        id: 'edibles',
        label: 'Edibles',
        icon: <CookieIcon />,
        description: 'Tasty treats',
      },
      {
        id: 'vape',
        label: 'Vape',
        icon: <WindIcon />,
        description: 'Smooth & discreet',
      },
    ],
  },
];

// Simple mapping of answers → recommendation
const RECOMMENDATIONS: Record<string, StrainFinderRecommendation> = {
  relax: {
    title: 'Granddaddy Purple',
    description:
      'A legendary indica. Sweet grape and berry aroma with full-body relaxation. Perfect for unwinding after a long day.',
    strain: 'Indica',
    collection: '/collections/indica',
    bg: 'from-violet-600 to-purple-900',
    accent: 'bg-violet-400',
    thc: '20%',
    price: '$48.00',
    vibeLabel: 'Deep unwind',
  },
  energize: {
    title: 'Green Crack',
    description:
      "Don't let the name fool you - this sativa delivers sharp energy and focus. Tangy mango flavor with an invigorating buzz.",
    strain: 'Sativa',
    collection: '/collections/sativa',
    bg: 'from-amber-500 to-orange-700',
    accent: 'bg-amber-400',
    thc: '24%',
    price: '$52.00',
    vibeLabel: 'Bright energy',
  },
  create: {
    title: 'Blue Dream',
    description:
      'The ultimate creative hybrid. Blueberry sweetness meets cerebral stimulation. Ideas flow like water.',
    strain: 'Hybrid',
    collection: '/collections/hybrid',
    bg: 'from-sky-500 to-blue-800',
    accent: 'bg-sky-400',
    thc: '21%',
    price: '$45.00',
    vibeLabel: 'Creative lift',
  },
  social: {
    title: 'Pineapple Express',
    description:
      'Tropical, buzzy, and conversational. This hybrid is the life of the party — euphoric without being overwhelming.',
    strain: 'Hybrid',
    collection: '/collections/hybrid',
    bg: 'from-emerald-500 to-teal-800',
    accent: 'bg-emerald-400',
    thc: '22%',
    price: '$49.00',
    vibeLabel: 'Good company',
  },
  sleep: {
    title: 'Northern Lights',
    description:
      'The gold standard for nighttime use. Spicy-sweet pine aroma with heavy sedation. Lights out.',
    strain: 'Indica',
    collection: '/collections/indica',
    bg: 'from-indigo-600 to-slate-900',
    accent: 'bg-indigo-400',
    thc: '18%',
    price: '$40.00',
    vibeLabel: 'Night mode',
  },
  relief: {
    title: 'ACDC',
    description:
      'High CBD, low THC. Gentle relief without the high. Earthy, woody flavor with a calm, clear-headed effect.',
    strain: 'CBD',
    collection: '/collections/cbd',
    bg: 'from-teal-500 to-cyan-800',
    accent: 'bg-teal-400',
    thc: '8%',
    price: '$38.00',
    vibeLabel: 'Calm relief',
  },
};

const STRAIN_BADGE: Record<string, string> = {
  Sativa: 'bg-amber-400/20 text-amber-300',
  Indica: 'bg-violet-400/20 text-violet-300',
  Hybrid: 'bg-emerald-400/20 text-emerald-300',
  CBD: 'bg-sky-400/20 text-sky-300',
};

const RESULT_SECTION_BADGES: Record<RecommendationStrain, string> = {
  Sativa: 'bg-amber-400/15 text-amber-100 ring-1 ring-white/15',
  Indica: 'bg-violet-400/15 text-violet-100 ring-1 ring-white/15',
  Hybrid: 'bg-emerald-400/15 text-emerald-100 ring-1 ring-white/15',
  CBD: 'bg-sky-400/15 text-sky-100 ring-1 ring-white/15',
};

const RELATED_RECOMMENDATIONS: Record<RecommendationStrain, RecommendationProduct[]> = {
  Sativa: [
    {
      id: 'sf-s1',
      title: 'Kali Mist',
      strain: 'Sativa',
      thc: '22%',
      price: '$42.00',
      image: '/bud.webp',
      bgColor: 'bg-amber-50',
      blobColor: 'bg-amber-200/50',
    },
    {
      id: 'sf-s2',
      title: 'Amnesia Haze',
      strain: 'Sativa',
      thc: '24%',
      price: '$52.00',
      image: '/bud.webp',
      bgColor: 'bg-lime-50',
      blobColor: 'bg-lime-200/50',
    },
    {
      id: 'sf-s3',
      title: 'Super Lemon Haze',
      strain: 'Sativa',
      thc: '23%',
      price: '$46.00',
      image: '/bud.webp',
      bgColor: 'bg-yellow-50',
      blobColor: 'bg-yellow-200/60',
    },
  ],
  Indica: [
    {
      id: 'sf-i1',
      title: 'Northern Lights',
      strain: 'Indica',
      thc: '18%',
      price: '$40.00',
      image: '/bud.webp',
      bgColor: 'bg-violet-50',
      blobColor: 'bg-violet-200/60',
    },
    {
      id: 'sf-i2',
      title: 'Gorilla Glue',
      strain: 'Indica',
      thc: '26%',
      price: '$58.00',
      image: '/bud.webp',
      bgColor: 'bg-teal-50',
      blobColor: 'bg-teal-200/50',
    },
    {
      id: 'sf-i3',
      title: 'Purple Punch',
      strain: 'Indica',
      thc: '24%',
      price: '$50.00',
      image: '/bud.webp',
      bgColor: 'bg-fuchsia-50',
      blobColor: 'bg-fuchsia-200/60',
    },
  ],
  Hybrid: [
    {
      id: 'sf-h1',
      title: 'Blue Dream',
      strain: 'Hybrid',
      thc: '21%',
      price: '$45.00',
      image: '/bud.webp',
      bgColor: 'bg-sky-50',
      blobColor: 'bg-sky-200/60',
    },
    {
      id: 'sf-h2',
      title: 'Wedding Cake',
      strain: 'Hybrid',
      thc: '25%',
      price: '$55.00',
      image: '/bud.webp',
      bgColor: 'bg-rose-50',
      blobColor: 'bg-rose-200/50',
    },
    {
      id: 'sf-h3',
      title: 'Gelato',
      strain: 'Hybrid',
      thc: '23%',
      price: '$51.00',
      image: '/bud.webp',
      bgColor: 'bg-emerald-50',
      blobColor: 'bg-emerald-200/60',
    },
  ],
  CBD: [
    {
      id: 'sf-c1',
      title: 'Charlottes Web',
      strain: 'CBD',
      thc: '9%',
      price: '$39.00',
      image: '/bud.webp',
      bgColor: 'bg-sky-50',
      blobColor: 'bg-sky-200/60',
    },
    {
      id: 'sf-c2',
      title: 'Harlequin',
      strain: 'CBD',
      thc: '10%',
      price: '$41.00',
      image: '/bud.webp',
      bgColor: 'bg-cyan-50',
      blobColor: 'bg-cyan-200/60',
    },
    {
      id: 'sf-c3',
      title: 'Cannatonic',
      strain: 'CBD',
      thc: '11%',
      price: '$43.00',
      image: '/bud.webp',
      bgColor: 'bg-teal-50',
      blobColor: 'bg-teal-200/60',
    },
  ],
};

function getRelatedRecommendations(
  recommendation: StrainFinderRecommendation,
): RecommendationProduct[] {
  return RELATED_RECOMMENDATIONS[recommendation.strain].filter(
    (product) => product.title !== recommendation.title,
  );
}

// ============================================================
//  COMPONENT
// ============================================================

export function StrainFinder() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const totalSteps = QUIZ_STEPS.length;
  const isResult = step >= totalSteps;
  const currentStep = QUIZ_STEPS[step];

  const handleSelect = (optionId: string) => {
    const newAnswers = [...answers, optionId];
    setAnswers(newAnswers);
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleReset = () => {
    setStep(0);
    setAnswers([]);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset after animation
    setTimeout(() => {
      setStep(0);
      setAnswers([]);
    }, 300);
  };

  const recommendation = isResult
    ? RECOMMENDATIONS[answers[0]] || RECOMMENDATIONS.relax
    : null;

  if (!isOpen) {
    return <StrainFinderCTA onOpen={() => setIsOpen(true)} />;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center sm:justify-center pointer-events-none">
        <div
          className="
            relative w-full sm:max-w-lg
            bg-surface rounded-t-3xl sm:rounded-3xl
            shadow-overlay
            max-h-[85dvh] sm:max-h-[90dvh]
            flex flex-col
            pointer-events-auto
            animate-slide-up sm:animate-scale-in
          "
        >
          {/* Header */}
          <div className="shrink-0 bg-surface rounded-t-3xl px-5 pt-4 pb-3 border-b border-border-light">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {step > 0 && !isResult && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="size-8 flex items-center justify-center rounded-full bg-surface-sunken text-secondary hover:text-primary transition-colors"
                  >
                    <ChevronLeftIcon />
                  </button>
                )}
                <div>
                  <h2 className="text-base font-bold text-primary">
                    Strain Finder
                  </h2>
                  {!isResult && (
                    <p className="text-xs text-tertiary">
                      Step {step + 1} of {totalSteps}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="size-8 flex items-center justify-center rounded-full bg-surface-sunken text-secondary hover:text-primary transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Progress bar */}
            {!isResult && (
              <div className="mt-3 h-1 bg-surface-sunken rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500 ease-[var(--ease-out)]"
                  style={{width: `${((step + 1) / totalSteps) * 100}%`}}
                />
              </div>
            )}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-5">
            {isResult && recommendation ? (
              <ResultView
                recommendation={recommendation}
                onRetake={handleReset}
              />
            ) : (
              currentStep && (
                <StepView step={currentStep} onSelect={handleSelect} />
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ============================================================
//  CTA CARD (displayed on homepage)
// ============================================================

function StrainFinderCTA({onOpen}: {onOpen: () => void}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="
        w-full text-left
        relative overflow-hidden
        rounded-3xl
        bg-gradient-to-br from-accent via-emerald-600 to-teal-700
        p-5 sm:p-6
        group
        transition-all duration-300
        hover:shadow-raised
        active:scale-[0.99]
      "
    >
      {/* Decorative */}
      <div className="absolute -right-8 -top-8 size-40 rounded-full bg-white/[0.07]" />
      <div className="absolute right-20 bottom-0 size-24 rounded-full bg-white/[0.05]" />
      <div className="absolute left-1/3 -top-4 size-16 rounded-full bg-white/[0.04]" />

      <div className="relative z-10 flex items-center gap-4">
        {/* Icon */}
        <div className="shrink-0 size-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg">
          <WandIcon />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-white/20 text-[0.55rem] font-bold tracking-widest uppercase text-white/90 rounded-full">
              New
            </span>
            <span className="text-[0.6rem] text-white/60">
              Takes 30 seconds
            </span>
          </div>
          <h3 className="text-base font-bold text-white leading-snug">
            Not sure what to get?
          </h3>
          <p className="text-[0.75rem] text-white/70 leading-relaxed mt-0.5">
            Take our Strain Finder quiz and get a personalized recommendation.
          </p>
        </div>

        {/* Arrow */}
        <div className="shrink-0 size-10 rounded-full bg-white/15 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
          <svg
            className="size-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}

// ============================================================
//  STEP VIEW
// ============================================================

function StepView({
  step,
  onSelect,
}: {
  step: QuizStep;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <h3 className="text-xl font-bold text-primary tracking-tight mb-1">
        {step.title}
      </h3>
      <p className="text-sm text-tertiary mb-5">{step.subtitle}</p>

      <div className="grid grid-cols-2 gap-3">
        {step.options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className="
              flex flex-col items-center text-center
              p-4 rounded-2xl
              bg-surface-sunken
              border border-transparent
              transition-all duration-200 ease-[var(--ease-out)]
              hover:border-accent/30 hover:bg-accent-light/30 hover:shadow-card
              active:scale-95
              group
            "
          >
            <div className="size-10 rounded-xl bg-surface flex items-center justify-center mb-2.5 shadow-xs text-secondary group-hover:text-accent group-hover:bg-accent-light transition-colors">
              {option.icon}
            </div>
            <span className="text-sm font-semibold text-primary mb-0.5">
              {option.label}
            </span>
            <span className="text-[0.65rem] text-tertiary leading-snug">
              {option.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
//  RESULT VIEW
// ============================================================

function ResultView({
  recommendation,
  onRetake,
}: {
  recommendation: StrainFinderRecommendation;
  onRetake: () => void;
}) {
  const relatedRecommendations = getRelatedRecommendations(recommendation);

  return (
    <div>
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent-light text-accent text-xs font-semibold rounded-full mb-3">
          <SparklesIcon />
          Your Perfect Match
        </div>
        <h3 className="text-xl font-bold text-primary tracking-tight">
          We think you'll love...
        </h3>
        <p className="mt-1 text-sm text-tertiary">
          Personalized for {recommendation.vibeLabel.toLowerCase()}.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-4 sm:p-5">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/[0.06]" />
        <div className="absolute right-10 bottom-0 size-28 rounded-full bg-white/[0.05]" />

        <div className={`relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${recommendation.bg} p-5 mb-4`}>
          <div className="absolute -right-4 top-4 size-24 rounded-full bg-white/[0.08]" />
          <div className="absolute bottom-0 right-0 w-[34%] opacity-25 pointer-events-none">
            <img
              src="/bud.webp"
              alt=""
              className="w-full h-full object-contain"
            />
          </div>

          <div className="relative z-10 max-w-[78%]">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-[0.65rem] font-bold ${RESULT_SECTION_BADGES[recommendation.strain]}`}
            >
              {recommendation.strain}
            </span>

            <h4 className="mt-3 text-xl font-bold text-white">
              {recommendation.title}
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-white/80">
              {recommendation.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <ResultMetaPill label={recommendation.thc} value="THC" />
              <ResultMetaPill label={recommendation.price} value="From" />
            </div>

            <div className="mt-5">
              <Link
                to={recommendation.collection}
                className="
                  inline-flex items-center gap-1.5
                  px-5 py-2.5
                  bg-white text-primary
                  text-sm font-semibold
                  rounded-full
                  transition-all duration-200
                  hover:shadow-raised
                  active:scale-95
                "
              >
                Shop this match
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
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4">
          <div className="mb-3">
            <h5 className="text-sm font-bold text-white">Keep the vibe going</h5>
            <p className="text-[0.7rem] text-white/55">
              Similar picks from the same profile
            </p>
          </div>

          <div className="grid gap-3">
            {relatedRecommendations.map((product) => (
              <Link
                key={product.id}
                to={recommendation.collection}
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-3 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.09]"
              >
                <div
                  className={`relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl ${product.bgColor}`}
                >
                  <div
                    className={`absolute inset-2 rounded-[45%_55%_50%_50%/55%_45%_55%_45%] ${product.blobColor}`}
                  />
                  <img
                    src={product.image}
                    alt={product.title}
                    className="relative z-10 h-[65%] w-[65%] object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[0.55rem] font-bold ${STRAIN_BADGE[product.strain]}`}
                    >
                      {product.strain}
                    </span>
                    <span className="text-[0.6rem] font-medium text-white/45">
                      THC {product.thc}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm font-semibold text-white">
                    {product.title}
                  </p>
                  <p className="text-xs font-bold text-white/75">{product.price}</p>
                </div>
                <span className="text-white/40 transition-colors group-hover:text-white/70">
                  <ArrowRightIcon />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onRetake}
        className="w-full py-3 text-sm font-medium text-tertiary hover:text-primary transition-colors"
      >
        Retake quiz
      </button>
    </div>
  );
}

function ResultMetaPill({label, value}: {label: string; value: string}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-2.5 py-1 text-[0.7rem] font-semibold text-white/85 ring-1 ring-white/10">
      <span className="text-white">{label}</span>
      <span className="text-white/55">{value}</span>
    </span>
  );
}

// ============================================================
//  ICONS
// ============================================================

function ArrowRightIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
      />
    </svg>
  );
}

function WandIcon() {
  return (
    <svg
      className="size-7 text-white"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
      />
    </svg>
  );
}

function MoonIcon() {
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
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
      />
    </svg>
  );
}

function BoltIcon() {
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
        d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
      />
    </svg>
  );
}

function SparklesIcon() {
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
        d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
      />
    </svg>
  );
}

function ChatIcon() {
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
        d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
      />
    </svg>
  );
}

function CloudIcon() {
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
        d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z"
      />
    </svg>
  );
}

function HeartPulseIcon() {
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
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
}

function SeedlingIcon() {
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
        d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
      />
    </svg>
  );
}

function LeafSmallIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
    </svg>
  );
}

function PlantIcon() {
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
        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
      />
    </svg>
  );
}

function TreeIcon() {
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
        d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z"
      />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CigaretteIcon() {
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
        d="M3.75 15h12.75m-12.75 0v3h12.75v-3m-12.75 0L2.25 15m14.25 0 1.5-1.5M6 9.75v-.75a3 3 0 0 1 3-3h.75m0 0h.75a3 3 0 0 1 3 3v.75m-4.5-3.75V4.5m4.5 5.25v-.75a3 3 0 0 1 3-3h1.5"
      />
    </svg>
  );
}

function CookieIcon() {
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
        d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Z"
      />
    </svg>
  );
}

function WindIcon() {
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
        d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
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
        d="M15.75 19.5 8.25 12l7.5-7.5"
      />
    </svg>
  );
}

function CloseIcon() {
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
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  );
}
