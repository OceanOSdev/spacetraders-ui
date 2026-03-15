import { useEffect, useMemo, useState } from 'react';
import type { Ship } from '../../types/ships/ships';
import { useGetShipsQuery } from '../ships/api/shipsApi';
import {
  getDefaultSelectedShipSymbol,
  getShipsAtWaypoint,
  toMarketShipOptions,
} from './model/marketViewModels';
import { useGetMarketQuery } from './api/marketsApi';
import { Stack } from '../../components/ui/Stack';
import { DashboardGrid } from '../../components/ui/DashboardGrid';
import { MarketLocationPanel } from './components/MarketLocationPanel';
import { MarketOverviewPanel } from './components/MarketOverviewPanel';
import { MarketShipsPanel } from './components/MarketShipsPanel';
import { MarketSellPanel } from './components/MarketSellPanel';

type WaypointOption = {
  waypointSymbol: string;
  systemSymbol: string;
};

function deriveWaypointOptionsFromShips(ships: Ship[]) {
  const byWaypoint = new Map<string, WaypointOption>();

  for (const ship of ships) {
    byWaypoint.set(ship.nav.waypointSymbol, {
      waypointSymbol: ship.nav.waypointSymbol,
      systemSymbol: ship.nav.systemSymbol,
    });
  }

  return [...byWaypoint.values()].sort((a, b) =>
    a.waypointSymbol.localeCompare(b.waypointSymbol),
  );
}

export function MarketsPage() {
  const { data: shipsData, isLoading: isShipsLoading } = useGetShipsQuery();
  const ships = shipsData?.data ?? [];

  const waypointOptions = useMemo(
    () => deriveWaypointOptionsFromShips(ships),
    [ships],
  );

  const [selectedWaypointSymbol, setSelectedWaypointSymbol] =
    useState<string>();
  const [selectedShipSymbol, setSelectedShipSymbol] = useState<string>();

  const selectedWaypoint = useMemo(
    () =>
      waypointOptions.find(
        (option) => option.waypointSymbol === selectedWaypointSymbol,
      ),
    [waypointOptions, selectedWaypointSymbol],
  );

  const shipsAtSelectedWaypoint = useMemo(
    () =>
      selectedWaypointSymbol
        ? getShipsAtWaypoint(ships, selectedWaypointSymbol)
        : [],
    [ships, selectedWaypointSymbol],
  );

  const shipOptions = useMemo(
    () => toMarketShipOptions(shipsAtSelectedWaypoint),
    [shipsAtSelectedWaypoint],
  );

  const selectedShip = useMemo(
    () =>
      shipsAtSelectedWaypoint.find(
        (ship) => ship.symbol === selectedShipSymbol,
      ),
    [shipsAtSelectedWaypoint, selectedShipSymbol],
  );

  // Auto select first waypoint
  useEffect(() => {
    if (!selectedWaypointSymbol && waypointOptions.length > 0) {
      setSelectedWaypointSymbol(waypointOptions[0].waypointSymbol);
    }
  }, [selectedWaypointSymbol, waypointOptions]);

  // Auto select a valid ship when ship options change
  useEffect(() => {
    const selectedShipStillExists = shipOptions.some(
      (ship) => ship.shipSymbol === selectedShipSymbol,
    );

    if (selectedShipStillExists) return;

    setSelectedShipSymbol(getDefaultSelectedShipSymbol(shipOptions));
  }, [shipOptions, selectedShipSymbol]);

  const marketQuery = useGetMarketQuery(
    selectedWaypoint
      ? {
        systemSymbol: selectedWaypoint.systemSymbol,
        waypointSymbol: selectedWaypoint.waypointSymbol,
      }
      : (undefined as never),
    {
      skip: !selectedWaypoint,
    },
  );

  return (
    <Stack>
      <h1 className='page-title'>Markets</h1>
      <MarketLocationPanel
        waypointOptions={waypointOptions}
        selectedWaypointSymbol={selectedWaypointSymbol}
        onSelectWaypoint={(waypointSymbol) => {
          setSelectedWaypointSymbol(waypointSymbol);
          setSelectedShipSymbol(undefined);
        }}
      />

      <DashboardGrid>
        <MarketShipsPanel
          ships={shipOptions}
          selectedShipSymbol={selectedShipSymbol}
          onSelectShip={setSelectedShipSymbol}
        />

        <Stack>
          <MarketOverviewPanel
            market={marketQuery.data}
            isLoading={marketQuery.isLoading}
          />
          <MarketSellPanel ship={selectedShip} market={marketQuery.data} />
        </Stack>
      </DashboardGrid>

      {isShipsLoading && <div>Loading ships…</div>}
    </Stack>
  );
}
