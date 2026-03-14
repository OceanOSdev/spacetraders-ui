import { useEffect, useState } from 'react';
import { CountdownText } from '../../../../components/ui/CountdownText';
import { PanelTitle } from '../../../../components/ui/PanelTitle';
import { StatusText } from '../../../../components/ui/StatusText';
import type { Ship } from '../../../../types/ships';
import { useExtractResourcesMutation } from '../../api/shipsApi';

type ShipMiningProps = {
  ship: Ship;
};

export function ShipMining({ ship }: ShipMiningProps) {
  const [extractResources, { isLoading, error }] =
    useExtractResourcesMutation();

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const isInOrbit = ship.nav.status === 'IN_ORBIT';
  const isCargoFull = ship.cargo.units >= ship.cargo.capacity;

  const cooldownExpiration = ship.cooldown?.expiration
    ? new Date(ship.cooldown.expiration).getTime()
    : null;

  const isCoolingDown =
    cooldownExpiration !== null && !Number.isNaN(cooldownExpiration)
      ? cooldownExpiration > now
      : false;

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

      {isCoolingDown && ship.cooldown?.expiration && (
        <CountdownText isoDate={ship.cooldown.expiration} prefix='Cooldown:' />
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
