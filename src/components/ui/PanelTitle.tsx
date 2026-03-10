import type { ReactNode } from "react"

type PanelTitleProps = {
  children: ReactNode
  as?: 'h1' | 'h2' | 'h3'
}

export function PanelTitle({
  children,
  as = 'h2',
}: PanelTitleProps) {
  const Component = as;

  return <Component className='panel-title'>{children}</Component>;
}
