import { useAppSelector } from '../../../app/hooks';
import { ContractsPage } from '../../contracts/ContractsPage';
import { ShipsPage } from '../../ships/ShipsPage';
import { Panel } from '../../../components/ui/Panel';
import { PanelTitle } from '../../../components/ui/PanelTitle';
import { StatCard } from '../../../components/ui/StatCard';
import type { Agent } from '../../../types/spacetraders';
import { Stack } from '../../../components/ui/Stack';

type OverviewHeaderProps = {
  agent: Agent;
};

function OverviewHeader({ agent }: OverviewHeaderProps) {
  return (
    <Panel>
      <PanelTitle>Overview</PanelTitle>
      <div className='info-grid'>
        <StatCard label='Agent' value={agent.symbol} />
        <StatCard label='Headquarters' value={agent.headquarters} />
        <StatCard label='Credits' value={agent.credits.toLocaleString()} />
        <StatCard label='Ships' value={agent.shipCount} />
      </div>
    </Panel>
  );
}

const VIEW_COMPONENTS = {
  ships: ShipsPage,
  contracts: ContractsPage,
};

function PageContent() {
  const activeView = useAppSelector((state) => state.appView.activeView);
  const View = VIEW_COMPONENTS[activeView];

  return <View />;
}

type AppContentProps = {
  agent: Agent;
};

export function AppContent({ agent }: AppContentProps) {
  return (
    <Stack>
      <OverviewHeader agent={agent} />
      <PageContent />
    </Stack>
  );
}
