import { Panel } from '../../../components/ui/Panel';
import { PanelTitle } from '../../../components/ui/PanelTitle';
import { Stack } from '../../../components/ui/Stack';
import type { MarketShipOption } from '../model/marketViewModels';

type MarketShipsPanelProps = {
  ships: MarketShipOption[];
  selectedShipSymbol?: string;
  onSelectShip: (shipSymbol: string) => void;
};

export function MarketShipsPanel({
  ships,
  selectedShipSymbol,
  onSelectShip,
}: MarketShipsPanelProps) {
  return (
    <Panel>
      <Stack gap='md'>
        <PanelTitle>Ships at Market</PanelTitle>

        {ships.length === 0 ? (
          <div>No ships at this waypoint.</div>
        ) : (
          <Stack gap='sm'>
            {ships.map((ship) => {
              const isSelected = ship.shipSymbol === selectedShipSymbol;

              return (
                <button
                  key={ship.shipSymbol}
                  type='button'
                  onClick={() => onSelectShip(ship.shipSymbol)}
                  style={{
                    textAlign: 'left',
                    padding: 12,
                    borderRadius: 8,
                    border: isSelected
                      ? '2px solid currentColor'
                      : '1px solid currentColor',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <strong>{ship.shipSymbol}</strong> · {ship.role}
                  </div>
                  <div>
                    Cargo: {ship.cargo.value}/{ship.cargo.max}
                  </div>
                  <div>{ship.isDocked ? 'Docked' : 'Not docked'}</div>
                  {!ship.canTrade && ship.disabledReason && (
                    <div>{ship.disabledReason}</div>
                  )}
                </button>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Panel>
  );
}
