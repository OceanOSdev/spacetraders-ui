import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { getGapValue, type GapSize } from './layoutTokens';

type StackProps = {
  children: ReactNode;
  gap?: GapSize | string;
  className?: string;
  style?: CSSProperties;
};

export function Stack({ children, gap = 'md', className, style }: StackProps) {
  return (
    <div
      className={cn('stack', className)}
      style={{
        rowGap: getGapValue(gap, '1rem'),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
