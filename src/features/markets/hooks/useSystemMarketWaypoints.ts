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

  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!systemSymbol) {
      setWaypoints([]);
      setIsLoading(false);
      setError(undefined);
      return;
    }

    const requestId = ++requestIdRef.current;
    let isActive = true;

    async function loadAllMarketWaypoints() {
      setWaypoints([]);
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

          if (!isActive || requestIdRef.current !== requestId) {
            return;
          }

          const pageData = response.data ?? [];
          collected.push(...pageData);

          if (pageData.length < PAGE_LIMIT) {
            break;
          }

          page += 1;
        }

        if (!isActive || requestIdRef.current !== requestId) {
          return;
        }

        setWaypoints(collected);
      } catch (error) {
        if (!isActive || requestIdRef.current !== requestId) {
          return;
        }

        setError(error);
        setWaypoints([]);
      } finally {
        if (!isActive || requestIdRef.current !== requestId) {
          return;
        }

        setIsLoading(false);
      }
    }

    void loadAllMarketWaypoints();

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
