import { useState } from 'react';
import type { Ship } from '../../../types/ships';
import type { Waypoint } from '../../../types/waypoints';
import { useNavigateShipMutation } from '../shipsApi';
import { PanelTitle } from '../../../components/ui/PanelTitle';
import { Stack } from '../../../components/ui/Stack';
import { StatusText } from '../../../components/ui/StatusText';

type ShipNavigationPanelProps = {
  ship: Ship;
  targets: Waypoint[];
};

export function ShipNavigationPanel({
  ship,
  targets,
}: ShipNavigationPanelProps) {
  const [selectedTargetSymbol, setSelectedTargetSymbol] = useState('');
  const [navigateShip, { isLoading, error }] = useNavigateShipMutation();

  const selectedTarget =
    targets.find((target) => target.symbol === selectedTargetSymbol) ?? null;

  const isInTransit = ship.nav.status === 'IN_TRANSIT';
  const isAlreadyAtTarget =
    selectedTargetSymbol !== '' &&
    ship.nav.waypointSymbol === selectedTargetSymbol;

  async function handleNavigate() {
    if (!selectedTargetSymbol || isInTransit || isAlreadyAtTarget) {
      return;
    }

    try {
      await navigateShip({
        shipSymbol: ship.symbol,
        waypointSymbol: selectedTargetSymbol,
      }).unwrap();
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  }

  return (
    <div className='ship-navigation-section'>
      <PanelTitle as='h3'>Navigation</PanelTitle>

      <Stack gap='sm'>
        {targets.length === 0 ? (
          <StatusText>No destinations available.</StatusText>
        ) : (
          <>
            <label>
              Destination
              <select
                value={selectedTargetSymbol}
                onChange={(event) =>
                  setSelectedTargetSymbol(event.target.value)
                }
                disabled={isInTransit || isLoading}
                style={{ display: 'block', width: '100%', marginTop: '0.5rem' }}
              >
                <option value=''>Select a destination</option>
                {targets.map((target) => (
                  <option key={target.symbol} value={target.symbol}>
                    {target.symbol} ({target.type})
                  </option>
                ))}
              </select>
            </label>

            {isAlreadyAtTarget && (
              <StatusText>
                Ship is already at the selected destination.
              </StatusText>
            )}

            {isInTransit && (
              <StatusText>
                Ship is currently in transit and cannot navigate again yet.
              </StatusText>
            )}

            <div>
              <button
                onClick={handleNavigate}
                disabled={
                  !selectedTargetSymbol ||
                  isInTransit ||
                  isAlreadyAtTarget ||
                  isLoading
                }
              >
                {isLoading ? 'Navigating...' : 'Navigate'}
              </button>
            </div>
          </>
        )}

        {error && <StatusText>Could not navigate ship.</StatusText>}
      </Stack>
    </div>
  );
}
