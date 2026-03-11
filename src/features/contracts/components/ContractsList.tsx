import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { CountdownText } from "../../../components/ui/CountdownText";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { LoadingState } from "../../../components/ui/LoadingState";
import { Panel } from "../../../components/ui/Panel";
import { PanelTitle } from "../../../components/ui/PanelTitle";
import { StatusText } from "../../../components/ui/StatusText";
import { useGetContractsQuery } from "../../../services/spacetradersApi";
import { setSelectedContractId } from "../contractsUiSlice";
import { ContractStatusPill } from "./ContractStatusPill";
import { PayoutBadge } from "./PayoutBadge";

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
                <div className='contract-card-top'>
                  <div className='contract-card-heading'>
                    <div className='contract-type'>{contract.type}</div>
                    <div className='contract-meta'>ID: {contract.id.slice(0, 9)}...</div>
                  </div>

                  <ContractStatusPill
                    accepted={contract.accepted}
                    fulfilled={contract.fulfilled}
                  />
                </div>

                <div className='contract-card-meta'>
                  <CountdownText isoDate={contract.terms.deadline} />
                </div>

                <div className='payout-row'>
                  <PayoutBadge
                    label='On Accept'
                    amount={contract.terms.payment.onAccepted}
                  />
                  <PayoutBadge
                    label='On Fulfill'
                    amount={contract.terms.payment.onFulfilled}
                  />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
