import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/tags._index';
import {mockTags} from '~/lib/mockCatalog';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Greenly - Tags'}];
};

export async function loader() {
  return {tags: mockTags};
}

export default function TagsIndex() {
  const {tags} = useLoaderData<typeof loader>();

  return (
    <div className="max-w-content mx-auto px-gutter pb-section">
      <div className="pt-6 pb-2 sm:pt-8">
        <div className="flex items-center gap-2 text-xs text-tertiary mb-2">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRightIcon />
          <span className="text-primary font-medium">Tags</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight mb-1">Browse Tags</h1>
        <p className="text-sm text-secondary leading-relaxed max-w-xl">
          Explore mock product groupings by vibe, effect, format, and shopper intent.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {tags.map((tag) => (
          <Link key={tag.handle} to={`/tags/${tag.handle}`} className="group rounded-2xl border border-border-light bg-surface p-4 hover:border-accent/30 hover:shadow-card transition-all duration-200">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-primary group-hover:text-accent transition-colors">#{tag.title}</h2>
                <p className="text-sm text-secondary leading-relaxed mt-1">{tag.description}</p>
              </div>
              <div className="shrink-0 px-2.5 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold">
                {tag.productHandles.length}
              </div>
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
