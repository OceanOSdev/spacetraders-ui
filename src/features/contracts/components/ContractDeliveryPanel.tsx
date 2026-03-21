import { useState } from 'react';
import { Panel } from '../../../components/ui/Panel';
import { PanelTitle } from '../../../components/ui/PanelTitle';
import { Row } from '../../../components/ui/Row';
import { Stack } from '../../../components/ui/Stack';
import { useDeliverContractCargoMutation } from '../api/contractsApi';
import { EmptyState } from '../../../components/ui/EmptyState';
import { LoadingState } from '../../../components/ui/LoadingState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { StatusText } from '../../../components/ui/StatusText';
import { useContractDeliveryViewModel } from '../hooks/useContractDeliveryViewModel';
import type { ContractDeliveryRow } from '../model/contractDelivery';

export function ContractDeliveryPanel() {
  const viewModel = useContractDeliveryViewModel();
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

  async function handleDeliver(row: ContractDeliveryRow) {
    if (viewModel.kind !== 'ready') return;

    const units = getQuantity(row.tradeSymbol, row.maxDeliverableUnits);

    await deliverCargo({
      contractId: viewModel.contractId,
      shipSymbol: viewModel.shipSymbol,
      tradeSymbol: row.tradeSymbol,
      units,
    }).unwrap();

    clearQuantity(row.tradeSymbol);
  }

  function renderContent() {
    switch (viewModel.kind) {
      case 'empty':
        return (
          <EmptyState title={viewModel.title} message={viewModel.message} />
        );

      case 'loading':
        return (
          <LoadingState title={viewModel.title} message={viewModel.message} />
        );

      case 'error':
        return (
          <ErrorState title={viewModel.title} message={viewModel.message} />
        );

      case 'ready':
        return (
          <Stack gap='md'>
            {viewModel.rows.map((row) => (
              <ContractDeliveryRow
                key={row.tradeSymbol}
                row={row}
                quantity={getQuantity(row.tradeSymbol, row.maxDeliverableUnits)}
                isDelivering={deliverState.isLoading}
                onQuantityChange={setQuantity}
                onMax={() =>
                  setQuantity(row.tradeSymbol, row.maxDeliverableUnits)
                }
                onDeliver={() => handleDeliver(row)}
              />
            ))}

            {deliverState.isError && <div>Failed to deliver cargo.</div>}
          </Stack>
        );
    }
  }

  return (
    <Panel>
      <PanelTitle>Deliver Cargo</PanelTitle>
      {renderContent()}
    </Panel>
  );
}

type ContractDeliveryRowProps = {
  row: ContractDeliveryRow;
  quantity: number;
  isDelivering: boolean;
  onQuantityChange: (tradeSymbol: string, quantity: number) => void;
  onMax: () => void;
  onDeliver: () => void;
};

function ContractDeliveryRow({
  row,
  quantity,
  isDelivering,
  onQuantityChange,
  onMax,
  onDeliver,
}: ContractDeliveryRowProps) {
  return (
    <div className='contract-delivery-row'>
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
                onQuantityChange(
                  row.tradeSymbol,
                  Number(event.target.value) || 1,
                )
              }
            />

            <button type='button' onClick={onMax}>
              Max
            </button>

            <button type='button' disabled={isDelivering} onClick={onDeliver}>
              Deliver
            </button>
          </Row>
        ) : (
          <StatusText>{row.disabledReason}</StatusText>
        )}
      </Stack>
    </div>
  );
}
