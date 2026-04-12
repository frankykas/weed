import {useEffect, useMemo, useState, type ReactNode} from 'react';
import type {MockProduct, StrainType} from '~/lib/mockCatalog';
import {formatHandle} from '~/lib/mockCatalog';
import {
  EMPTY_FILTERS,
  SORT_OPTIONS,
  applyFiltersAndSort,
  countActiveFilters,
  getFilterFacets,
  type CollectionFilters,
  type FilterFacets,
  type SortKey,
} from '~/lib/collectionFilters';

export interface CollectionControlsState {
  filtered: MockProduct[];
  view: 'grid' | 'list';
  resetFilters: () => void;
  hasActiveFilters: boolean;
  filters: CollectionFilters;
  setFilters: (filters: CollectionFilters) => void;
  facets: FilterFacets;
}

interface Props {
  products: MockProduct[];
  showCategoryFilter?: boolean;
  renderBeforeToolbar?: (state: CollectionControlsState) => ReactNode;
  children: (state: CollectionControlsState) => ReactNode;
}

export function CollectionControls({
  products,
  showCategoryFilter = false,
  renderBeforeToolbar,
  children,
}: Props) {
  const facets = useMemo(() => getFilterFacets(products), [products]);
  const [filters, setFilters] = useState<CollectionFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortKey>('featured');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(
    () => applyFiltersAndSort(products, filters, sort),
    [products, filters, sort],
  );

  const activeCount = countActiveFilters(filters);
  const hasActiveFilters = activeCount > 0;

  const resetFilters = () => setFilters(EMPTY_FILTERS);

  const state: CollectionControlsState = {
    filtered,
    view,
    resetFilters,
    hasActiveFilters,
    filters,
    setFilters,
    facets,
  };

  // Lock body scroll when drawer open
  useEffect(() => {
    if (!drawerOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [drawerOpen]);

  return (
    <>
      {renderBeforeToolbar?.(state)}
      <Toolbar
        resultCount={filtered.length}
        totalCount={products.length}
        sort={sort}
        onSortChange={setSort}
        view={view}
        onViewChange={setView}
        activeFilterCount={activeCount}
        onOpenFilters={() => setDrawerOpen(true)}
      />

      {hasActiveFilters && (
        <ActiveFilterChips
          filters={filters}
          onChange={setFilters}
          onClearAll={resetFilters}
        />
      )}

      {children(state)}

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={setFilters}
        facets={facets}
        resultCount={filtered.length}
        showCategoryFilter={showCategoryFilter}
      />
    </>
  );
}

// ============================================================
//  TOOLBAR
// ============================================================

function Toolbar({
  resultCount,
  totalCount,
  sort,
  onSortChange,
  view,
  onViewChange,
  activeFilterCount,
  onOpenFilters,
}: {
  resultCount: number;
  totalCount: number;
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
  view: 'grid' | 'list';
  onViewChange: (v: 'grid' | 'list') => void;
  activeFilterCount: number;
  onOpenFilters: () => void;
}) {
  return (
    <div className="sticky top-0 z-30 -mx-gutter px-gutter py-3 bg-surface/85 backdrop-blur-lg border-b border-border-light mb-4">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Result count */}
        <div className="text-xs sm:text-sm text-secondary shrink-0">
          <span className="font-bold text-primary">{resultCount}</span>
          <span className="hidden sm:inline"> of {totalCount}</span>
          <span className="hidden sm:inline"> products</span>
        </div>

        <div className="flex-1" />

        {/* Filter button */}
        <button
          type="button"
          onClick={onOpenFilters}
          className="
            relative flex items-center gap-1.5
            px-3 py-2 rounded-xl
            bg-surface border border-border-light
            text-xs sm:text-sm font-semibold text-primary
            hover:border-accent/40 hover:shadow-card
            active:scale-95
            transition-all duration-200 ease-[var(--ease-out)]
          "
        >
          <FilterIcon className="size-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center size-4 rounded-full bg-accent text-white text-[0.6rem] font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="
              appearance-none
              pl-3 pr-8 py-2 rounded-xl
              bg-surface border border-border-light
              text-xs sm:text-sm font-semibold text-primary
              hover:border-accent/40
              focus:outline-none focus:ring-2 focus:ring-accent/30
              cursor-pointer
            "
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 size-3.5 text-tertiary pointer-events-none" />
        </div>

        {/* View toggle */}
        <div className="hidden sm:flex items-center p-0.5 rounded-xl bg-surface-sunken border border-border-light">
          <button
            type="button"
            onClick={() => onViewChange('grid')}
            className={`size-8 flex items-center justify-center rounded-lg transition-all duration-200 ${
              view === 'grid'
                ? 'bg-surface shadow-card text-primary'
                : 'text-tertiary hover:text-primary'
            }`}
            aria-label="Grid view"
            aria-pressed={view === 'grid'}
          >
            <GridIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewChange('list')}
            className={`size-8 flex items-center justify-center rounded-lg transition-all duration-200 ${
              view === 'list'
                ? 'bg-surface shadow-card text-primary'
                : 'text-tertiary hover:text-primary'
            }`}
            aria-label="List view"
            aria-pressed={view === 'list'}
          >
            <ListIcon className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  ACTIVE FILTER CHIPS
// ============================================================

function ActiveFilterChips({
  filters,
  onChange,
  onClearAll,
}: {
  filters: CollectionFilters;
  onChange: (f: CollectionFilters) => void;
  onClearAll: () => void;
}) {
  const chips: {label: string; remove: () => void}[] = [];

  filters.strains.forEach((s) => {
    chips.push({
      label: s,
      remove: () =>
        onChange({...filters, strains: filters.strains.filter((v) => v !== s)}),
    });
  });
  filters.categories.forEach((c) => {
    chips.push({
      label: formatHandle(c),
      remove: () =>
        onChange({
          ...filters,
          categories: filters.categories.filter((v) => v !== c),
        }),
    });
  });
  filters.effects.forEach((e) => {
    chips.push({
      label: e,
      remove: () =>
        onChange({...filters, effects: filters.effects.filter((v) => v !== e)}),
    });
  });
  if (filters.onSale) {
    chips.push({
      label: 'On Sale',
      remove: () => onChange({...filters, onSale: false}),
    });
  }
  if (filters.priceMin != null || filters.priceMax != null) {
    const label =
      filters.priceMin != null && filters.priceMax != null
        ? `$${filters.priceMin}–$${filters.priceMax}`
        : filters.priceMin != null
          ? `Over $${filters.priceMin}`
          : `Under $${filters.priceMax}`;
    chips.push({
      label,
      remove: () => onChange({...filters, priceMin: null, priceMax: null}),
    });
  }

  return (
    <div className="flex items-center gap-2 flex-wrap mb-4">
      {chips.map((chip) => (
        <button
          key={chip.label}
          type="button"
          onClick={chip.remove}
          className="
            group flex items-center gap-1.5
            px-2.5 py-1 rounded-full
            bg-accent-light text-accent
            text-xs font-semibold
            hover:bg-accent hover:text-white
            transition-all duration-200 ease-[var(--ease-out)]
          "
        >
          <span>{chip.label}</span>
          <XIcon className="size-3" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-semibold text-tertiary hover:text-primary underline underline-offset-2"
      >
        Clear all
      </button>
    </div>
  );
}

// ============================================================
//  FILTER DRAWER
// ============================================================

function FilterDrawer({
  open,
  onClose,
  filters,
  onChange,
  facets,
  resultCount,
  showCategoryFilter,
}: {
  open: boolean;
  onClose: () => void;
  filters: CollectionFilters;
  onChange: (f: CollectionFilters) => void;
  facets: FilterFacets;
  resultCount: number;
  showCategoryFilter: boolean;
}) {
  const [draft, setDraft] = useState<CollectionFilters>(filters);

  // Sync when drawer opens
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  if (!open) return null;

  const toggleArray = <T extends string>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const apply = () => {
    onChange(draft);
    onClose();
  };

  const clear = () => setDraft(EMPTY_FILTERS);

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close filters"
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-0 z-[60] flex items-end sm:items-stretch sm:justify-end pointer-events-none">
        <div
          className="
            relative w-full sm:max-w-md
            bg-surface rounded-t-3xl sm:rounded-none
            shadow-overlay
            max-h-[90dvh] sm:max-h-none sm:h-full
            flex flex-col
            pointer-events-auto
            animate-slide-up sm:animate-fade-in
          "
        >
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-border-light">
            <div>
              <h2 className="text-lg font-bold text-primary">Filters</h2>
              <p className="text-xs text-tertiary">
                Refine by strain, effect, and price
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="size-9 flex items-center justify-center rounded-xl bg-surface-sunken hover:bg-border-light transition-colors active:scale-90"
              aria-label="Close filters"
            >
              <XIcon className="size-4 text-primary" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
            {/* Strain */}
            {facets.strains.length > 0 && (
              <FilterSection title="Strain Type">
                <div className="flex flex-wrap gap-2">
                  {facets.strains.map((strain) => (
                    <PillToggle
                      key={strain}
                      active={draft.strains.includes(strain)}
                      onClick={() =>
                        setDraft({
                          ...draft,
                          strains: toggleArray(draft.strains, strain),
                        })
                      }
                    >
                      {strain}
                    </PillToggle>
                  ))}
                </div>
              </FilterSection>
            )}

            {/* Category */}
            {showCategoryFilter && facets.categories.length > 0 && (
              <FilterSection title="Category">
                <div className="flex flex-wrap gap-2">
                  {facets.categories.map((cat) => (
                    <PillToggle
                      key={cat}
                      active={draft.categories.includes(cat)}
                      onClick={() =>
                        setDraft({
                          ...draft,
                          categories: toggleArray(draft.categories, cat),
                        })
                      }
                    >
                      {formatHandle(cat)}
                    </PillToggle>
                  ))}
                </div>
              </FilterSection>
            )}

            {/* Effects */}
            {facets.effects.length > 0 && (
              <FilterSection title="Effects">
                <div className="flex flex-wrap gap-2">
                  {facets.effects.map((effect) => (
                    <PillToggle
                      key={effect}
                      active={draft.effects.includes(effect)}
                      onClick={() =>
                        setDraft({
                          ...draft,
                          effects: toggleArray(draft.effects, effect),
                        })
                      }
                    >
                      {effect}
                    </PillToggle>
                  ))}
                </div>
              </FilterSection>
            )}

            {/* Price range */}
            <FilterSection title="Price Range">
              <PriceRangeControl
                min={facets.priceMin}
                max={facets.priceMax}
                valueMin={draft.priceMin}
                valueMax={draft.priceMax}
                onChange={(priceMin, priceMax) =>
                  setDraft({...draft, priceMin, priceMax})
                }
              />
            </FilterSection>

            {/* Deals */}
            {facets.hasSaleItems && (
              <FilterSection title="Deals">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-border-light hover:border-accent/30 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={draft.onSale}
                    onChange={(e) =>
                      setDraft({...draft, onSale: e.target.checked})
                    }
                    className="size-4 accent-accent"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-primary">
                      On Sale Only
                    </div>
                    <div className="text-xs text-tertiary">
                      Show discounted products
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-red-500 text-white text-[0.6rem] font-bold rounded-md">
                    SALE
                  </span>
                </label>
              </FilterSection>
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 flex items-center gap-3 px-5 py-4 border-t border-border-light bg-surface">
            <button
              type="button"
              onClick={clear}
              className="px-4 py-3 text-sm font-semibold text-secondary hover:text-primary transition-colors"
            >
              Clear all
            </button>
            <button
              type="button"
              onClick={apply}
              className="flex-1 px-4 py-3 bg-accent text-white text-sm font-bold rounded-xl shadow-card hover:shadow-raised active:scale-[0.98] transition-all duration-200 ease-[var(--ease-out)]"
            >
              Show {resultCount}{' '}
              {resultCount === 1 ? 'product' : 'products'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="text-xs font-bold tracking-wider uppercase text-tertiary mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

function PillToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-xl text-xs font-semibold
        transition-all duration-200 ease-[var(--ease-out)]
        active:scale-95
        ${
          active
            ? 'bg-accent text-white shadow-card'
            : 'bg-surface-sunken text-secondary border border-border-light hover:border-accent/40 hover:text-primary'
        }
      `.trim()}
    >
      {children}
    </button>
  );
}

function PriceRangeControl({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
}: {
  min: number;
  max: number;
  valueMin: number | null;
  valueMax: number | null;
  onChange: (min: number | null, max: number | null) => void;
}) {
  // Preset buckets
  const presets = [
    {label: `Under $${Math.round(min + (max - min) / 3)}`, min: null, max: Math.round(min + (max - min) / 3)},
    {
      label: `$${Math.round(min + (max - min) / 3)}–$${Math.round(min + (2 * (max - min)) / 3)}`,
      min: Math.round(min + (max - min) / 3),
      max: Math.round(min + (2 * (max - min)) / 3),
    },
    {label: `Over $${Math.round(min + (2 * (max - min)) / 3)}`, min: Math.round(min + (2 * (max - min)) / 3), max: null},
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => {
          const active = valueMin === p.min && valueMax === p.max;
          return (
            <PillToggle
              key={p.label}
              active={active}
              onClick={() =>
                active ? onChange(null, null) : onChange(p.min, p.max)
              }
            >
              {p.label}
            </PillToggle>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <label className="flex-1 block">
          <span className="block text-[0.65rem] font-semibold text-tertiary uppercase mb-1">
            Min
          </span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-tertiary">
              $
            </span>
            <input
              type="number"
              min={min}
              max={max}
              value={valueMin ?? ''}
              placeholder={String(min)}
              onChange={(e) => {
                const v = e.target.value === '' ? null : Number(e.target.value);
                onChange(v, valueMax);
              }}
              className="w-full pl-6 pr-3 py-2 rounded-xl bg-surface-sunken border border-border-light text-sm font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </label>
        <div className="text-tertiary pt-5">–</div>
        <label className="flex-1 block">
          <span className="block text-[0.65rem] font-semibold text-tertiary uppercase mb-1">
            Max
          </span>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-tertiary">
              $
            </span>
            <input
              type="number"
              min={min}
              max={max}
              value={valueMax ?? ''}
              placeholder={String(max)}
              onChange={(e) => {
                const v = e.target.value === '' ? null : Number(e.target.value);
                onChange(valueMin, v);
              }}
              className="w-full pl-6 pr-3 py-2 rounded-xl bg-surface-sunken border border-border-light text-sm font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </label>
      </div>
    </div>
  );
}

// ============================================================
//  ICONS
// ============================================================

function FilterIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
      />
    </svg>
  );
}

function ChevronDownIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function GridIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
      />
    </svg>
  );
}

function ListIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}

function XIcon({className}: {className?: string}) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}
