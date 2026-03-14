import { PanelTitle } from '../../../../components/ui/PanelTitle';
import { StatusText } from '../../../../components/ui/StatusText';
import type { Ship } from '../../../../types/ships';
import { useExtractResourcesMutation } from '../../shipsApi';

type ShipMiningProps = {
  ship: Ship;
};

export function ShipMining({ ship }: ShipMiningProps) {
  const [extractResources, { isLoading, error }] =
    useExtractResourcesMutation();

  const isInOrbit = ship.nav.status === 'IN_ORBIT';
  const isCargoFull = ship.cargo.units >= ship.cargo.capacity;
  const cooldownRemaining = ship.cooldown?.remainingSeconds ?? 0;
  const isCoolingDown = cooldownRemaining > 0;

  const canExtract = isInOrbit && !isCargoFull && !isCoolingDown;

  async function handleExtract() {
    try {
      await extractResources(ship.symbol).unwrap();
    } catch (error) {
      console.error('Extraction failed:', error);
    }
  }
  return (
    <div className='ship-mining-section'>
      <PanelTitle as='h3'>Mining</PanelTitle>

      {!isInOrbit && (
        <StatusText>Ship must be in orbit to extract resources.</StatusText>
      )}

      {isCargoFull && <StatusText>Cargo hold is full.</StatusText>}

      {isCoolingDown && (
        <StatusText>Extraction cooldown: {cooldownRemaining}s</StatusText>
      )}

      {canExtract && (
        <button onClick={handleExtract} disabled={isLoading}>
          {isLoading ? 'Extracting...' : 'Extract Resources'}
        </button>
      )}

      {error && <StatusText>Could not extract resources.</StatusText>}
    </div>
  );
}
