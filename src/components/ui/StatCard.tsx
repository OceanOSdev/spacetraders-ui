import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

type StatCardProps = {
  label: ReactNode;
  value: ReactNode;
  className?: string;
};

export function StatCard({ label, value, className }: StatCardProps) {
  return (
    <div className={cn('stat-card', className)}>
      <div className='stat-label'>{label}</div>
      <div className='stat-value'>{value}</div>
    </div>
  );
}
