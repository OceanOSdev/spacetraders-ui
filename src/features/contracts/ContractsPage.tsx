import { useState } from 'react';
import { DashboardGrid } from '../../components/ui/DashboardGrid';
import { Stack } from '../../components/ui/Stack';
import { useGetShipsQuery } from '../ships/api/shipsApi';
import { ContractActionsPanel } from './components/ContractActionsPanel';
import { ContractDetails } from './components/ContractDetails';
import { ContractsList } from './components/ContractsList';
import { Panel } from '../../components/ui/Panel';
import { PanelTitle } from '../../components/ui/PanelTitle';
import { ShipSelector } from '../ships/components/ShipSelector';
import { ContractDeliveryPanel } from './components/ContractDeliveryPanel';

export function ContractsPage() {
  const [selectedShip, setSelectedShip] = useState('');
  const { data: shipsData, isFetching: isFetchingShips } = useGetShipsQuery();

  return (
    <Stack>
      <Panel className='contract-actions-panel'>
        <PanelTitle>Ship Selector</PanelTitle>
        <ShipSelector
          value={selectedShip}
          onChange={setSelectedShip}
          options={
            shipsData?.data.map((ship) => ({
              value: ship.symbol,
              label: `${ship.symbol} (${ship.registration.role})`,
            })) ?? []
          }
          placeholder={isFetchingShips ? 'Loading ships...' : 'Select ship'}
        />
      </Panel>
      <DashboardGrid>
        <Stack>
          <ContractActionsPanel shipSymbol={selectedShip} />
          <ContractsList />
        </Stack>
        <Stack>
          <ContractDetails />
          <ContractDeliveryPanel shipSymbol={selectedShip} />
        </Stack>
      </DashboardGrid>
    </Stack>
  );
}
