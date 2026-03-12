import type { ReactNode } from "react"
import { Grid } from "./Grid";

type DashboardGridProps = {
  children: ReactNode
  className?: string
}

export function DashboardGrid({ children, className }: DashboardGridProps) {
  return (
    <Grid
      columns='320px 1fr'
      className={className}
      style={{ alignItems: 'start' }}
    >
      {children}
    </Grid>
  );
}
