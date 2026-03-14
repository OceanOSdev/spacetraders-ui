import { useAppSelector } from '../../../app/hooks';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { LoadingState } from '../../../components/ui/LoadingState';
import { Panel } from '../../../components/ui/Panel';
import { PanelTitle } from '../../../components/ui/PanelTitle';
import { Row } from '../../../components/ui/Row';
import { StatCard } from '../../../components/ui/StatCard';
import { StatusText } from '../../../components/ui/StatusText';
import { useGetSystemWaypointsQuery } from '../../../services/spacetradersApi';
import type { ShipCargoItem } from '../../../types/ships';
import { useGetShipQuery } from '../shipsApi';
import { ShipActionsPanel } from './ship-actions/ShipActionsPanel';
import { ShipNavigationPanel } from './ShipNavigationPanel';
import { ShipStatusPill } from './ShipStatusPill';
import { ShipTelemetrySection } from './ShipTelemetrySection';

type InventoryProps = {
  inventory: ShipCargoItem[];
};

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
  const selectedShipSymbol = useAppSelector(
    (state) => state.shipsUi.selectedShipSymbol,
  );

  // If no ship is selected, skip the query entirely.
  const { data, error, isLoading, isFetching } = useGetShipQuery(
    selectedShipSymbol ?? '',
    {
      skip: !selectedShipSymbol,
    },
  );
  const ship = data?.data;
  const systemSymbol = ship?.nav.systemSymbol;

  const { data: waypointsData } = useGetSystemWaypointsQuery(
    {
      systemSymbol: systemSymbol ?? '',
    },
    {
      skip: !systemSymbol,
    },
  );

  const navigationTargets = waypointsData?.data ?? [];
  if (!selectedShipSymbol) {
    return (
      <EmptyState
        title='Ship Details'
        message='Select a ship to see details.'
      />
    );
  }

  if (isLoading) {
    return (
      <LoadingState title='Ship Details' message='Loading ship telemetry...' />
    );
  }

  if (error) {
    return (
      <ErrorState title='Ship Details' message='Could not load ship details.' />
    );
  }

  if (!data) {
    return <EmptyState title='Ship Details' message='No ship details found.' />;
  }

  return (
    <Panel>
      <PanelTitle>Ship Details</PanelTitle>
      {isFetching && <StatusText>Refreshing ship...</StatusText>}

      <div className='detail-grid'>
        <StatCard label='Symbol' value={ship!.symbol} />
        <StatCard label='System' value={ship!.nav.systemSymbol} />
        <StatCard label='Waypoint' value={ship!.nav.waypointSymbol} />
      </div>

      <div className='detail-status-row'>
        <PanelTitle as='h3'>Operation Status</PanelTitle>

        <Row gap='md'>
          <ShipStatusPill status={ship!.nav.status} />
          <ShipStatusPill status={ship!.nav.flightMode} />
        </Row>
      </div>

      <ShipTelemetrySection ship={ship!} />

      <ShipNavigationPanel ship={ship!} targets={navigationTargets} />

      <ShipActionsPanel ship={ship!} />

      <div className='ship-inventory-section'>
        <PanelTitle as='h3'>Inventory</PanelTitle>
        <ShipInventory inventory={ship!.cargo.inventory} />
      </div>
    </Panel>
  );
}
