import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

type PanelProps = {
  children: ReactNode;
  className?: string;
  as?: 'section' | 'div' | 'article';
};

export function Panel({ children, className = '', as = 'section' }: PanelProps) {
  const Component = as;

  return <Component className={cn('panel', className)}>{children}</Component>;
}
