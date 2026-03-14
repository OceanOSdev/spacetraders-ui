import { useState } from 'react';
import { StatusText } from '../../../components/ui/StatusText';
import type { Ship } from '../../../types/ships';
import { useJettisonCargoMutation } from '../shipsApi';

type InventoryProps = {
  ship: Ship;
};

export function ShipInventory({ ship }: InventoryProps) {
  const [jettisonCargo, { isLoading, error }] = useJettisonCargoMutation();
  const [activeSymbol, setActiveSymbol] = useState<string | null>(null);

  async function handleJettison(symbol: string, units: number) {
    try {
      setActiveSymbol(symbol);

      await jettisonCargo({
        shipSymbol: ship.symbol,
        symbol,
        units,
      }).unwrap();
    } catch (error) {
      console.error('Jettison failed:', error);
    } finally {
      setActiveSymbol(null);
    }
  }

  if (ship.cargo.inventory.length === 0) {
    return <p>No cargo.</p>;
  }

  return (
    <>
      <ul className='inventory-list'>
        {ship.cargo.inventory.map((item) => {
          const isRowLoading = isLoading && activeSymbol === item.symbol;

          return (
            <li key={item.symbol} className='inventory-row'>
              <span>
                {item.symbol}: {item.units}
              </span>

              <div className='inventory-actions'>
                <button
                  type='button'
                  disabled={isRowLoading}
                  onClick={() => handleJettison(item.symbol, 1)}
                >
                  {isRowLoading ? 'Jettisoning...' : 'Jettison 1'}
                </button>

                <button
                  type='button'
                  disabled={isRowLoading}
                  onClick={() => handleJettison(item.symbol, item.units)}
                >
                  {isRowLoading ? 'Jettisoning...' : 'Jettison All'}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {error && <StatusText>Could not jettison cargo.</StatusText>}
    </>
  );
}
