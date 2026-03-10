import type { ReactNode } from "react"
import { useAppSelector } from "../../app/hooks"
import { TokenForm } from "./TokenForm";

type AuthGateProps = {
  children: ReactNode
}

export function AuthGate({ children }: AuthGateProps) {
  const token = useAppSelector((state) => state.auth.token);

  // Don't try to use any authenticated APIs if
  // there's no token yet
  if (!token) {
    return <TokenForm />;
  }

  return <>{children}</>;
}
