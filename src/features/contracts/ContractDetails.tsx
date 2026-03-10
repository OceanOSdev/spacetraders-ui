import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { useAcceptContractMutation, useGetContractQuery, useGetShipsQuery, useNegotiateContractMutation } from "../../services/spacetradersApi";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingState } from "../../components/ui/LoadingState";
import { ErrorState } from "../../components/ui/ErrorState";
import { Panel } from "../../components/ui/Panel";
import { PanelTitle } from "../../components/ui/PanelTitle";
import { StatusText } from "../../components/ui/StatusText";
import { StatCard } from "../../components/ui/StatCard";

export function ContractDetails() {
  const selectedContractId = useAppSelector((s) => s.contractsUi.selectedContractId);
  const [negotiateShip, setNegotiateShip] = useState('');

  const { data, error, isLoading, isFetching } = useGetContractQuery(
    selectedContractId ?? '',
    { skip: !selectedContractId },
  );

  const { data: shipsData } = useGetShipsQuery();
  const [acceptContract, { isLoading: isAccepting }] = useAcceptContractMutation();
  const [negotiateContract, { isLoading: isNegotiating }] = useNegotiateContractMutation();

  if (!selectedContractId) {
    return <EmptyState title="Contract Details" message="Select a contract to see details." />;
  }

  if (isLoading) {
    return <LoadingState title="Contract Details" message="Loading contract terms..." />;
  }

  if (error) {
    return <ErrorState title="Contract Details" message="Could not load contract details." />;
  }

  if (!data) {
    return <EmptyState title="Contract Details" message="No contract details found." />;
  }

  const contract = data.data;

  async function handleAccept() {
    await acceptContract(contract.id);
  }

  async function handleNegotiate() {
    if (!negotiateShip) return;
    await negotiateContract(negotiateShip);
  }

  return (
    <Panel>
      <PanelTitle>Contract Briefing</PanelTitle>
      {isFetching && <StatusText>Refreshing contract...</StatusText>}

      <div className='detail-grid'>
        <StatCard label='Type' value={contract.type} />
        <StatCard label='Accepted' value={contract.accepted ? 'Yes' : 'No'} />
        <StatCard label='Fulfilled' value={contract.fulfilled ? 'Yes' : 'No'} />
        <StatCard label='Expires' value={contract.expiration} />
        <StatCard label='Deadline' value={contract.terms.deadline} />
        <StatCard
          label='Payout'
          value={`${contract.terms.payment.onAccepted} + ${contract.terms.payment.onFulfilled}`}
        />
      </div>

      <div className='contract-section'>
        <PanelTitle as='h3'>Delivery Terms</PanelTitle>

        {contract.terms.deliver.length === 0 ? (
          <p>No delivery terms listed.</p>
        ) : (
          <ul className='contract-delivery-list'>
            {contract.terms.deliver.map((item) => (
              <li
                className='contract-delivery-item'
                key={`${item.tradeSymbol}-${item.destinationSymbol}`}
              >
                <strong>{item.tradeSymbol}</strong>
                <span>
                  {item.unitsFulfilled}/{item.unitsRequired}
                </span>
                <span>{item.destinationSymbol}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className='contract-section contract-actions'>
        <PanelTitle as='h3'>Actions</PanelTitle>

        {!contract.accepted && (
          <button
            className='contract-button contract-button-primary'
            onClick={handleAccept}
            disabled={isAccepting}
          >
            {isAccepting ? 'Accepting...' : 'Accept Contract'}
          </button>
        )}

        <div className='contract-negotiate-new'>
          {/* <label htmlFor='negotiate-ship'>Negotiate with ship:</label> */}
          <select
            id='negotiate-ship'
            className='contract-select'
            value={negotiateShip}
            onChange={(e) => setNegotiateShip(e.target.value)}
          >
            <option value=''>Select ship</option>
            {shipsData?.data.map((ship) => (
              <option key={ship.symbol} value={ship.symbol}>
                {ship.symbol}
              </option>
            ))}
          </select>

          <button
            onClick={handleNegotiate}
            disabled={!negotiateShip || isNegotiating}
            style={{ marginLeft: '0.75rem' }}
          >
            {isNegotiating ? 'Negotiating...' : 'Negotiate New Contract'}
          </button>
        </div>
      </div>
    </Panel>
  );
}
