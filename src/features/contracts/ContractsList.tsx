import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { Panel } from "../../components/ui/Panel";
import { PanelTitle } from "../../components/ui/PanelTitle";
import { StatusText } from "../../components/ui/StatusText";
import { useGetContractsQuery } from "../../services/spacetradersApi";
import { setSelectedContractId } from "./contractsUiSlice";

export function ContractsList() {
  const dispatch = useAppDispatch();
  const selectedContractId = useAppSelector((s) => s.contractsUi.selectedContractId);
  const { data, error, isLoading, isFetching } = useGetContractsQuery();

  if (isLoading) {
    return <LoadingState title='Contracts' message='Loading contract ledger...' />;
  }

  if (error) {
    return <ErrorState title='Contracts' message='Could not load contracts.' />;
  }

  if (!data || data.data.length === 0) {
    return <EmptyState title='Contracts' message='No contracts found.' />;
  }

  return (
    <Panel>
      <PanelTitle>Contract Ledger</PanelTitle>
      {isFetching && <StatusText>Refreshing contracts...</StatusText>}

      <ul className='ship-list'>
        {data.data.map((contract) => {
          const isSelected = contract.id === selectedContractId;

          return (
            <li className='ship-list-item' key={contract.id}>
              <button
                className={`ship-button${isSelected ? ' selected' : ''}`}
                onClick={() => dispatch(setSelectedContractId(contract.id))}
              >
                <div className='ship-symbol'>{contract.type}</div>
                <div className='ship-meta'>ID: {contract.id}</div>
                <div className='ship-meta'>
                  Accepted: {contract.accepted ? 'Yes' : 'No'}
                </div>
                <div className='ship-meta'>
                  Fulfilled: {contract.fulfilled ? 'Yes' : 'No'}
                </div>

                <div className='ship-meta'>
                  Deliveries: {contract.terms.deliver.length}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
