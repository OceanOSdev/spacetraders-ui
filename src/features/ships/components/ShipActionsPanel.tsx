import { PanelTitle } from '../../../components/ui/PanelTitle';
import { Row } from '../../../components/ui/Row';
import { Stack } from '../../../components/ui/Stack';
import { StatusText } from '../../../components/ui/StatusText';
import type { Ship } from '../../../types/ships';
import {
  useDockShipMutation,
  useOrbitShipMutation,
  useRefuelShipMutation,
} from '../shipsApi';

type ShipActionsPanelProps = {
  ship: Ship;
};

type DockOrOrbitButtonProps = {
  ship: Ship;
};

function DockOrOrbitButton({ ship }: DockOrOrbitButtonProps) {
  const [orbitShip, { isLoading: isOrbiting, error: orbitError }] =
    useOrbitShipMutation();
  const [dockShip, { isLoading: isDocking, error: dockError }] =
    useDockShipMutation();

  const status = ship.nav.status;
  const isInTransit = status === 'IN_TRANSIT';
  const isDocked = status === 'DOCKED';
  const isInOrbit = status === 'IN_ORBIT';

  async function handleOrbit() {
    try {
      await orbitShip(ship.symbol).unwrap();
    } catch (error) {
      console.error('Orbit failed:', error);
    }
  }

  async function handleDock() {
    try {
      await dockShip(ship.symbol).unwrap();
    } catch (error) {
      console.error('Dock failed:', error);
    }
  }

  return (
    <>
      {isDocked && (
        <button onClick={handleOrbit} disabled={isOrbiting}>
          {isOrbiting ? 'Orbiting...' : 'Orbit Ship'}
        </button>
      )}

      {isInOrbit && (
        <button onClick={handleDock} disabled={isDocking}>
          {isDocking ? 'Docking...' : 'Dock Ship'}
        </button>
      )}

      {isInTransit && (
        <StatusText>
          Ship is in transit and cannot dock or orbit right now.
        </StatusText>
      )}

      {(orbitError || dockError) && (
        <div style={{ marginTop: '0.75rem' }}>
          <StatusText>Could not update ship status.</StatusText>
        </div>
      )}
    </>
  );
}

type ShipRefuelProps = {
  ship: Ship;
};

function ShipRefuel({ ship }: ShipRefuelProps) {
  const [refuelShip, { isLoading, error }] = useRefuelShipMutation();

  const isDocked = ship.nav.status === 'DOCKED';
  const isFuelFull = ship.fuel.current >= ship.fuel.capacity;

  const isDisabled = isLoading || !isDocked || isFuelFull;

  async function handleRefuel() {
    try {
      await refuelShip({ shipSymbol: ship.symbol }).unwrap();
    } catch (err) {
      console.error('Refuel failed:', err);
    }
  }

  return (
    <>
      {!isDocked && <StatusText>Ship must be docked to refuel.</StatusText>}

      {isDocked && isFuelFull && (
        <StatusText>Fuel tank is already full.</StatusText>
      )}

      {isDocked && !isFuelFull && (
        <button onClick={handleRefuel} disabled={isDisabled}>
          {isLoading ? 'Refueling...' : 'Refuel Ship'}
        </button>
      )}

      {error && (
        <div style={{ marginTop: '0.75rem' }}>
          <StatusText>Could not refuel ship.</StatusText>
        </div>
      )}
    </>
  );
}

export function ShipActionsPanel({ ship }: ShipActionsPanelProps) {
  return (
    <div className='ship-actions-section'>
      <PanelTitle as='h3'>Ship Actions</PanelTitle>

      <Stack gap='md' align='start'>
        <DockOrOrbitButton ship={ship} />
        <ShipRefuel ship={ship} />
      </Stack>
    </div>
  );
}
