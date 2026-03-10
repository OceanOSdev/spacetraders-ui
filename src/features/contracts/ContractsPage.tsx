import { ContractDetails } from "./ContractDetails";
import { ContractsList } from "./ContractsList";

export function ContractsPage() {
  return (
    <div className='dashboard-grid'>
      <ContractsList />
      <ContractDetails />
    </div>
  );
}
