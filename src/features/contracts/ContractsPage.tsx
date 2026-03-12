import { ContractActionsPanel } from "./components/ContractActionsPanel";
import { ContractDetails } from "./components/ContractDetails";
import { ContractsList } from "./components/ContractsList";

export function ContractsPage() {
  return (
    <div className='dashboard-grid'>
      <ContractsList />
      <div style={{ rowGap: '1rem', display: 'grid' }}>
        <ContractActionsPanel />
        <ContractDetails />
      </div>
    </div>
  );
}
