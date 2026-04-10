interface BottomNavItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

interface BottomNavigationProps {
  items: BottomNavItem[];
  className?: string;
}

export function BottomNavigation({
  items,
  className = '',
}: BottomNavigationProps) {
  return (
    <nav
      className={`
        fixed bottom-0 inset-x-0 z-50
        sm:hidden
        pb-[env(safe-area-inset-bottom)]
        ${className}
      `.trim()}
    >
      <div
        className="
          mx-2 mb-2
          bg-surface/85 backdrop-blur-xl
          border border-border-light
          rounded-2xl
          shadow-raised
        "
      >
        <div className="flex items-center justify-around py-1.5">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              className={`
                flex flex-col items-center justify-center
                gap-0.5
                min-w-[3.25rem] py-1.5 px-2
                rounded-xl
                transition-colors duration-150
                active:scale-90
                ${
                  item.active
                    ? 'text-accent'
                    : 'text-tertiary'
                }
              `.trim()}
            >
              <span
                className={`
                  flex items-center justify-center
                  size-6
                  [&>svg]:size-full
                  ${item.active ? 'scale-105' : ''}
                `.trim()}
              >
                {item.icon}
              </span>

              <span
                className={`
                  text-[0.6rem] leading-none font-medium
                  ${item.active ? 'text-accent' : 'text-tertiary'}
                `.trim()}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
