import { useEffect, useMemo, useRef, useState } from 'react';
import { useLazyGetSystemWaypointsQuery } from '../../../services/spacetradersApi';
import type { Waypoint } from '../../../types/waypoints';
import type { MarketWaypointOption } from '../model/marketViewModels';

const PAGE_LIMIT = 20;

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
  const [trigger] = useLazyGetSystemWaypointsQuery();

  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(undefined);

  useEffect(() => {
    if (!systemSymbol) {
      return;
    }

    let isActive = true;

    async function loadAllMarketWaypoints() {
      setIsLoading(true);
      setError(undefined);

      try {
        const collected: Waypoint[] = [];
        let page = 1;

        while (true) {
          const response = await trigger(
            {
              systemSymbol: systemSymbol!,
              traits: 'MARKETPLACE',
              page,
              limit: PAGE_LIMIT,
            },
            true,
          ).unwrap();

          if (!isActive) return;

          const pageData = response.data ?? [];
          collected.push(...pageData);

          if (pageData.length < PAGE_LIMIT) {
            break;
          }

          page += 1;
        }

        if (isActive) {
          setWaypoints(collected);
        }
      } catch (error) {
        if (isActive) {
          setError(error);
          setWaypoints([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadAllMarketWaypoints();

    return () => {
      isActive = false;
    };
  }, [systemSymbol, trigger]);

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
