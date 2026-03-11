import { ContractDetails } from "./components/ContractDetails";
import { ContractsList } from "./components/ContractsList";

export function ContractsPage() {
  return (
    <div className='dashboard-grid'>
      <ContractsList />
      <ContractDetails />
    </div>
  );
}
