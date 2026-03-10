import { Panel } from "./Panel"
import { PanelTitle } from "./PanelTitle"
import { StatusText } from "./StatusText"

type LoadingStateProps = {
  title: string
  message: string
}

export function LoadingState({ title, message }: LoadingStateProps) {
  return (
    <Panel>
      <PanelTitle>{title}</PanelTitle>
      <StatusText>{message}</StatusText>
    </Panel>
  );
}
