/**
 * GIGI apparel catalogue — placeholder product data for the storefront until a
 * real Shopify store is connected. Shared by the Shop grid and the product page.
 */
export type GigiColor = {name: string; hex: string};

export type GigiProduct = {
  handle: string;
  name: string;
  price: string;
  tagline: string;
  category: 'clothing' | 'accessories';
  // Temporary thumbnail (a GIGI lifestyle shot) until real product photos land.
  image: string;
  colors: GigiColor[];
  sizes: string[];
  details: string;
  composition: string;
  shipping: string;
  sizeFit: string;
};

const BURGUNDY = {name: 'Burgundy', hex: '#4d1727'};
const STONE = {name: 'Stone', hex: '#cfc7b3'};
const BLACK = {name: 'Black', hex: '#221c1e'};
const WHITE = {name: 'White', hex: '#efe9dc'};
const CREAM = {name: 'Cream', hex: '#e7dcc4'};

const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const SHIPPING =
  'Complimentary shipping across the UAE on orders over AED 200. Returns accepted within 14 days on unworn items with tags attached.';

export const GIGI_PRODUCTS: GigiProduct[] = [
  {
    handle: 'statement-zip-hoodie',
    name: "Gigi's Statement Zip Hoodie",
    price: '$60 USD',
    tagline: 'Zipper hoodie in burgundy, with Gigi design stamped.',
    category: 'clothing',
    image: 'mosaic-1.jpg',
    colors: [BURGUNDY, STONE],
    sizes: APPAREL_SIZES,
    details:
      'Heavyweight brushed-back cotton hoodie with a full-length zip, ribbed cuffs and hem, and the Gigi monogram stamped across the back.',
    composition: '80% organic cotton, 20% recycled polyester. Machine wash cold, tumble dry low, do not iron the print.',
    shipping: SHIPPING,
    sizeFit: 'Relaxed fit. Model is 175cm and wears a size S. If between sizes, we recommend sizing down.',
  },
  {
    handle: 'black-zip-neck',
    name: "Gigi's Black Zip Neck",
    price: '$60 USD',
    tagline: 'Quarter-zip pullover in black, with a tonal Gigi crest.',
    category: 'clothing',
    image: 'mosaic-4.jpg',
    colors: [BLACK, BURGUNDY],
    sizes: APPAREL_SIZES,
    details:
      'Mid-weight quarter-zip with a stand collar and a subtle tonal crest at the chest — an easy layer on and off the reformer.',
    composition: '92% cotton, 8% elastane. Machine wash cold, hang to dry.',
    shipping: SHIPPING,
    sizeFit: 'True to size with a slim, elongated line. Take your usual size.',
  },
  {
    handle: 'powerful-hoodie',
    name: 'The Powerful Hoodie',
    price: '$60 USD',
    tagline: 'Oversized hoodie in stone, cut for movement and rest.',
    category: 'clothing',
    image: 'mosaic-1.jpg',
    colors: [STONE, BURGUNDY],
    sizes: APPAREL_SIZES,
    details:
      'Oversized silhouette in a soft brushed fleece with a double-lined hood and dropped shoulders.',
    composition: '100% cotton fleece. Machine wash cold, tumble dry low.',
    shipping: SHIPPING,
    sizeFit: 'Oversized fit. Size down for a closer cut.',
  },
  {
    handle: 'long-sleeve-monogram',
    name: "Gigi's Long Sleeve Monogram",
    price: '$60 USD',
    tagline: 'Long sleeve tee in white with the Gigi monogram.',
    category: 'clothing',
    image: 'mosaic-4.jpg',
    colors: [WHITE, BURGUNDY],
    sizes: APPAREL_SIZES,
    details:
      'A soft everyday long sleeve with the Gigi monogram at the chest and a clean ribbed neckline.',
    composition: '100% combed cotton. Machine wash cold.',
    shipping: SHIPPING,
    sizeFit: 'Regular fit. Take your usual size.',
  },
  {
    handle: 'classic-white-tee',
    name: "Gigi's Classic White Tee",
    price: '$60 USD',
    tagline: 'The everyday tee in white with the Gigi wordmark.',
    category: 'clothing',
    image: 'mosaic-3.jpg',
    colors: [WHITE, BLACK],
    sizes: APPAREL_SIZES,
    details:
      'A boxy, mid-weight tee with the Gigi wordmark printed across the chest.',
    composition: '100% organic cotton. Machine wash cold, tumble dry low.',
    shipping: SHIPPING,
    sizeFit: 'Boxy fit. Size down for a fitted look.',
  },
  {
    handle: 'crew-socks',
    name: "Gigi's Crew Socks",
    price: '$60 USD',
    tagline: 'Ribbed crew socks with a woven Gigi cuff.',
    category: 'accessories',
    image: 'mosaic-3.jpg',
    colors: [WHITE],
    sizes: ['S / M', 'L / XL'],
    details:
      'Cushioned ribbed crew socks with a woven Gigi monogram at the cuff and reinforced heel and toe.',
    composition: '80% cotton, 17% polyamide, 3% elastane. Machine wash cold.',
    shipping: SHIPPING,
    sizeFit: 'Two sizes to fit UK 3–6 and UK 7–11.',
  },
  {
    handle: 'monogram-tote',
    name: "Gigi's Monogram Tote",
    price: '$60 USD',
    tagline: 'Two-tone canvas tote with the Gigi monogram.',
    category: 'accessories',
    image: 'mosaic-2.jpg',
    colors: [BURGUNDY, CREAM],
    sizes: ['One Size'],
    details:
      'A roomy two-tone canvas tote with reinforced handles and the Gigi monogram — sized for the studio and beyond.',
    composition: '100% heavy cotton canvas. Spot clean only.',
    shipping: SHIPPING,
    sizeFit: 'One size. 40cm × 38cm with a 25cm handle drop.',
  },
  {
    handle: 'canvas-tote',
    name: "Gigi's Canvas Tote",
    price: '$60 USD',
    tagline: 'Natural canvas tote with a line-drawn Gigi motif.',
    category: 'accessories',
    image: 'mosaic-2.jpg',
    colors: [CREAM],
    sizes: ['One Size'],
    details:
      'A lightweight natural canvas tote with a hand-drawn Gigi motif and long shoulder handles.',
    composition: '100% cotton canvas. Spot clean only.',
    shipping: SHIPPING,
    sizeFit: 'One size. 38cm × 42cm with a 30cm handle drop.',
  },
];

export function getGigiProduct(handle: string): GigiProduct | undefined {
  return GIGI_PRODUCTS.find((p) => p.handle === handle);
}

export function getRelatedGigiProducts(handle: string, count = 6): GigiProduct[] {
  return GIGI_PRODUCTS.filter((p) => p.handle !== handle).slice(0, count);
}
