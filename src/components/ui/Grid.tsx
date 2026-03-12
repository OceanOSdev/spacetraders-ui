import type { ReactNode } from "react"

type GridProps = {
  children: ReactNode
  columns?: number | string
  gap?: string
  className?: string
}

export function Grid({
  children,
  columns = 1,
  gap = '1rem',
  className,
}: GridProps) {
  const gridTemplateColumns =
    typeof columns === 'number'
      ? `repeat(${columns}, 1fr)`
      : columns;

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns,
        gap,
      }}
    >
      {children}
    </div>
  );
}
