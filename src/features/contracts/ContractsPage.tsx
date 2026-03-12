import { DashboardGrid } from '../../components/ui/DashboardGrid';
import { Stack } from '../../components/ui/Stack';
import { ContractActionsPanel } from './components/ContractActionsPanel';
import { ContractDetails } from './components/ContractDetails';
import { ContractsList } from './components/ContractsList';

export function ContractsPage() {
  return (
    <Stack>
      <ContractActionsPanel />
      <DashboardGrid>
        <ContractsList />
        <ContractDetails />
      </DashboardGrid>
    </Stack>
  );
}
