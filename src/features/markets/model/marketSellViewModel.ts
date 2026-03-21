import type { Ship } from '../../../types/ships/ships';
import type { SellableCargoRow } from './marketViewModels';

export type MarketSellKind =
  | 'missing-ship'
  | 'docking-required'
  | 'empty'
  | 'ready';

type MarketSellBaseState = {
  title: string;
  message: string;
};

export type MarketSellStatusState = MarketSellBaseState & {
  kind: 'missing-ship' | 'empty';
};

export type MarketSellReadyState = {
  kind: 'ready';
  ship: Ship;
  rows: SellableCargoRow[];
};

export type MarketSellDockingRequiredState = MarketSellBaseState & {
  kind: 'docking-required';
  ship: Ship;
};

export type MarketSellViewModel =
  | MarketSellStatusState
  | MarketSellDockingRequiredState
  | MarketSellReadyState;
