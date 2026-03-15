import { Panel } from '../../../components/ui/Panel';
import { PanelTitle } from '../../../components/ui/PanelTitle';
import { Stack } from '../../../components/ui/Stack';
import type { Market } from '../../../types/markets';

type MarketOverviewPanelProps = {
  market?: Market;
  isLoading: boolean;
};

function formatSymbols(items?: { symbol: string }[]) {
  if (!items || items.length === 0) return '-';
  return items.map((item) => item.symbol).join(', ');
}

export function MarketOverviewPanel({
  market,
  isLoading,
}: MarketOverviewPanelProps) {
  return (
    <Panel>
      <Stack gap='md'>
        <PanelTitle>Market Overview</PanelTitle>

        {isLoading ? (
          <div>Loading market data...</div>
        ) : !market ? (
          <div>No market data.</div>
        ) : (
          <>
            <div>
              <strong>Exports:</strong> {formatSymbols(market.exports)}
            </div>
            <div>
              <strong>Imports:</strong> {formatSymbols(market.imports)}
            </div>
            <div>
              <strong>Exchange:</strong> {formatSymbols(market.exchange)}
            </div>
          </>
        )}
      </Stack>
    </Panel>
  );
}
