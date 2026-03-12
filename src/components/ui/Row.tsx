import type { ReactNode } from "react"

type RowProps = {
  children: ReactNode
  gap?: string
  align?: 'start' | 'center' | 'end'
  justify?: 'start' | 'center' | 'end' | 'between'
  className?: string
}

export function Row({
  children,
  gap = '0.75rem',
  align = 'center',
  justify = 'start',
  className,
}: RowProps) {
  const justifyMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
  }

  const alignMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
  }

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        gap,
        alignItems: alignMap[align],
        justifyContent: justifyMap[justify],
      }}
    >
      {children}
    </div>
  )
}
