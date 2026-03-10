import type { ReactNode } from "react"

type MutedTextProps = {
  children: ReactNode
}

export function MutedText({ children }: MutedTextProps) {
  return <p className='muted-text'>{children}</p>
}
