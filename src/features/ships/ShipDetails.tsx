import { useAppSelector } from "../../app/hooks";
import { useGetShipQuery } from "../../services/spacetradersApi";
import type { ShipCargoItem } from "../../types/ships";

type InventoryProps = {
  inventory: ShipCargoItem[]
}

function ShipInventory({ inventory }: InventoryProps) {
  if (inventory.length === 0) {
    return <p>No cargo.</p>;
  }

  return (
    <ul>
      {inventory.map((item) => (
        <li key={item.symbol}>
          {item.symbol}: {item.units}
        </li>
      ))}
    </ul>
  );
}

export function ShipDetails() {
  const selectedShipSymbol = useAppSelector((state) => state.shipsUi.selectedShipSymbol);

  // If no ship is selected, skip the query entirely.
  const { data, error, isLoading, isFetching } = useGetShipQuery(selectedShipSymbol ?? '', {
    skip: !selectedShipSymbol
  });

  if (!selectedShipSymbol) {
    return <p>Select a ship to see details.</p>;
  }

  if (isLoading) {
    return <p>Loading ship details...</p>;
  }

  if (error) {
    return <p>Could not load ship details.</p>;
  }

  if (!data) {
    return <p>No ship details found.</p>;
  }

  const ship = data.data;

  return (
    <section>
      <h2>Ship Details</h2>
      {isFetching && <p>Refreshing ship...</p>}

      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: '1rem',
        }}
      >
        <p><strong>Symbol:</strong> {ship.symbol}</p>
        <p><strong>System:</strong> {ship.nav.systemSymbol}</p>
        <p><strong>Waypoint:</strong> {ship.nav.waypointSymbol}</p>
        <p><strong>Status:</strong> {ship.nav.status}</p>
        <p><strong>Flight Mode:</strong> {ship.nav.flightMode}</p>
        <p><strong>Fuel:</strong> {ship.fuel.current} / {ship.fuel.capacity}</p>
        <p><strong>Cargo:</strong>{ship.cargo.units} / {ship.cargo.capacity}</p>

        <h3>Inventory</h3>
        <ShipInventory inventory={ship.cargo.inventory} />
      </div>
    </section>
  );
}
