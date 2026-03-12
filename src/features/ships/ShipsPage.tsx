import { DashboardGrid } from '../../components/ui/DashboardGrid';
import { Stack } from '../../components/ui/Stack';
import { PurchaseShipPanel } from './components/PurchaseShipPanel';
import { ShipDetails } from './components/ShipDetails';
import { ShipList } from './components/ShipList';

export function ShipsPage() {
  return (
    <Stack>
      <PurchaseShipPanel />
      <DashboardGrid>
        <ShipList />
        <ShipDetails />
      </DashboardGrid>
    </Stack>
  );
}
