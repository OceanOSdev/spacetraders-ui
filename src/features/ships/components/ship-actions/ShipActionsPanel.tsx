import { PanelTitle } from '../../../../components/ui/PanelTitle';
import { Stack } from '../../../../components/ui/Stack';
import type { Ship } from '../../../../types/ships/ships';
import { DockOrOrbitButton } from './DockOrOrbitButton';
import { ShipMining } from './ShipMining';
import { ShipRefuel } from './ShipRefuel';

type ShipActionsPanelProps = {
  ship: Ship;
};

export function ShipActionsPanel({ ship }: ShipActionsPanelProps) {
  return (
    <div className='ship-actions-section'>
      <PanelTitle as='h3'>Ship Actions</PanelTitle>

      <Stack gap='md' align='start'>
        <DockOrOrbitButton ship={ship} />
        <ShipRefuel ship={ship} />
        <ShipMining ship={ship} />
      </Stack>
    </div>
  );
}
