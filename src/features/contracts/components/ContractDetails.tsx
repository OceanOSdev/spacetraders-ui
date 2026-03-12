import { useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { useAcceptContractMutation, useGetContractQuery, useNegotiateContractMutation } from "../../../services/spacetradersApi";
import { EmptyState } from "../../../components/ui/EmptyState";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ErrorState } from "../../../components/ui/ErrorState";
import { Panel } from "../../../components/ui/Panel";
import { PanelTitle } from "../../../components/ui/PanelTitle";
import { StatusText } from "../../../components/ui/StatusText";
import { StatCard } from "../../../components/ui/StatCard";
import { ContractStatusPill } from "./ContractStatusPill";
import { CountdownText } from "../../../components/ui/CountdownText";
import { formatLocalDateTime } from "../../../utils/time";
import { PayoutBadge } from "./PayoutBadge";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { ShipSelector } from "../../ships/components/ShipSelector";
import { Stack } from "../../../components/ui/Stack";
import { useGetShipsQuery } from "../../ships/shipsApi";

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

      <div className='contract-inline-pill-row'>
        <ContractStatusPill
          accepted={contract.accepted}
          fulfilled={contract.fulfilled}
        />
        <CountdownText isoDate={contract.terms.deadline} prefix='Deadline:' />
      </div>

      <div className='detail-grid' style={{ marginTop: '1rem' }}>
        <StatCard label='Type' value={contract.type} />
        <StatCard
          label='Expires'
          value={formatLocalDateTime(contract.expiration)}
        />
        <StatCard label='Deliveries' value={contract.terms.deliver.length} />
      </div>

      <div className='payout-row'>
        <PayoutBadge
          label='Accept Payout'
          amount={contract.terms.payment.onAccepted}
        />
        <PayoutBadge
          label='Fulfill Payout'
          amount={contract.terms.payment.onFulfilled}
        />
      </div>

      <div className='contract-section'>
        <PanelTitle as='h3'>Delivery Terms</PanelTitle>

        {contract.terms.deliver.length === 0 ? (
          <p>No delivery terms listed.</p>
        ) : (
          <Stack style={{ marginTop: '0.85rem' }}>
            {contract.terms.deliver.map((item) => (
              <div
                className='contract-delivery-panel'
                key={`${item.tradeSymbol}-${item.destinationSymbol}`}
              >
                <div className='contract-delivery-header'>
                  <div className='contract-delivery-title'>{item.tradeSymbol}</div>
                  <div className='contract-delivery-destination'>
                    &rarr; {item.destinationSymbol}
                  </div>
                </div>

                <ProgressBar
                  label='Fulfillment'
                  value={item.unitsFulfilled}
                  max={item.unitsRequired}
                  color='amber'
                  size='md'
                />
              </div>
            ))}
          </Stack>
        )}
      </div>

      <div className='contract-section'>
        <PanelTitle as='h3'>Actions</PanelTitle>

        <div className='contract-actions'>
          {!contract.accepted && (
            <div className='contract-action-group'>
              <div className='contract-action-label'>Accept current contract</div>
              <button
                className='contract-button contract-button-primary'
                onClick={handleAccept}
                disabled={isAccepting}
              >
                {isAccepting ? 'Accepting...' : 'Accept Contract'}
              </button>
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
