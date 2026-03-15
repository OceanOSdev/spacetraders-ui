import { StatusText } from '../../../../components/ui/StatusText';
import type { Ship } from '../../../../types/ships/ships';
import { useOrbitShipMutation, useDockShipMutation } from '../../api/shipsApi';

type DockOrOrbitButtonProps = {
  ship: Ship;
};

export function DockOrOrbitButton({ ship }: DockOrOrbitButtonProps) {
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
