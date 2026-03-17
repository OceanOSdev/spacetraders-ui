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
    isLoading: isContractLoading,
  } = useGetContractQuery(selectedContractId ?? '', {
    skip: !selectedContractId,
  });

  const {
    data: shipData,
    error: shipError,
    isLoading: isShipLoading,
  } = useGetShipQuery(shipSymbol ?? '', {
    skip: !shipSymbol,
  });

  const contract = contractData?.data;
  const ship = shipData?.data;

  const rows = useMemo(() => {
    if (!contract || !ship) return [];
    return buildContractDeliveryRows(contract, ship);
  }, [contract, ship]);

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [deliverCargo, deliverState] = useDeliverContractCargoMutation();

  function getQuantity(tradeSymbol: string, max: number) {
    const quantity = quantities[tradeSymbol];
    if (quantity == null) return Math.min(1, max);

    return Math.max(1, Math.min(max, quantity));
  }

  function setQuantity(tradeSymbol: string, quantity: number) {
    setQuantities((current) => ({
      ...current,
      [tradeSymbol]: quantity,
    }));
  }

  function clearQuantity(tradeSymbol: string) {
    setQuantities((current) => {
      const next = { ...current };
      delete next[tradeSymbol];
      return next;
    });
  }

  async function handleDeliver(tradeSymbol: string, maxUnits: number) {
    if (!contract || !ship) return;

    const units = getQuantity(tradeSymbol, maxUnits);

    await deliverCargo({
      contractId: contract.id,
      shipSymbol: ship.symbol,
      tradeSymbol,
      units,
    }).unwrap();

    clearQuantity(tradeSymbol);
  }

  let content: React.ReactNode;

  if (!selectedContractId) {
    content = (
      <EmptyState
        title='Cargo Delivery'
        message='Select a contract to deliver cargo.'
      />
    );
  } else if (isContractLoading || (shipSymbol && isShipLoading)) {
    content = (
      <LoadingState
        title='Cargo Delivery'
        message='Loading contract delivery data...'
      />
    );
  } else if (contractError || shipError) {
    content = (
      <ErrorState
        title='Cargo Delivery'
        message='Could not load contract delivery data.'
      />
    );
  } else if (!contract) {
    content = (
      <EmptyState title='Cargo Delivery' message='No contract details found.' />
    );
  } else if (!shipSymbol) {
    content = (
      <EmptyState
        title='Cargo Delivery'
        message='Select a ship to deliver cargo.'
      />
    );
  } else if (!ship) {
    content = (
      <EmptyState title='Cargo Delivery' message='No ship details found.' />
    );
  } else if (rows.length === 0) {
    content = (
      <EmptyState
        title='Cargo Delivery'
        message='No deliverables for this contract.'
      />
    );
  } else {
    content = (
      <Stack gap='md'>
        {rows.map((row) => {
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
                  <Row gap='sm' align='center'>
                    <input
                      type='number'
                      min={1}
                      max={row.maxDeliverableUnits}
                      value={quantity}
                      onChange={(event) =>
                        setQuantity(
                          row.tradeSymbol,
                          Number(event.target.value) || 1,
                        )
                      }
                    />

                    <button
                      type='button'
                      onClick={() =>
                        setQuantity(row.tradeSymbol, row.maxDeliverableUnits)
                      }
                    >
                      Max
                    </button>

                    <button
                      type='button'
                      disabled={deliverState.isLoading}
                      onClick={() =>
                        handleDeliver(row.tradeSymbol, row.maxDeliverableUnits)
                      }
                    >
                      Deliver
                    </button>
                  </Row>
                ) : (
                  <div>{row.disabledReason}</div>
                )}
              </Stack>
            </div>
          );
        })}

        {deliverState.isError && <div>Failed to deliver cargo.</div>}
      </Stack>
    );
  }

  return (
    <Panel>
      <PanelTitle>Deliver Cargo</PanelTitle>
      {content}
    </Panel>
  );
}
