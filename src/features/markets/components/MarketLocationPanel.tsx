import { Panel } from '../../../components/ui/Panel';
import { PanelTitle } from '../../../components/ui/PanelTitle';
import { Selector } from '../../../components/ui/Selector';

type WaypointOption = {
  waypointSymbol: string;
  systemSymbol: string;
};

type MarketLocationPanelProps = {
  waypointOptions: WaypointOption[];
  selectedWaypointSymbol?: string;
  onSelectWaypoint: (waypointSymbol: string) => void;
};

export function MarketLocationPanel({
  waypointOptions,
  selectedWaypointSymbol = '',
  onSelectWaypoint,
}: MarketLocationPanelProps) {
  // TODO: probably should make a selector-panel css class
  return (
    <Panel className='contract-actions-panel'>
      <PanelTitle>Market Location</PanelTitle>

      <Selector
        value={selectedWaypointSymbol}
        options={waypointOptions.map((option) => ({
          value: option.waypointSymbol,
          label: option.waypointSymbol,
        }))}
        onChange={onSelectWaypoint}
        placeholder='Select waypoint'
      />
    </Panel>
  );
}
