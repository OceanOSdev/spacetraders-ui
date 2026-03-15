import { useMemo } from 'react';
import type { Waypoint } from '../../../types/waypoints';
import type { MarketWaypointOption } from '../model/marketViewModels';
import { useSystemWaypoints } from '../../systems/hooks/useSystemWaypoints';

function toMarketWaypointOptions(
  waypoints: Waypoint[],
): MarketWaypointOption[] {
  return waypoints
    .map((waypoint) => ({
      waypointSymbol: waypoint.symbol,
      systemSymbol: waypoint.systemSymbol,
    }))
    .sort((a, b) => a.waypointSymbol.localeCompare(b.waypointSymbol));
}

export function useSystemMarketWaypoints(systemSymbol?: string) {
  const { waypoints, isLoading, error } = useSystemWaypoints({
    systemSymbol,
    traits: 'MARKETPLACE',
  });

  const waypointOptions = useMemo(
    () => toMarketWaypointOptions(waypoints),
    [waypoints],
  );

  return {
    waypointOptions,
    isLoading,
    error,
  };
}
