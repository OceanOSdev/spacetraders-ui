import type { CSSProperties, ReactNode } from 'react';
import { getGapValue, type GapSize } from './layoutTokens';

type GridProps = {
  children: ReactNode;
  columns?: number | string;
  gap?: GapSize | string;
  className?: string;
  style?: CSSProperties;
};

export function Grid({
  children,
  columns = 1,
  gap = '1rem',
  className,
  style,
}: GridProps) {
  const gridTemplateColumns =
    typeof columns === 'number'
      ? `repeat(${columns}, minmax(0, 1fr))`
      : columns;

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns,
        gap: getGapValue(gap, '1rem'),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
