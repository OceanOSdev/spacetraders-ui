import type { Market } from '../../../types/markets';
import type { Ship } from '../../../types/ships/ships';

export type MarketShipOption = {
  shipSymbol: string;
  role: string;
  waypointSymbol: string;
  cargo: {
    value: number;
    max: number;
  };
  isDocked: boolean;
  canTrade: boolean;
  disabledReason?: string;
};

export type SellableCargoRow = {
  tradeSymbol: string;
  unitsInCargo: number;
  sellPrice?: number;
  totalValue?: number;
  isSellable: boolean;
  disabledReason?: string;
};

export function getShipsAtWaypoint(
  ships: Ship[],
  waypointSymbol: string,
): Ship[] {
  return ships.filter((ship) => ship.nav.waypointSymbol === waypointSymbol);
}

export function toMarketShipOptions(ships: Ship[]): MarketShipOption[] {
  return ships
    .map((ship) => {
      const isDocked = ship.nav.status === 'DOCKED';
      const canTrade = isDocked;

      return {
        shipSymbol: ship.symbol,
        role: ship.registration.role,
        waypointSymbol: ship.nav.waypointSymbol,
        cargo: {
          value: ship.cargo.units,
          max: ship.cargo.capacity,
        },
        isDocked,
        canTrade,
        disabledReason: canTrade ? undefined : 'Must be docked to trade',
      };
    })
    .sort((a, b) => {
      if (a.canTrade !== b.canTrade) return a.canTrade ? -1 : 1;
      return a.shipSymbol.localeCompare(b.shipSymbol);
    });
}

export function getDefaultSelectedShipSymbol(
  shipOptions: MarketShipOption[],
): string | undefined {
  return (
    shipOptions.find((ship) => ship.canTrade)?.shipSymbol ??
    shipOptions[0]?.shipSymbol
  );
}

export function buildSellableCargoRows(
  ship: Ship | undefined,
  market: Market | undefined,
): SellableCargoRow[] {
  if (!ship) return [];

  const marketGoods = new Map(
    (market?.tradeGoods ?? []).map((good) => [good.symbol, good]),
  );

  return ship.cargo.inventory
    .map((item) => {
      const marketGood = marketGoods.get(item.symbol);
      const sellPrice = marketGood?.sellPrice;
      const isDocked = ship.nav.status === 'DOCKED';

      let isSellable = true;
      let disabledReason: string | undefined;

      if (!isDocked) {
        isSellable = false;
        disabledReason = 'Must be docked to trade';
      } else if (sellPrice == null) {
        isSellable = false;
        disabledReason = 'Not traded here';
      }

      return {
        tradeSymbol: item.symbol,
        unitsInCargo: item.units,
        sellPrice,
        totalValue: sellPrice != null ? sellPrice * item.units : undefined,
        isSellable,
        disabledReason,
      };
    })
    .sort((a, b) => {
      if (a.isSellable !== b.isSellable) return a.isSellable ? -1 : 1;
      return (b.totalValue ?? -1) - (a.totalValue ?? -1);
    });
}
