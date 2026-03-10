import type { ReactNode } from "react"

type StatusTextProps = {
  children: ReactNode
}

export function StatusText({ children }: StatusTextProps) {
  return <p className='status-text'>{children}</p>;
}
