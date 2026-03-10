import type { ReactNode } from "react"

type PanelProps = {
  children: ReactNode
  className?: string
  as?: 'section' | 'div' | 'article'
}

export function Panel({
  children,
  className = '',
  as = 'section',
}: PanelProps) {
  const Component = as;

  return (
    <Component className={`panel ${className}`.trim()}>
      {children}
    </Component>
  )
}
