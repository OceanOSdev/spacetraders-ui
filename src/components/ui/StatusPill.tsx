import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type StatusPillTone = 'green' | 'cyan' | 'amber' | 'red' | 'gray';

type StatusPillProps = {
  children: ReactNode;
  tone?: StatusPillTone;
  className?: string;
};

export function StatusPill({ children, tone = 'gray', className }: StatusPillProps) {
  return <span className={cn('status-pill', `status-pill-${tone}`, className)}>{children}</span>;
}
