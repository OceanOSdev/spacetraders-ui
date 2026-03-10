import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useGetShipsQuery } from "../../services/spacetradersApi";
import type { Ship } from "../../types/ships";
import { setSelectedShipSymbol } from "./shipsUiSlice";


export function ShipList() {
  const dispatch = useAppDispatch();
  const selectedShipSymbol = useAppSelector((state) => state.shipsUi.selectedShipSymbol);

  const { data, error, isLoading, isFetching } = useGetShipsQuery();

  if (isLoading) {
    return <p>Loading ships...</p>;
  }

  if (error) {
    return <p>Could not load ships.</p>;
  }

  if (!data || data.data.length === 0) {
    return <p>No ships found.</p>;
  }

  type ShipItemProps = {
    ship: Ship,
    isSelected: boolean
  }

  function ShipItem({ ship, isSelected }: ShipItemProps) {

    return (
      <li key={ship.symbol} style={{ marginBottom: '0.75rem' }}>
        <button
          onClick={() => dispatch(setSelectedShipSymbol(ship.symbol))}
          style={{
            width: '100%',
            textAlign: 'left',
            padding: '0.75rem',
            border: '1px solid #ccc',
            borderRadius: 8,
            background: isSelected ? '#f0f0f0' : 'white',
            cursor: 'pointer',
          }}
        >
          <div>
            <strong>{ship.symbol}</strong>
          </div>
          <div>Waypoint: {ship.nav.waypointSymbol}</div>
          <div>Fuel: {ship.fuel.current} / {ship.fuel.capacity}</div>
          <div>Cargo: {ship.cargo.units} / {ship.cargo.capacity}</div>
        </button>
      </li >
    );
  }
  return (
    <section>
      <h2>Ships</h2>
      {isFetching && <p>Refreshing ships...</p>}

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {data.data.map((ship) => {
          const isSelected = ship.symbol === selectedShipSymbol;
          return <ShipItem
            isSelected={isSelected}
            ship={ship}
          />;
        })}
      </ul>
    </section>
  );
}
