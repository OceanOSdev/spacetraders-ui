import { Selector } from '../../../../components/ui/Selector';
import type { Waypoint } from '../../../../types/waypoints';

type WaypointSelectorProps = {
  targets: Waypoint[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function WaypointSelector({
  targets,
  value,
  onChange,
  placeholder = 'Select destination',
  disabled = false,
}: WaypointSelectorProps) {
  return (
    <Selector
      options={targets.map((target) => ({
        value: target.symbol,
        label: `${target.symbol} (${target.type})`,
      }))}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      emptyMessage='No ships available'
    />
  );
}
