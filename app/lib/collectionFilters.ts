import type {MockProduct, StrainType} from './mockCatalog';

export type SortKey =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'reviews-desc'
  | 'name-asc';

export const SORT_OPTIONS: {value: SortKey; label: string}[] = [
  {value: 'featured', label: 'Featured'},
  {value: 'price-asc', label: 'Price: Low to High'},
  {value: 'price-desc', label: 'Price: High to Low'},
  {value: 'rating-desc', label: 'Top Rated'},
  {value: 'reviews-desc', label: 'Most Reviewed'},
  {value: 'name-asc', label: 'Name: A to Z'},
];

export interface CollectionFilters {
  strains: StrainType[];
  categories: string[];
  effects: string[];
  onSale: boolean;
  priceMin: number | null;
  priceMax: number | null;
}

export const EMPTY_FILTERS: CollectionFilters = {
  strains: [],
  categories: [],
  effects: [],
  onSale: false,
  priceMin: null,
  priceMax: null,
};

export function parsePrice(price: string): number {
  const cleaned = price.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function countActiveFilters(filters: CollectionFilters): number {
  return (
    filters.strains.length +
    filters.categories.length +
    filters.effects.length +
    (filters.onSale ? 1 : 0) +
    (filters.priceMin != null || filters.priceMax != null ? 1 : 0)
  );
}

export function applyFiltersAndSort(
  products: MockProduct[],
  filters: CollectionFilters,
  sort: SortKey,
): MockProduct[] {
  const filtered = products.filter((product) => {
    if (filters.strains.length && !filters.strains.includes(product.strain)) {
      return false;
    }
    if (
      filters.categories.length &&
      !filters.categories.includes(product.category)
    ) {
      return false;
    }
    if (
      filters.effects.length &&
      !filters.effects.some((effect) => product.effects.includes(effect))
    ) {
      return false;
    }
    if (filters.onSale && !product.compareAtPrice) {
      return false;
    }
    const price = parsePrice(product.price);
    if (filters.priceMin != null && price < filters.priceMin) return false;
    if (filters.priceMax != null && price > filters.priceMax) return false;
    return true;
  });

  const sorted = [...filtered];
  switch (sort) {
    case 'price-asc':
      sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
      break;
    case 'price-desc':
      sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
      break;
    case 'rating-desc':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'reviews-desc':
      sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case 'name-asc':
      sorted.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'featured':
    default:
      break;
  }
  return sorted;
}

export interface FilterFacets {
  strains: StrainType[];
  categories: string[];
  effects: string[];
  priceMin: number;
  priceMax: number;
  hasSaleItems: boolean;
}

export function getFilterFacets(products: MockProduct[]): FilterFacets {
  const strains = Array.from(
    new Set(products.map((p) => p.strain)),
  ) as StrainType[];
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const effects = Array.from(
    new Set(products.flatMap((p) => p.effects)),
  ).sort();
  const prices = products.map((p) => parsePrice(p.price));
  const priceMin = prices.length ? Math.floor(Math.min(...prices)) : 0;
  const priceMax = prices.length ? Math.ceil(Math.max(...prices)) : 0;
  const hasSaleItems = products.some((p) => Boolean(p.compareAtPrice));
  return {strains, categories, effects, priceMin, priceMax, hasSaleItems};
}

export function getSalePercent(
  price: string,
  compareAtPrice?: string,
): number | null {
  if (!compareAtPrice) return null;
  const current = parsePrice(price);
  const original = parsePrice(compareAtPrice);
  if (!original || current >= original) return null;
  return Math.round(((original - current) / original) * 100);
}
