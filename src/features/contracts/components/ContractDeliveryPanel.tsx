import { useMemo, useState } from 'react';
import { Panel } from '../../../components/ui/Panel';
import { PanelTitle } from '../../../components/ui/PanelTitle';
import { Row } from '../../../components/ui/Row';
import { Stack } from '../../../components/ui/Stack';
import {
  useDeliverContractCargoMutation,
  useGetContractQuery,
} from '../api/contractsApi';
import { buildContractDeliveryRows } from '../model/contractDelivery';
import { useAppSelector } from '../../../app/hooks';
import { EmptyState } from '../../../components/ui/EmptyState';
import { LoadingState } from '../../../components/ui/LoadingState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { useGetShipQuery } from '../../ships/api/shipsApi';

type ContractDeliveryPanelProps = {
  shipSymbol?: string;
};

export function ContractDeliveryPanel({
  shipSymbol,
}: ContractDeliveryPanelProps) {
  const selectedContractId = useAppSelector(
    (s) => s.contractsUi.selectedContractId,
  );

  const {
    data: contractData,
    error: contractError,
    isLoading: contractLoading,
  } = useGetContractQuery(selectedContractId ?? '', {
    skip: !selectedContractId,
  });

  const {
    data: shipData,
    error: shipError,
    isLoading: shipLoading,
  } = useGetShipQuery(shipSymbol ?? '', { skip: !shipSymbol });

  const contract = contractData?.data;
  const ship = shipData?.data;

  const rows = useMemo(() => {
    if (!contract || !ship) return [];
    return buildContractDeliveryRows(contract!, ship);
  }, [contract, ship]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [deliverCargo, deliverState] = useDeliverContractCargoMutation();

  if (!selectedContractId) {
    return (
      <EmptyState
        title='Contract Details'
        message='Select a contract to see details.'
      />
    );
  }

  if (contractLoading || shipLoading) {
    return (
      <LoadingState
        title='Cargo Delivery'
        message='Loading contract terms...'
      />
    );
  }

  if (contractError || shipError) {
    return (
      <ErrorState
        title='Cargo Delivery'
        message='Could not load contract details.'
      />
    );
  }

  if (!contractData) {
    return (
      <EmptyState title='Cargo Delivery' message='No contract details found.' />
    );
  }

  function getQuantity(tradeSymbol: string, max: number) {
    const quantity = quantities[tradeSymbol];
    if (quantity == null) return Math.min(1, max);
    return Math.max(1, Math.min(max, quantity));
  }

  async function handleDeliver(tradeSymbol: string, maxUnits: number) {
    if (!ship) return;

    const units = getQuantity(tradeSymbol, maxUnits);

    await deliverCargo({
      contractId: contract!.id,
      shipSymbol: ship.symbol,
      tradeSymbol,
      units,
    }).unwrap();

    setQuantities((current) => {
      const next = { ...current };
      delete next[tradeSymbol];
      return next;
    });
  }

  return (
    <Panel>
      <PanelTitle>Deliver Cargo</PanelTitle>

      <Stack gap='md'>
        {!ship ? (
          <div>Select a ship to deliver cargo.</div>
        ) : rows.length === 0 ? (
          <div>No deliverables for this contract.</div>
        ) : (
          rows.map((row) => {
            const quantity = getQuantity(
              row.tradeSymbol,
              row.maxDeliverableUnits,
            );

            return (
              <div key={row.tradeSymbol} className='contract-delivery-row'>
                <Stack gap='sm'>
                  <Row justify='between' align='center'>
                    <strong>{row.tradeSymbol}</strong>
                    <span>
                      {row.unitsFulfilled}/{row.unitsRequired}
                    </span>
                  </Row>

                  <div>On ship: {row.unitsOnShip}</div>
                  <div>Remaining: {row.unitsRemaining}</div>

                  {row.canDeliver ? (
                    <>
                      <Row gap='sm' align='center'>
                        <input
                          type='number'
                          min={1}
                          max={row.maxDeliverableUnits}
                          value={quantity}
                          onChange={(event) =>
                            setQuantities((current) => ({
                              ...current,
                              [row.tradeSymbol]:
                                Number(event.target.value) || 1,
                            }))
                          }
                        />

                        <button
                          type='button'
                          onClick={() =>
                            setQuantities((current) => ({
                              ...current,
                              [row.tradeSymbol]: row.maxDeliverableUnits,
                            }))
                          }
                        >
                          Max
                        </button>

                        <button
                          type='button'
                          disabled={deliverState.isLoading}
                          onClick={() =>
                            void handleDeliver(
                              row.tradeSymbol,
                              row.maxDeliverableUnits,
                            )
                          }
                        >
                          Deliver
                        </button>
                      </Row>
                    </>
                  ) : (
                    <div>{row.disabledReason}</div>
                  )}
                </Stack>
              </div>
            );
          })
        )}

        {deliverState.isError && <div>Failed to deliver cargo.</div>}
      </Stack>
    </Panel>
  );
}
