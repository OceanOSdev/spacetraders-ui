import { useMemo, useState } from 'react';
import type { Ship } from '../../../types/ships/ships';
import {
  getShipsAtWaypoint,
  toMarketShipOptions,
} from '../model/marketViewModels';

export type WaypointOption = {
  waypointSymbol: string;
  systemSymbol: string;
};

export function useMarketsPageState(
  ships: Ship[],
  waypointOptions: WaypointOption[],
) {
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

  function handleSelectWaypoint(waypointSymbol: string) {
    setSelectedWaypointSymbol(waypointSymbol);
    setSelectedShipSymbol(undefined);
  }

  return {
    waypointOptions,
    selectedWaypointSymbol,
    setSelectedWaypointSymbol: handleSelectWaypoint,
    selectedWaypoint,
    shipsAtSelectedWaypoint,
    shipOptions,
    selectedShipSymbol,
    setSelectedShipSymbol,
    selectedShip,
  };
}
