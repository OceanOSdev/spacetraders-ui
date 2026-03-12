import type { ReactNode } from "react"
import { cn } from "../../utils/cn"

type StackGapSize = 'normal' | 'large';

type StackProps = {
  children: ReactNode
  gapSize?: StackGapSize
  className?: string
}

export function Stack({ children, gapSize = 'normal', className }: StackProps) {
  return (
    <div className={cn(gapSize === 'normal' ? 'stack' : 'stack-lg', className)}>
      {children}
    </div>
  );
}
