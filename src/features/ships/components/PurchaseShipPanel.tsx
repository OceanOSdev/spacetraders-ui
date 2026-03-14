import { Panel } from '../../../components/ui/Panel';
import { PanelTitle } from '../../../components/ui/PanelTitle';
import { StatusText } from '../../../components/ui/StatusText';
import {
  useGetAgentQuery,
  useGetSystemWaypointsQuery,
} from '../../../services/spacetradersApi';
import { getSystemSymbolFromWaypointSymbol } from '../../../utils/spacetraders';
import { useGetShipsQuery, usePurchaseShipMutation } from '../api/shipsApi';

// For now just hard code a mining ship
// later on add ability to pick different
// ship types
const SHIP_TYPE = 'SHIP_MINING_DRONE';

function formatShipyardList(symbols: string[]): string {
  if (symbols.length === 0) {
    return '';
  }

  if (symbols.length === 1) {
    return symbols[0];
  }

  return symbols.join(', ');
}

export function PurchaseShipPanel() {
  const {
    data: agentData,
    isLoading: isLoadingAgent,
    error: agentError,
  } = useGetAgentQuery();

  const {
    data: shipsData,
    isLoading: isLoadingShips,
    error: shipsError,
  } = useGetShipsQuery();

  const headquarters = agentData?.data.headquarters;
  const systemSymbol = headquarters
    ? getSystemSymbolFromWaypointSymbol(headquarters)
    : undefined;

  const {
    data: waypointsData,
    isLoading: isLoadingWaypoints,
    error: waypointsError,
  } = useGetSystemWaypointsQuery(
    { systemSymbol: systemSymbol ?? '', traits: 'SHIPYARD' },
    { skip: !systemSymbol },
  );

  const [purchaseShip, { isLoading: isPurchasing, error: purchaseError }] =
    usePurchaseShipMutation();

  const shipyards =
    waypointsData?.data.filter((waypoint) =>
      waypoint.traits.some((trait) => trait.symbol === 'SHIPYARD'),
    ) ?? [];

  const shipyardSymbols = shipyards.map((waypoint) => waypoint.symbol);

  const eligibleShips =
    shipsData?.data.filter((ship) =>
      shipyardSymbols.includes(ship.nav.waypointSymbol),
    ) ?? [];

  const purchaseWaypointSymbol = eligibleShips[0]?.nav.waypointSymbol;
  const hasShipyards = shipyards.length > 0;

  async function handlePurchase() {
    if (!purchaseWaypointSymbol) {
      return;
    }

    try {
      await purchaseShip({
        shipType: SHIP_TYPE,
        waypointSymbol: purchaseWaypointSymbol,
      }).unwrap();
    } catch (error) {
      console.error('Purchase ship failed:', error);
    }
  }

  return (
    <Panel>
      <PanelTitle>Fleet Expansion</PanelTitle>

      {isLoadingAgent && (
        <StatusText>Loading headquarters information...</StatusText>
      )}

      {agentError && <StatusText>Could not load agent information.</StatusText>}

      {!isLoadingAgent && !agentError && !headquarters && (
        <StatusText>Could not determine headquarters waypoint.</StatusText>
      )}

      {headquarters && isLoadingWaypoints && (
        <StatusText>Scanning {systemSymbol} for shipyards...</StatusText>
      )}

      {headquarters && waypointsError && (
        <StatusText>Could not load waypoints for {systemSymbol}.</StatusText>
      )}

      {isLoadingShips && <StatusText>Loading fleet position...</StatusText>}

      {shipsError && <StatusText>Could not load fleet information</StatusText>}

      {headquarters &&
        !isLoadingWaypoints &&
        !waypointsError &&
        !hasShipyards && (
          <StatusText>No shipyards found in {systemSymbol}</StatusText>
        )}

      {hasShipyards && !purchaseWaypointSymbol && !isLoadingShips && (
        <>
          <StatusText>
            Shipyards detected in {systemSymbol}:{' '}
            {formatShipyardList(shipyardSymbols)}
          </StatusText>
          <div style={{ marginTop: '0.75rem' }}>
            <StatusText>
              Move one of yourr ships to a shipyard waypoint before purchasing a
              new ship.
            </StatusText>
          </div>
        </>
      )}

      {purchaseWaypointSymbol && (
        <>
          <StatusText>
            A ship is currently at shipyard {purchaseWaypointSymbol}
          </StatusText>

          <div style={{ marginTop: '1rem' }}>
            <button onClick={handlePurchase} disabled={isPurchasing}>
              {isPurchasing ? 'Purchasing...' : 'Purchase Mining Drone'}
            </button>
          </div>
        </>
      )}

      {purchaseError && (
        <div style={{ marginTop: '0.75rem' }}>
          <StatusText>Could not purchase ship.</StatusText>
        </div>
      )}
    </Panel>
  );
}
