/**
 * Reusable page container with consistent max-width and padding.
 * Use `narrow` for single-column content (forms, articles).
 * Defaults to the standard content width.
 */

interface PageContainerProps {
  children: React.ReactNode;
  as?: React.ElementType;
  narrow?: boolean;
  className?: string;
}

export function PageContainer({
  children,
  as: Component = 'div',
  narrow = false,
  className = '',
}: PageContainerProps) {
  const maxWidth = narrow ? 'max-w-narrow' : 'max-w-content';

  return (
    <Component
      className={`mx-auto w-full px-gutter ${maxWidth} ${className}`.trim()}
    >
      {children}
    </Component>
  );
}
