import type { ShipCargoItem } from './ships/shipCargoItem';
import type { Agent } from './spacetraders';

export type MarketTradeGood = {
  symbol: string;
  type: string;
  tradeVolume: number;
  supply: string;
  activity: string;
  purchasePrice: number;
  sellPrice: number;
};

export type TradeGood = {
  symbol: string;
  name: string;
  describe: string;
};

export type Market = {
  symbol: string;
  exports: TradeGood[];
  imports: TradeGood[];
  exchange: TradeGood[];
  tradeGoods: MarketTradeGood[];
};

export type MarketTransaction = {
  waypointSymbol: string;
  shipSymbol: string;
  tradeSymbol: string;
  type: 'PURCHASE' | 'SELL';
  units: number;
  pricePerUnit: number;
  totalPrice: number;
  timestamp: string;
};

export type SellCargoResponse = {
  agent: Agent;
  // TODO: this looks awfully similar to [ShipCargo]
  cargo: {
    capacity: number;
    units: number;
    inventory: ShipCargoItem[];
  };
  transaction: MarketTransaction;
};
