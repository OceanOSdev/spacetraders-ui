import { useGetShipsQuery } from '../ships/api/shipsApi';
import { useGetMarketQuery } from './api/marketsApi';
import { Stack } from '../../components/ui/Stack';
import { DashboardGrid } from '../../components/ui/DashboardGrid';
import { MarketLocationPanel } from './components/MarketLocationPanel';
import { MarketOverviewPanel } from './components/MarketOverviewPanel';
import { MarketShipsPanel } from './components/MarketShipsPanel';
import { MarketSellPanel } from './components/MarketSellPanel';
import { useMarketsPageState } from './hooks/useMarketsPageState';
import { MarketTradeGoodsPanel } from './components/MarketTradeGoodsPanel';
import { StatusText } from '../../components/ui/StatusText';
import { useSystemMarketWaypoints } from './hooks/useSystemMarketWaypoints';

export function MarketsPage() {
  const { data: shipsData, isLoading: isShipsLoading } = useGetShipsQuery();
  const ships = shipsData?.data ?? [];

  const currentSystemSymbol = ships[0]?.nav.systemSymbol;

  const {
    waypointOptions,
    isLoading: isWaypointsLoading,
    error: waypointsError,
  } = useSystemMarketWaypoints(currentSystemSymbol);

  const {
    selectedWaypointSymbol,
    setSelectedWaypointSymbol,
    selectedWaypoint,
    shipOptions,
    selectedShipSymbol,
    setSelectedShipSymbol,
    selectedShip,
  } = useMarketsPageState(ships, waypointOptions);

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
        onSelectWaypoint={setSelectedWaypointSymbol}
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
          <MarketTradeGoodsPanel
            market={marketQuery.data}
            isLoading={marketQuery.isLoading}
          />
          <MarketSellPanel ship={selectedShip} market={marketQuery.data} />
        </Stack>
      </DashboardGrid>

      {isShipsLoading && <StatusText>Loading ships...</StatusText>}
      {isWaypointsLoading && <StatusText>Loading waypoints...</StatusText>}
      {waypointsError != null && (
        <StatusText>Failed to load waypoints</StatusText>
      )}
    </Stack>
  );
}
