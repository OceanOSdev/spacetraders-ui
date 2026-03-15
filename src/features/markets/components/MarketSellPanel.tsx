import { useMemo, useState } from 'react';
import { Panel } from '../../../components/ui/Panel';
import { PanelTitle } from '../../../components/ui/PanelTitle';
import { Row } from '../../../components/ui/Row';
import { Stack } from '../../../components/ui/Stack';
import { useSellCargoMutation } from '../api/marketsApi';
import { buildSellableCargoRows } from '../model/marketViewModels';
import type { Market } from '../../../types/markets';
import type { Ship } from '../../../types/ships/ships';

type MarketSellPanelProps = {
  ship?: Ship;
  market?: Market;
};

export function MarketSellPanel({ ship, market }: MarketSellPanelProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [sellCargo, sellState] = useSellCargoMutation();

  const rows = useMemo(
    () => buildSellableCargoRows(ship, market),
    [ship, market],
  );

  function getQuantity(symbol: string, max: number) {
    const quantity = quantities[symbol];
    if (quantity == null) return Math.min(1, max);
    return Math.max(1, Math.min(max, quantity));
  }

  async function handleSell(symbol: string, maxUnits: number) {
    if (!ship) return;

    const units = getQuantity(symbol, maxUnits);

    await sellCargo({
      shipSymbol: ship.symbol,
      waypointSymbol: ship.nav.waypointSymbol,
      symbol,
      units,
    }).unwrap();

    setQuantities((current) => {
      const next = { ...current };
      delete next[symbol];
      return next;
    });
  }

  return (
    <Panel>
      <Stack gap='md'>
        <PanelTitle>Sell Cargo</PanelTitle>

        {!ship ? (
          <div>Select a ship to trade.</div>
        ) : rows.length === 0 ? (
          <div>This ship has no cargo.</div>
        ) : (
          <Stack gap='sm'>
            {rows.map((row) => {
              const quantity = getQuantity(row.tradeSymbol, row.unitsInCargo);
              const expected =
                row.sellPrice != null ? row.sellPrice * quantity : undefined;

              return (
                <div
                  key={row.tradeSymbol}
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

                    <div>
                      Sell price: {row.sellPrice != null ? row.sellPrice : '—'}
                    </div>

                    {row.isSellable ? (
                      <>
                        <Row gap='sm' align='center'>
                          <input
                            type='number'
                            min={1}
                            max={row.unitsInCargo}
                            value={quantity}
                            onChange={(event) =>
                              setQuantities((current) => ({
                                ...current,
                                [row.tradeSymbol]:
                                  Number(event.target.value) || 1,
                              }))
                            }
                            style={{ width: 80 }}
                          />

                          <button
                            type='button'
                            onClick={() =>
                              setQuantities((current) => ({
                                ...current,
                                [row.tradeSymbol]: row.unitsInCargo,
                              }))
                            }
                          >
                            Max
                          </button>

                          <button
                            type='button'
                            disabled={sellState.isLoading}
                            onClick={() =>
                              void handleSell(row.tradeSymbol, row.unitsInCargo)
                            }
                          >
                            Sell
                          </button>
                        </Row>

                        <div>
                          Expected proceeds: {expected != null ? expected : '—'}
                        </div>
                      </>
                    ) : (
                      <div>{row.disabledReason ?? 'Cannot sell'}</div>
                    )}
                  </Stack>
                </div>
              );
            })}
          </Stack>
        )}

        {sellState.isError && <div>Failed to sell cargo.</div>}
      </Stack>
    </Panel>
  );
}
