import { useState } from 'react';
import { Panel } from '../../../components/ui/Panel';
import { PanelTitle } from '../../../components/ui/PanelTitle';
import { Row } from '../../../components/ui/Row';
import { Stack } from '../../../components/ui/Stack';
import { useSellCargoMutation } from '../api/marketsApi';
import { type SellableCargoRow } from '../model/marketViewModels';
import type { Market } from '../../../types/markets';
import type { Ship } from '../../../types/ships/ships';
import { DockOrOrbitButton } from '../../ships/components/ship-actions/DockOrOrbitButton';
import { StatusText } from '../../../components/ui/StatusText';
import { useMarketSellViewModel } from '../hooks/useMarketSellViewModel';
import { EmptyState } from '../../../components/ui/EmptyState';

type MarketSellPanelProps = {
  ship?: Ship;
  market?: Market;
};

export function MarketSellPanel({ ship, market }: MarketSellPanelProps) {
  const viewModel = useMarketSellViewModel({ ship, market });

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [sellCargo, sellState] = useSellCargoMutation();

  function getQuantity(symbol: string, max: number) {
    const quantity = quantities[symbol];
    if (quantity == null) return Math.min(1, max);
    return Math.max(1, Math.min(max, quantity));
  }

  function setQuantity(symbol: string, quantity: number) {
    setQuantities((current) => ({
      ...current,
      [symbol]: quantity,
    }));
  }

  function clearQuantity(symbol: string) {
    setQuantities((current) => {
      const next = { ...current };
      delete next[symbol];
      return next;
    });
  }

  async function handleSell(row: SellableCargoRow) {
    if (viewModel.kind !== 'ready') return;

    const units = getQuantity(row.tradeSymbol, row.unitsInCargo);

    await sellCargo({
      shipSymbol: viewModel.ship.symbol,
      waypointSymbol: viewModel.ship.nav.waypointSymbol,
      symbol: row.tradeSymbol,
      units,
    }).unwrap();

    clearQuantity(row.tradeSymbol);
  }

  function renderContent() {
    switch (viewModel.kind) {
      case 'missing-ship':
      case 'empty':
        return (
          <EmptyState title={viewModel.title} message={viewModel.message} />
        );

      case 'docking-required':
        return (
          <Panel>
            <Stack gap='md'>
              <PanelTitle>{viewModel.title}</PanelTitle>
              <StatusText>{viewModel.message}</StatusText>
              <DockOrOrbitButton ship={viewModel.ship} />
            </Stack>
          </Panel>
        );

      case 'ready':
        return (
          <Panel>
            <Stack gap='md'>
              <PanelTitle>Sell Cargo</PanelTitle>
              {viewModel.rows.map((row) => (
                <MarketSellRowCard
                  key={row.tradeSymbol}
                  row={row}
                  quantity={getQuantity(row.tradeSymbol, row.unitsInCargo)}
                  isSelling={sellState.isLoading}
                  onQuantityChange={setQuantity}
                  onMax={() => setQuantity(row.tradeSymbol, row.unitsInCargo)}
                  onSell={() => handleSell(row)}
                />
              ))}

              {sellState.isError && (
                <StatusText>Failed to sell cargo.</StatusText>
              )}
            </Stack>
          </Panel>
        );
    }
  }

  return renderContent();
}

type MarketSellRowCardProps = {
  row: SellableCargoRow;
  quantity: number;
  isSelling: boolean;
  onQuantityChange: (symbol: string, quantity: number) => void;
  onMax: () => void;
  onSell: () => void;
};

function MarketSellRowCard({
  row,
  quantity,
  isSelling,
  onQuantityChange,
  onMax,
  onSell,
}: MarketSellRowCardProps) {
  const expected = row.sellPrice != null ? row.sellPrice * quantity : undefined;

  return (
    <div
      style={{
        padding: 12,
        border: '1px solid currentColor',
        borderRadius: 8,
      }}
    >
      <Stack gap='sm'>
        <Row justify='between'>
          <strong>{row.tradeSymbol}</strong>
          <span>{row.unitsInCargo} in cargo</span>
        </Row>

        <div>Sell price: {row.sellPrice != null ? row.sellPrice : '—'}</div>

        {row.isSellable ? (
          <>
            <Row gap='sm' align='center'>
              <input
                type='number'
                min={1}
                max={row.unitsInCargo}
                value={quantity}
                onChange={(event) =>
                  onQuantityChange(
                    row.tradeSymbol,
                    Number(event.target.value) || 1,
                  )
                }
                style={{ width: 80 }}
              />

              <button type='button' onClick={onMax}>
                Max
              </button>

              <button type='button' disabled={isSelling} onClick={onSell}>
                Sell
              </button>
            </Row>

            <div>Expected proceeds: {expected != null ? expected : '—'}</div>
          </>
        ) : (
          <div>{row.disabledReason ?? 'Cannot sell'}</div>
        )}
      </Stack>
    </div>
  );
}
