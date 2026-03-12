import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

type PanelTitleProps = {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
};

export function PanelTitle({ children, className, as = 'h2' }: PanelTitleProps) {
  const Component = as;

  return <Component className={cn('panel-title', className)}>{children}</Component>;
}
