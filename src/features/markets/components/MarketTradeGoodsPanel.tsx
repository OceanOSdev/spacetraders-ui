import { MutedText } from '../../../components/ui/MutedText';
import { Panel } from '../../../components/ui/Panel';
import { PanelTitle } from '../../../components/ui/PanelTitle';
import { Stack } from '../../../components/ui/Stack';
import { StatusText } from '../../../components/ui/StatusText';
import type { Market } from '../../../types/markets';

type MarketTradeGoodsPanelProps = {
  market?: Market;
  isLoading: boolean;
};

function formatTradeSymbol(symbol: string) {
  return symbol.replaceAll('_', ' ');
}

export function MarketTradeGoodsPanel({
  market,
  isLoading,
}: MarketTradeGoodsPanelProps) {
  if (isLoading) {
    return (
      <Panel>
        <PanelTitle>Trade Goods</PanelTitle>
        <StatusText>Loading market...</StatusText>
      </Panel>
    );
  }

  if (!market?.tradeGoods?.length) {
    return (
      <Panel>
        <PanelTitle>Trade Goods</PanelTitle>
        <StatusText>No trade data.</StatusText>
      </Panel>
    );
  }

  const goods = [...market.tradeGoods].sort((a, b) =>
    a.symbol.localeCompare(b.symbol),
  );

  return (
    <Panel>
      <PanelTitle>Trade Goods</PanelTitle>

      <Stack gap='sm'>
        <div className='market-goods-header'>
          <MutedText>Good</MutedText>
          <MutedText>Type</MutedText>
          <MutedText>Buy</MutedText>
          <MutedText>Sell</MutedText>
        </div>

        {goods.map((good) => (
          <div key={good.symbol} className='market-goods-row'>
            <span className='market-goods-symbol'>
              {formatTradeSymbol(good.symbol)}
            </span>

            <span className='market-goods-type'>{good.type}</span>

            <span className='market-goods-price'>
              {good.purchasePrice ?? '—'}
            </span>

            <span className='market-goods-price'>{good.sellPrice ?? '—'}</span>
          </div>
        ))}
      </Stack>
    </Panel>
  );
}
