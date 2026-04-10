export type StrainType = 'Sativa' | 'Indica' | 'Hybrid' | 'CBD';

export interface MockWeightOption {
  label: string;
  price: string;
}

export interface MockTerpene {
  name: string;
  color: string;
  pct: string;
}

export interface MockProduct {
  id: string;
  handle: string;
  title: string;
  subtitle: string;
  category: string;
  strain: StrainType;
  price: string;
  compareAtPrice?: string;
  thc: string;
  cbd: string;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  effects: string[];
  tags: string[];
  details: string[];
  terpenes: MockTerpene[];
  weights: MockWeightOption[];
}

export interface MockCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  eyebrow: string;
  accent: string;
  productHandles: string[];
}

const PRODUCT_IMAGE = '/bud.webp';

export const mockProducts: MockProduct[] = [
  {
    id: 'mock-product-1',
    handle: 'kali-mist',
    title: 'Kali Mist',
    subtitle: 'Bright citrus flower for daytime momentum',
    category: 'flower',
    strain: 'Sativa',
    price: '$42.00',
    compareAtPrice: '$48.00',
    thc: '22%',
    cbd: '0.3%',
    rating: 4.7,
    reviewCount: 89,
    image: PRODUCT_IMAGE,
    description:
      'Kali Mist delivers a clean, energetic lift with citrus peel, fresh herbs, and a clear-headed finish that stays social and functional.',
    effects: ['Energetic', 'Creative', 'Focused', 'Uplifted'],
    tags: ['daytime', 'creative', 'citrus', 'top-shelf'],
    details: [
      'Indoor grown in small harvest batches',
      'Hand-trimmed flower',
      'Slow cured for 30+ days',
      'Third-party lab tested',
    ],
    terpenes: [
      {name: 'Limonene', color: 'bg-yellow-400', pct: '0.31%'},
      {name: 'Myrcene', color: 'bg-emerald-400', pct: '0.25%'},
      {name: 'Pinene', color: 'bg-sky-400', pct: '0.16%'},
    ],
    weights: [
      {label: '1g', price: '$14'},
      {label: '3.5g', price: '$42'},
      {label: '7g', price: '$78'},
      {label: '14g', price: '$148'},
    ],
  },
  {
    id: 'mock-product-2',
    handle: 'granddaddy-purple',
    title: 'Granddaddy Purple',
    subtitle: 'Deep berry indica for evenings in',
    category: 'flower',
    strain: 'Indica',
    price: '$48.00',
    thc: '20%',
    cbd: '0.5%',
    rating: 4.8,
    reviewCount: 132,
    image: PRODUCT_IMAGE,
    description:
      'Granddaddy Purple brings rich grape sweetness, a soft body melt, and a slow exhale that is built for late-night unwinding.',
    effects: ['Relaxed', 'Sleepy', 'Heavy', 'Calm'],
    tags: ['sleep', 'berry', 'nighttime', 'best-seller'],
    details: [
      'Dense premium flower',
      'Freshness sealed in reusable jars',
      'No pesticides or PGRs',
      'Verified cannabinoid panel',
    ],
    terpenes: [
      {name: 'Myrcene', color: 'bg-emerald-400', pct: '0.42%'},
      {name: 'Caryophyllene', color: 'bg-orange-400', pct: '0.18%'},
      {name: 'Linalool', color: 'bg-violet-400', pct: '0.11%'},
    ],
    weights: [
      {label: '1g', price: '$15'},
      {label: '3.5g', price: '$48'},
      {label: '7g', price: '$88'},
      {label: '14g', price: '$166'},
    ],
  },
  {
    id: 'mock-product-3',
    handle: 'blue-dream',
    title: 'Blue Dream',
    subtitle: 'Balanced hybrid with a sweet finish',
    category: 'flower',
    strain: 'Hybrid',
    price: '$45.00',
    thc: '21%',
    cbd: '0.4%',
    rating: 4.6,
    reviewCount: 104,
    image: PRODUCT_IMAGE,
    description:
      'Blue Dream stays easygoing and versatile, layering berry sweetness with a mellow head buzz and a calm body feel.',
    effects: ['Balanced', 'Happy', 'Social', 'Focused'],
    tags: ['balanced', 'berry', 'popular', 'social'],
    details: [
      'Smooth smoke with even cure',
      'Great for solo or social sessions',
      'Cultivated in climate-controlled rooms',
      'Batch tested for potency and purity',
    ],
    terpenes: [
      {name: 'Pinene', color: 'bg-sky-400', pct: '0.21%'},
      {name: 'Myrcene', color: 'bg-emerald-400', pct: '0.27%'},
      {name: 'Terpinolene', color: 'bg-amber-400', pct: '0.15%'},
    ],
    weights: [
      {label: '1g', price: '$14'},
      {label: '3.5g', price: '$45'},
      {label: '7g', price: '$82'},
      {label: '14g', price: '$155'},
    ],
  },
  {
    id: 'mock-product-4',
    handle: 'northern-lights-preroll-pack',
    title: 'Northern Lights Pre-Roll Pack',
    subtitle: 'Five slow-burning indica pre-rolls',
    category: 'pre-rolls',
    strain: 'Indica',
    price: '$34.00',
    thc: '23%',
    cbd: '0.2%',
    rating: 4.7,
    reviewCount: 61,
    image: PRODUCT_IMAGE,
    description:
      'An easy nighttime pickup with clean-burning papers, classic pine notes, and an all-in relaxation curve.',
    effects: ['Relaxed', 'Sleepy', 'Body High'],
    tags: ['pre-roll', 'nighttime', 'ready-to-go'],
    details: [
      '5 x 0.5g premium pre-rolls',
      'Even grind and pack',
      'Resealable pack for freshness',
      'Ideal for low-prep sessions',
    ],
    terpenes: [
      {name: 'Myrcene', color: 'bg-emerald-400', pct: '0.39%'},
      {name: 'Pinene', color: 'bg-sky-400', pct: '0.14%'},
      {name: 'Caryophyllene', color: 'bg-orange-400', pct: '0.17%'},
    ],
    weights: [
      {label: '5 pack', price: '$34'},
      {label: '10 pack', price: '$62'},
    ],
  },
  {
    id: 'mock-product-5',
    handle: 'pineapple-express-prerolls',
    title: 'Pineapple Express Pre-Rolls',
    subtitle: 'Tropical hybrid joints for group hangs',
    category: 'pre-rolls',
    strain: 'Hybrid',
    price: '$36.00',
    thc: '24%',
    cbd: '0.1%',
    rating: 4.5,
    reviewCount: 48,
    image: PRODUCT_IMAGE,
    description:
      'A bright, fruit-forward pre-roll set with fast mood lift and a breezy social buzz that stays lively.',
    effects: ['Social', 'Happy', 'Uplifted'],
    tags: ['pre-roll', 'tropical', 'party'],
    details: [
      'Infused aroma-retaining cone pack',
      'Smooth draw and slow burn',
      'Built for sharing',
      'Potency screened every lot',
    ],
    terpenes: [
      {name: 'Limonene', color: 'bg-yellow-400', pct: '0.28%'},
      {name: 'Terpinolene', color: 'bg-amber-400', pct: '0.17%'},
      {name: 'Pinene', color: 'bg-sky-400', pct: '0.13%'},
    ],
    weights: [
      {label: '4 pack', price: '$36'},
      {label: '8 pack', price: '$68'},
    ],
  },
  {
    id: 'mock-product-6',
    handle: 'mango-gummies',
    title: 'Mango Lift Gummies',
    subtitle: 'Microdosed daytime edibles with a bright finish',
    category: 'edibles',
    strain: 'Sativa',
    price: '$24.00',
    thc: '10mg',
    cbd: '2mg',
    rating: 4.6,
    reviewCount: 77,
    image: PRODUCT_IMAGE,
    description:
      'Juicy mango gummies tuned for steady daytime use, with a cheerful onset and a measured finish that stays manageable.',
    effects: ['Energetic', 'Happy', 'Clear'],
    tags: ['edible', 'microdose', 'fruity', 'daytime'],
    details: [
      '10 gummies per pouch',
      'Consistent dosing per piece',
      'Fast flavor, clean finish',
      'Made with real fruit pectin',
    ],
    terpenes: [
      {name: 'Limonene', color: 'bg-yellow-400', pct: 'N/A'},
      {name: 'Beta-Pinene', color: 'bg-sky-400', pct: 'N/A'},
      {name: 'Myrcene', color: 'bg-emerald-400', pct: 'N/A'},
    ],
    weights: [
      {label: '100mg', price: '$24'},
      {label: '200mg', price: '$42'},
    ],
  },
  {
    id: 'mock-product-7',
    handle: 'midnight-chocolate',
    title: 'Midnight Dark Chocolate',
    subtitle: 'Relaxing edible squares for the late hours',
    category: 'edibles',
    strain: 'Indica',
    price: '$26.00',
    thc: '10mg',
    cbd: '5mg',
    rating: 4.7,
    reviewCount: 55,
    image: PRODUCT_IMAGE,
    description:
      'Silky dark chocolate with a slow evening settle, made for low-key nights and comfortable sleep prep.',
    effects: ['Calm', 'Relaxed', 'Sleepy'],
    tags: ['edible', 'sleep', 'chocolate'],
    details: [
      'Segmented bar for simple dosing',
      'Balanced THC and CBD',
      'Rich cocoa finish',
      'Shelf-stable packaging',
    ],
    terpenes: [
      {name: 'Myrcene', color: 'bg-emerald-400', pct: 'N/A'},
      {name: 'Linalool', color: 'bg-violet-400', pct: 'N/A'},
      {name: 'Caryophyllene', color: 'bg-orange-400', pct: 'N/A'},
    ],
    weights: [
      {label: '100mg', price: '$26'},
      {label: '200mg', price: '$46'},
    ],
  },
  {
    id: 'mock-product-8',
    handle: 'live-resin-drops',
    title: 'Live Resin Drops',
    subtitle: 'High-terp concentrate with bright citrus pull',
    category: 'concentrates',
    strain: 'Hybrid',
    price: '$54.00',
    thc: '78%',
    cbd: '0.1%',
    rating: 4.8,
    reviewCount: 43,
    image: PRODUCT_IMAGE,
    description:
      'A terp-rich concentrate made for flavor chasers, with punchy citrus on the inhale and a smooth hybrid landing.',
    effects: ['Potent', 'Balanced', 'Flavorful'],
    tags: ['concentrate', 'live-resin', 'top-shelf'],
    details: [
      'Flash-frozen input material',
      'High terpene preservation',
      'Small-batch extraction',
      'Ideal for experienced users',
    ],
    terpenes: [
      {name: 'Limonene', color: 'bg-yellow-400', pct: '2.1%'},
      {name: 'Caryophyllene', color: 'bg-orange-400', pct: '1.4%'},
      {name: 'Humulene', color: 'bg-lime-400', pct: '0.8%'},
    ],
    weights: [
      {label: '1g', price: '$54'},
      {label: '2g', price: '$98'},
    ],
  },
  {
    id: 'mock-product-9',
    handle: 'focus-vape-cart',
    title: 'Focus Vape Cart',
    subtitle: 'Clean sativa vapor with a light citrus edge',
    category: 'vapes',
    strain: 'Sativa',
    price: '$39.00',
    thc: '84%',
    cbd: '0.0%',
    rating: 4.4,
    reviewCount: 50,
    image: PRODUCT_IMAGE,
    description:
      'A discreet cart aimed at daytime clarity, with bright flavor and a fast, functional lift.',
    effects: ['Focused', 'Energetic', 'Clear'],
    tags: ['vape', 'daytime', 'discreet'],
    details: [
      '510-thread cartridge',
      'Ceramic heating core',
      'Smooth vapor production',
      'Travel-friendly format',
    ],
    terpenes: [
      {name: 'Pinene', color: 'bg-sky-400', pct: '1.2%'},
      {name: 'Limonene', color: 'bg-yellow-400', pct: '1.5%'},
      {name: 'Terpinolene', color: 'bg-amber-400', pct: '0.9%'},
    ],
    weights: [
      {label: '0.5g', price: '$39'},
      {label: '1g', price: '$64'},
    ],
  },
  {
    id: 'mock-product-10',
    handle: 'acdc-softgels',
    title: 'ACDC Softgels',
    subtitle: 'High-CBD capsules for low-key relief',
    category: 'cbd',
    strain: 'CBD',
    price: '$32.00',
    thc: '2mg',
    cbd: '25mg',
    rating: 4.9,
    reviewCount: 71,
    image: PRODUCT_IMAGE,
    description:
      'Simple, measured CBD softgels that keep the experience calm, functional, and easy to repeat.',
    effects: ['Relief', 'Calm', 'Clear-headed'],
    tags: ['cbd', 'wellness', 'relief', 'low-thc'],
    details: [
      '30-count bottle',
      'Precise capsule dosing',
      'Low THC formulation',
      'Made for routine use',
    ],
    terpenes: [
      {name: 'Myrcene', color: 'bg-emerald-400', pct: 'trace'},
      {name: 'Caryophyllene', color: 'bg-orange-400', pct: 'trace'},
      {name: 'Pinene', color: 'bg-sky-400', pct: 'trace'},
    ],
    weights: [
      {label: '30 count', price: '$32'},
      {label: '60 count', price: '$58'},
    ],
  },
  {
    id: 'mock-product-11',
    handle: 'wedding-cake-flower',
    title: 'Wedding Cake',
    subtitle: 'Creamy hybrid flower with a dense finish',
    category: 'flower',
    strain: 'Hybrid',
    price: '$55.00',
    thc: '25%',
    cbd: '0.2%',
    rating: 4.8,
    reviewCount: 97,
    image: PRODUCT_IMAGE,
    description:
      'A dessert-forward hybrid with vanilla sweetness, full aroma, and a heavier relaxing finish as the session rolls on.',
    effects: ['Euphoric', 'Relaxed', 'Balanced'],
    tags: ['dessert', 'hybrid', 'best-seller'],
    details: [
      'Sticky, resin-rich flower',
      'Bag appeal forward presentation',
      'Fresh crop rotation',
      'High-THC shopper favorite',
    ],
    terpenes: [
      {name: 'Caryophyllene', color: 'bg-orange-400', pct: '0.33%'},
      {name: 'Limonene', color: 'bg-yellow-400', pct: '0.22%'},
      {name: 'Myrcene', color: 'bg-emerald-400', pct: '0.18%'},
    ],
    weights: [
      {label: '1g', price: '$16'},
      {label: '3.5g', price: '$55'},
      {label: '7g', price: '$102'},
      {label: '14g', price: '$192'},
    ],
  },
  {
    id: 'mock-product-12',
    handle: 'gorilla-glue-flower',
    title: 'Gorilla Glue',
    subtitle: 'Heavy hybrid gas for a stronger finish',
    category: 'flower',
    strain: 'Hybrid',
    price: '$58.00',
    thc: '26%',
    cbd: '0.1%',
    rating: 4.7,
    reviewCount: 86,
    image: PRODUCT_IMAGE,
    description:
      'Pungent and sticky with a powerful body feel, Gorilla Glue lands strongest when the goal is to switch gears and stay in.',
    effects: ['Heavy', 'Relaxed', 'Potent'],
    tags: ['gassy', 'top-shelf', 'potent'],
    details: [
      'High-resin trichome coverage',
      'Limited drop releases',
      'Strong aroma retention',
      'Not ideal for first-timers',
    ],
    terpenes: [
      {name: 'Caryophyllene', color: 'bg-orange-400', pct: '0.36%'},
      {name: 'Myrcene', color: 'bg-emerald-400', pct: '0.29%'},
      {name: 'Humulene', color: 'bg-lime-400', pct: '0.14%'},
    ],
    weights: [
      {label: '1g', price: '$17'},
      {label: '3.5g', price: '$58'},
      {label: '7g', price: '$108'},
      {label: '14g', price: '$204'},
    ],
  },
];

export const mockCollections: MockCollection[] = [
  {
    id: 'mock-collection-all',
    handle: 'all',
    title: 'All Products',
    description:
      'A full browse of our mock catalog, spanning flower, edibles, concentrates, vapes, CBD, and quick-grab pre-rolls.',
    eyebrow: 'Full Catalog',
    accent: 'from-emerald-200/70',
    productHandles: mockProducts.map((product) => product.handle),
  },
  {
    id: 'mock-collection-flower',
    handle: 'flower',
    title: 'Flower',
    description:
      'Classic jars and top-shelf buds for every kind of session, from bright daytime smoke to heavier evening picks.',
    eyebrow: 'Core Collection',
    accent: 'from-lime-200/70',
    productHandles: mockProducts
      .filter((product) => product.category === 'flower')
      .map((product) => product.handle),
  },
  {
    id: 'mock-collection-pre-rolls',
    handle: 'pre-rolls',
    title: 'Pre-Rolls',
    description:
      'Convenient, ready-to-light options for quick solo sessions and easy share packs.',
    eyebrow: 'Grab And Go',
    accent: 'from-amber-200/70',
    productHandles: mockProducts
      .filter((product) => product.category === 'pre-rolls')
      .map((product) => product.handle),
  },
  {
    id: 'mock-collection-edibles',
    handle: 'edibles',
    title: 'Edibles',
    description:
      'Measured gummies and chocolate for shoppers who want consistency, flavor, and a smoke-free option.',
    eyebrow: 'Tasty Picks',
    accent: 'from-rose-200/70',
    productHandles: mockProducts
      .filter((product) => product.category === 'edibles')
      .map((product) => product.handle),
  },
  {
    id: 'mock-collection-concentrates',
    handle: 'concentrates',
    title: 'Concentrates',
    description:
      'Potent extracts with big terpene expression for experienced shoppers who want stronger formats.',
    eyebrow: 'High Potency',
    accent: 'from-orange-200/70',
    productHandles: mockProducts
      .filter((product) => product.category === 'concentrates')
      .map((product) => product.handle),
  },
  {
    id: 'mock-collection-vapes',
    handle: 'vapes',
    title: 'Vapes',
    description:
      'Discreet, portable options with clean flavor and an easy format for daytime and on-the-go use.',
    eyebrow: 'Portable',
    accent: 'from-sky-200/70',
    productHandles: mockProducts
      .filter((product) => product.category === 'vapes')
      .map((product) => product.handle),
  },
  {
    id: 'mock-collection-cbd',
    handle: 'cbd',
    title: 'CBD',
    description:
      'Relief-focused formats with gentler THC exposure for calmer, more clear-headed routines.',
    eyebrow: 'Wellness',
    accent: 'from-teal-200/70',
    productHandles: mockProducts
      .filter((product) => product.category === 'cbd' || product.strain === 'CBD')
      .map((product) => product.handle),
  },
  {
    id: 'mock-collection-sativa',
    handle: 'sativa',
    title: 'Sativa',
    description:
      'Daytime leaning options for energy, focus, and brighter social sessions.',
    eyebrow: 'Strain Type',
    accent: 'from-yellow-200/70',
    productHandles: mockProducts
      .filter((product) => product.strain === 'Sativa')
      .map((product) => product.handle),
  },
  {
    id: 'mock-collection-indica',
    handle: 'indica',
    title: 'Indica',
    description:
      'Evening-ready options built around body relaxation, heavier calm, and quieter nights in.',
    eyebrow: 'Strain Type',
    accent: 'from-violet-200/70',
    productHandles: mockProducts
      .filter((product) => product.strain === 'Indica')
      .map((product) => product.handle),
  },
  {
    id: 'mock-collection-hybrid',
    handle: 'hybrid',
    title: 'Hybrid',
    description:
      'Middle-ground picks that balance lift and ease, with flexible profiles for a wide range of shoppers.',
    eyebrow: 'Strain Type',
    accent: 'from-emerald-200/70',
    productHandles: mockProducts
      .filter((product) => product.strain === 'Hybrid')
      .map((product) => product.handle),
  },
];

export interface MockTagPage {
  handle: string;
  title: string;
  description: string;
  productHandles: string[];
}

export const mockTags: MockTagPage[] = Array.from(
  new Set(mockProducts.flatMap((product) => product.tags)),
)
  .sort((a, b) => a.localeCompare(b))
  .map((tag) => ({
    handle: tag,
    title: formatHandle(tag),
    description: `Mock catalog picks tagged "${formatHandle(
      tag,
    )}" so shoppers can browse by vibe, effect, or product style.`,
    productHandles: mockProducts
      .filter((product) => product.tags.includes(tag))
      .map((product) => product.handle),
  }));

export function getAllMockProducts() {
  return mockProducts;
}

export function getMockProductByHandle(handle: string) {
  return mockProducts.find((product) => product.handle === handle) ?? null;
}

export function getMockCollectionByHandle(handle: string) {
  return mockCollections.find((collection) => collection.handle === handle) ?? null;
}

export function getMockTagByHandle(handle: string) {
  return mockTags.find((tag) => tag.handle === handle) ?? null;
}

export function getProductsForCollection(handle: string) {
  const collection = getMockCollectionByHandle(handle);
  if (!collection) return [];
  return collection.productHandles
    .map((productHandle) => getMockProductByHandle(productHandle))
    .filter((product): product is MockProduct => Boolean(product));
}

export function getProductsForTag(handle: string) {
  const tag = getMockTagByHandle(handle);
  if (!tag) return [];
  return tag.productHandles
    .map((productHandle) => getMockProductByHandle(productHandle))
    .filter((product): product is MockProduct => Boolean(product));
}

export function getRelatedMockProducts(handle: string, limit = 4) {
  const product = getMockProductByHandle(handle);
  if (!product) return [];

  return mockProducts
    .filter((candidate) => candidate.handle !== handle)
    .sort((left, right) => {
      const leftScore = getRelatedScore(product, left);
      const rightScore = getRelatedScore(product, right);
      return rightScore - leftScore;
    })
    .slice(0, limit);
}

export function formatHandle(handle: string) {
  return handle
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getRelatedScore(base: MockProduct, candidate: MockProduct) {
  let score = 0;
  if (base.category === candidate.category) score += 3;
  if (base.strain === candidate.strain) score += 2;
  score += candidate.tags.filter((tag) => base.tags.includes(tag)).length;
  return score;
}
