import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { EmptyState } from '../../../components/ui/EmptyState';
import { ErrorState } from '../../../components/ui/ErrorState';
import { LoadingState } from '../../../components/ui/LoadingState';
import { Panel } from '../../../components/ui/Panel';
import { PanelTitle } from '../../../components/ui/PanelTitle';
import { StatusText } from '../../../components/ui/StatusText';
import { TelemetryBar } from '../../../components/ui/TelemetryBar';
import type { Ship } from '../../../types/ships/ships';
import { ShipStatusPill } from './ShipStatusPill';
import { setSelectedShipSymbol } from '../store/shipsUiSlice';
import { cn } from '../../../utils/cn';
import { useGetShipsQuery } from '../api/shipsApi';

export function ShipList() {
  const dispatch = useAppDispatch();
  const selectedShipSymbol = useAppSelector(
    (state) => state.shipsUi.selectedShipSymbol,
  );
  const { data, error, isLoading, isFetching } = useGetShipsQuery();

  if (isLoading) {
    return (
      <LoadingState title='Fleet Registry' message='Loading ship registry...' />
    );
  }

  if (error) {
    return (
      <ErrorState title='Fleet Registry' message='Could not load ships.' />
    );
  }

  if (!data || data.data.length === 0) {
    return <EmptyState title='Fleet Registry' message='No ships found.' />;
  }

  type ShipItemProps = {
    ship: Ship;
    isSelected: boolean;
  };

  function ShipItem({ ship, isSelected }: ShipItemProps) {
    return (
      <li className='ship-list-item'>
        <button
          onClick={() => dispatch(setSelectedShipSymbol(ship.symbol))}
          className={cn('ship-button', isSelected && 'selected')}
        >
          <div className='ship-symbol'>{ship.symbol}</div>
          <div className='ship-meta'>Waypoint: {ship.nav.waypointSymbol}</div>

          <div className='ship-status-row'>
            <ShipStatusPill status={ship.nav.status} />
          </div>

          <TelemetryBar
            label='Fuel'
            value={ship.fuel.current}
            max={ship.fuel.capacity}
            warningThresholdPercent={35}
            dangergThresholdPercent={15}
          />
          <TelemetryBar
            label='Cargo'
            value={ship.cargo.units}
            max={ship.cargo.capacity}
            color='green'
            warningThresholdPercent={75}
            dangergThresholdPercent={95}
            invertThresholds
          />
        </button>
      </li>
    );
  }
  return (
    <Panel>
      <PanelTitle>Ships</PanelTitle>
      {isFetching && <StatusText>Refreshing ships...</StatusText>}

      <ul className='ship-list'>
        {data.data.map((ship) => {
          const isSelected = ship.symbol === selectedShipSymbol;
          return (
            <ShipItem key={ship.symbol} isSelected={isSelected} ship={ship} />
          );
        })}
      </ul>
    </Panel>
  );
}
