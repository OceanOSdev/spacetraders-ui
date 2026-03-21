import { useMemo } from 'react';
import type { Market } from '../../../types/markets';
import type { Ship } from '../../../types/ships/ships';
import type {
  MarketSellStatusState,
  MarketSellViewModel,
} from '../model/marketSellViewModel';
import { buildSellableCargoRows } from '../model/marketViewModels';

type UseMarketSellViewModelArgs = {
  ship?: Ship;
  market?: Market;
};

function makeState(
  kind: 'missing-ship' | 'empty',
  message: string,
): MarketSellStatusState {
  return {
    kind,
    title: 'Sell Cargo',
    message,
  };
}

export function useMarketSellViewModel({
  ship,
  market,
}: UseMarketSellViewModelArgs): MarketSellViewModel {
  const rows = useMemo(
    () => buildSellableCargoRows(ship, market),
    [ship, market],
  );

  if (!ship) {
    return makeState('missing-ship', 'Select a ship to trade.');
  }

  if (ship.nav.status !== 'DOCKED') {
    return {
      kind: 'docking-required',
      title: 'Sell Cargo',
      message: 'Ship must be docked to buy and sell.',
      ship,
    };
  }

  if (rows.length === 0) {
    return makeState('empty', 'This ship has no cargo.');
  }

  return {
    kind: 'ready',
    ship,
    rows,
  };
}
