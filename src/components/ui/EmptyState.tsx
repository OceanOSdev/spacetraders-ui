import type { ReactNode } from 'react';
import { Panel } from './Panel';
import { PanelTitle } from './PanelTitle';

type EmptyStateProps = {
  title: string;
  message: string;
  action?: ReactNode;
};

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <Panel>
      <PanelTitle>{title}</PanelTitle>
      <p>{message}</p>
      {action}
    </Panel>
  );
}
