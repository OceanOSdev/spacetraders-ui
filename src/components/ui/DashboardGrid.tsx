import type { CSSProperties, ReactNode } from "react"
import { Grid } from "./Grid";
import type { GapSize } from "./layoutTokens";

type DashboardGridProps = {
  children: ReactNode
  columns?: string | number
  gap?: GapSize | string
  className?: string
  style?: CSSProperties
}

export function DashboardGrid({
  children,
  columns = '320px minmax(0, 1fr)',
  gap = 'md',
  className,
  style,
}: DashboardGridProps) {
  return (
    <Grid
      columns={columns}
      className={className}
      gap={gap}
      style={{ alignItems: 'start', ...style }}
    >
      {children}
    </Grid>
  );
}
