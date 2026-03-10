import { useAppSelector } from "../../app/hooks";
import { EmptyState } from "../../components/ui/EmptyState";
import { ErrorState } from "../../components/ui/ErrorState";
import { LoadingState } from "../../components/ui/LoadingState";
import { Panel } from "../../components/ui/Panel";
import { PanelTitle } from "../../components/ui/PanelTitle";
import { StatCard } from "../../components/ui/StatCard";
import { StatusText } from "../../components/ui/StatusText";
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
    <ul className='inventory-list'>
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
    return <EmptyState title='Ship Details' message='Select a ship to see details.' />;
  }

  if (isLoading) {
    return <LoadingState title='Ship Details' message='Loading ship telemetry...' />;
  }

  if (error) {
    return <ErrorState title='Ship Details' message='Could not load ship details.' />;
  }

  if (!data) {
    return <EmptyState title='Ship Details' message='No ship details found.' />;
  }

  const ship = data.data;

  return (
    <Panel>
      <PanelTitle>Ship Details</PanelTitle>
      {isFetching && <StatusText>Refreshing ship...</StatusText>}

      <div className='detail-grid'>
        <StatCard label='Symbol' value={ship.symbol} />
        <StatCard label='System' value={ship.nav.systemSymbol} />
        <StatCard label='Waypoint' value={ship.nav.waypointSymbol} />
        <StatCard label='Status' value={ship.nav.status} />
        <StatCard label='Flight Mode' value={ship.nav.flightMode} />
        <StatCard label='Fuel' value={`${ship.fuel.current} / ${ship.fuel.capacity}`} />
        <StatCard label='Cargo' value={`${ship.cargo.units} / ${ship.cargo.capacity}`} />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <PanelTitle as='h3'>Inventory</PanelTitle>
        <ShipInventory inventory={ship.cargo.inventory} />
      </div>
    </Panel>
  );
}
