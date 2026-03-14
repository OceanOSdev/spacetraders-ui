import { useEffect, useRef, useState } from 'react';
import type { Ship } from '../../../../types/ships';
import type { Waypoint } from '../../../../types/waypoints';
import { useNavigateShipMutation } from '../../shipsApi';
import { PanelTitle } from '../../../../components/ui/PanelTitle';
import { Stack } from '../../../../components/ui/Stack';
import { StatusText } from '../../../../components/ui/StatusText';
import { WaypointSelector } from './WaypointSelector';
import { CountdownText } from '../../../../components/ui/CountdownText';

type ShipNavigationPanelProps = {
  ship: Ship;
  refetchShip: () => void;
  targets: Waypoint[];
};

export function ShipNavigationPanel({
  ship,
  targets,
  refetchShip,
}: ShipNavigationPanelProps) {
  const [selectedTargetSymbol, setSelectedTargetSymbol] = useState('');
  const [navigateShip, { isLoading, error }] = useNavigateShipMutation();
  const [now, setNow] = useState(() => Date.now());
  const hasRefetchedArrival = useRef(false);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);
  const arrivalTimestamp = ship.nav.route?.arrival
    ? new Date(ship.nav.route.arrival).getTime()
    : null;

  useEffect(() => {
    if (
      ship.nav.status !== 'IN_TRANSIT' ||
      !arrivalTimestamp ||
      Number.isNaN(arrivalTimestamp)
    ) {
      hasRefetchedArrival.current = false;
      return;
    }

    if (arrivalTimestamp > now) {
      hasRefetchedArrival.current = false;
      return;
    }

    if (!hasRefetchedArrival.current) {
      hasRefetchedArrival.current = true;
      refetchShip();
    }
  }, [arrivalTimestamp, now, refetchShip, ship.nav.status]);

  const isInTransit = ship.nav.status === 'IN_TRANSIT';
  const isAlreadyAtTarget =
    !isInTransit &&
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
              <div style={{ marginBottom: '0.5rem' }}>Destination</div>
              <WaypointSelector
                value={selectedTargetSymbol}
                onChange={setSelectedTargetSymbol}
                disabled={isInTransit || isLoading}
                targets={targets}
              />
            </label>

            {isAlreadyAtTarget && (
              <StatusText>
                Ship is already at the selected destination.
              </StatusText>
            )}

            {isInTransit && ship.nav.route?.arrival && (
              <>
                <StatusText>
                  Ship is currently in transit and cannot navigate again yet.
                </StatusText>
                <CountdownText
                  isoDate={ship.nav.route.arrival}
                  prefix='Arrival:'
                />
              </>
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
