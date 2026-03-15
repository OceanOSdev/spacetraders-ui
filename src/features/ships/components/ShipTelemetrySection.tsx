import { PanelTitle } from '../../../components/ui/PanelTitle';
import { TelemetryBar } from '../../../components/ui/TelemetryBar';
import type { Ship } from '../../../types/ships/ships';

type ShipTelemetrySectionProps = {
  ship: Ship;
};

export function ShipTelemetrySection({ ship }: ShipTelemetrySectionProps) {
  return (
    <div className='ship-telemetry-section'>
      <PanelTitle as='h3'>Resource Telemetry</PanelTitle>

      <TelemetryBar
        label='Fuel'
        value={ship!.fuel.current}
        max={ship!.fuel.capacity}
        warningThresholdPercent={35}
        dangergThresholdPercent={15}
        size='md'
      />

      <TelemetryBar
        label='Cargo'
        value={ship!.cargo.units}
        max={ship!.cargo.capacity}
        warningThresholdPercent={75}
        dangergThresholdPercent={95}
        invertThresholds
        size='md'
      />
    </div>
  );
}
