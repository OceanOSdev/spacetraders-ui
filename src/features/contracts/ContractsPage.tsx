import { ContractActionsPanel } from "./components/ContractActionsPanel";
import { ContractDetails } from "./components/ContractDetails";
import { ContractsList } from "./components/ContractsList";

export function ContractsPage() {
  return (
    <div className='stack'>
      <ContractActionsPanel />
      <div className='dashboard-grid'>
        <ContractsList />
        <ContractDetails />
      </div>
    </div>
  );
}
