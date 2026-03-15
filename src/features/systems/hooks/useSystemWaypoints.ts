import { useEffect, useState } from 'react';
import { useLazyGetSystemWaypointsQuery } from '../../../services/spacetradersApi';
import type { Waypoint } from '../../../types/waypoints';

const PAGE_LIMIT = 20;

type SystemWaypointsHookParams = {
  systemSymbol?: string;
  traits?: string;
  type?: string;
};

export function useSystemWaypoints({
  systemSymbol,
  traits,
  type,
}: SystemWaypointsHookParams) {
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
              traits,
              type,
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

  return {
    waypoints,
    isLoading,
    error,
  };
}
