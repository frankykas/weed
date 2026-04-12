import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/tags.$tag';
import {getProductsForTag, getMockTagByHandle} from '~/lib/mockCatalog';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Greenly - ${data?.tag.title ?? 'Tag'}`}];
};

export async function clientLoader({params}: Route.ClientLoaderArgs) {
  const handle = params.tag;
  if (!handle) {
    throw new Response('Tag not found', {status: 404});
  }

  const tag = getMockTagByHandle(handle);
  if (!tag) {
    throw new Response('Tag not found', {status: 404});
  }

  return {tag, products: getProductsForTag(handle)};
}

const PASTEL_BGS = [
  'bg-lime-50',
  'bg-purple-50',
  'bg-amber-50',
  'bg-sky-50',
  'bg-rose-50',
  'bg-teal-50',
  'bg-orange-50',
  'bg-violet-50',
];

export default function TagPage() {
  const {tag, products} = useLoaderData<typeof clientLoader>();

  return (
    <div className="max-w-content mx-auto px-gutter pb-section">
      <div className="pt-6 pb-2 sm:pt-8">
        <div className="flex items-center gap-2 text-xs text-tertiary mb-2">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRightIcon />
          <Link to="/tags" className="hover:text-primary transition-colors">Tags</Link>
          <ChevronRightIcon />
          <span className="text-primary font-medium">{tag.title}</span>
        </div>

        <div className="rounded-3xl border border-border-light bg-gradient-to-br from-white to-surface-sunken p-5 sm:p-6 mb-6">
          <span className="inline-flex px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold mb-3">
            Tag Page
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight mb-2">#{tag.title}</h1>
          <p className="text-sm text-secondary leading-relaxed max-w-xl mb-4">{tag.description}</p>
          <span className="px-3 py-1 rounded-full bg-surface border border-border-light text-xs font-medium text-primary">
            {products.length} matching products
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5">
        {products.map((product, index) => (
          <Link key={product.id} to={`/products/${product.handle}`} prefetch="intent" className="group block">
            <div className={`relative rounded-2xl overflow-hidden ${PASTEL_BGS[index % PASTEL_BGS.length]} aspect-square flex items-center justify-center mb-2.5`}>
              <div className="absolute inset-4 rounded-[40%_60%_55%_45%/50%_40%_60%_50%] bg-white/40" />
              <img src={product.image} alt={product.title} className="relative z-10 w-[62%] h-[62%] object-contain drop-shadow-lg transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-105" />
              <span className="absolute top-2.5 left-2.5 z-20 px-2 py-0.5 bg-white/85 text-[0.6rem] font-bold text-primary rounded-lg shadow-card">
                {product.strain}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-primary leading-snug mb-0.5 line-clamp-1">{product.title}</h3>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-accent">{product.price}</span>
              <span className="text-[0.65rem] text-tertiary line-clamp-1">{product.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="size-3 text-border" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );
}
