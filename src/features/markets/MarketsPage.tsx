import { useGetShipsQuery } from '../ships/api/shipsApi';
import { useGetMarketQuery } from './api/marketsApi';
import { Stack } from '../../components/ui/Stack';
import { DashboardGrid } from '../../components/ui/DashboardGrid';
import { MarketLocationPanel } from './components/MarketLocationPanel';
import { MarketOverviewPanel } from './components/MarketOverviewPanel';
import { MarketShipsPanel } from './components/MarketShipsPanel';
import { MarketSellPanel } from './components/MarketSellPanel';
import { useMarketsPageState } from './hooks/useMarketsPageState';

export function MarketsPage() {
  const { data: shipsData, isLoading: isShipsLoading } = useGetShipsQuery();
  const ships = shipsData?.data ?? [];

  const {
    waypointOptions,
    selectedWaypointSymbol,
    setSelectedWaypointSymbol,
    selectedWaypoint,
    shipOptions,
    selectedShipSymbol,
    setSelectedShipSymbol,
    selectedShip,
  } = useMarketsPageState(ships);

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
