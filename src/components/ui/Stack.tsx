import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { getGapValue, type GapSize } from './layoutTokens';

type StackProps = {
  children: ReactNode;
  gap?: GapSize | string;
  align?: 'stretch' | 'start' | 'center' | 'end';
  className?: string;
  style?: CSSProperties;
};

export function Stack({
  children,
  gap = 'md',
  align = 'stretch',
  className,
  style,
}: StackProps) {
  return (
    <div
      className={cn('stack', className)}
      style={{
        rowGap: getGapValue(gap, '1rem'),
        justifyItems: align,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
