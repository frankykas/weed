interface CategoryPillProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function CategoryPill({
  label,
  active = false,
  onClick,
  icon,
  className = '',
}: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex items-center gap-1.5
        shrink-0
        px-4 py-2
        rounded-full
        text-sm font-medium
        whitespace-nowrap
        transition-all duration-200 ease-[var(--ease-out)]
        active:scale-95
        ${
          active
            ? 'bg-accent text-white'
            : 'bg-transparent text-secondary hover:text-primary hover:bg-surface-sunken'
        }
        ${className}
      `.trim()}
    >
      {icon && (
        <span className="shrink-0 [&>svg]:size-4">{icon}</span>
      )}
      {label}
    </button>
  );
}
