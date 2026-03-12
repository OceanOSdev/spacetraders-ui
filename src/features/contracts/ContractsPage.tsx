import { Stack } from "../../components/ui/Stack";
import { ContractActionsPanel } from "./components/ContractActionsPanel";
import { ContractDetails } from "./components/ContractDetails";
import { ContractsList } from "./components/ContractsList";

export function ContractsPage() {
  return (
    <Stack>
      <ContractActionsPanel />
      <div className='dashboard-grid'>
        <ContractsList />
        <ContractDetails />
      </div>
    </Stack>
  );
}
