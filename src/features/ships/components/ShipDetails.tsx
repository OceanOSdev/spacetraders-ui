import { useAppSelector } from '../../../app/hooks';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { LoadingState } from '../../../components/ui/LoadingState';
import { Panel } from '../../../components/ui/Panel';
import { PanelTitle } from '../../../components/ui/PanelTitle';
import { Row } from '../../../components/ui/Row';
import { StatCard } from '../../../components/ui/StatCard';
import { StatusText } from '../../../components/ui/StatusText';
import { useSystemWaypoints } from '../../systems/hooks/useSystemWaypoints';
import { useGetShipQuery } from '../api/shipsApi';
import { ShipActionsPanel } from './ship-actions/ShipActionsPanel';
import { ShipNavigationPanel } from './ship-navigation/ShipNavigationPanel';
import { ShipInventory } from './ShipInventory';
import { ShipStatusPill } from './ShipStatusPill';
import { ShipTelemetrySection } from './ShipTelemetrySection';

export function ShipDetails() {
  const selectedShipSymbol = useAppSelector(
    (state) => state.shipsUi.selectedShipSymbol,
  );

  // If no ship is selected, skip the query entirely.
  const { data, error, isLoading, isFetching, refetch } = useGetShipQuery(
    selectedShipSymbol ?? '',
    {
      skip: !selectedShipSymbol,
    },
  );

  const systemSymbol = data?.data.nav.systemSymbol;

  const {
    waypoints,
    isLoading: isLoadingWaypoints,
    error: waypointsError,
  } = useSystemWaypoints({ systemSymbol });

  const navigationTargets = waypoints ?? [];
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

  const ship = data.data;
  return (
    <Panel>
      <PanelTitle>Ship Details</PanelTitle>
      {isFetching && <StatusText>Refreshing ship...</StatusText>}

      <div className='detail-grid'>
        <StatCard label='Symbol' value={ship.symbol} />
        <StatCard label='System' value={ship.nav.systemSymbol} />
        <StatCard label='Waypoint' value={ship.nav.waypointSymbol} />
      </div>

      <div className='detail-status-row'>
        <PanelTitle as='h3'>Operation Status</PanelTitle>

        <Row gap='md'>
          <ShipStatusPill status={ship.nav.status} />
          <ShipStatusPill status={ship.nav.flightMode} />
        </Row>
      </div>

      <ShipTelemetrySection ship={ship} />

      <ShipNavigationPanel
        ship={ship}
        refetchShip={refetch}
        targets={navigationTargets}
        isLoading={isLoadingWaypoints}
        error={waypointsError}
      />

      <ShipActionsPanel ship={ship} />

      <div className='ship-inventory-section'>
        <PanelTitle as='h3'>Inventory</PanelTitle>
        <ShipInventory ship={ship} />
      </div>
    </Panel>
  );
}
