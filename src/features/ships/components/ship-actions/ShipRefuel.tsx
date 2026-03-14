import { StatusText } from '../../../../components/ui/StatusText';
import type { Ship } from '../../../../types/ships';
import { useRefuelShipMutation } from '../../shipsApi';

type ShipRefuelProps = {
  ship: Ship;
};

export function ShipRefuel({ ship }: ShipRefuelProps) {
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
