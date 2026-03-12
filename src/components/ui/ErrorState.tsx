import type { ReactNode } from 'react';
import { Panel } from './Panel';
import { PanelTitle } from './PanelTitle';

type ErrorStateProps = {
  title: string;
  message: string;
  action?: ReactNode;
};

export function ErrorState({ title, message, action }: ErrorStateProps) {
  return (
    <Panel>
      <PanelTitle>{title}</PanelTitle>
      <p>{message}</p>
      {action}
    </Panel>
  );
}
