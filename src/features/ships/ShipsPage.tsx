import { PurchaseShipPanel } from "./components/PurchaseShipPanel";
import { ShipDetails } from "./components/ShipDetails";
import { ShipList } from "./components/ShipList";

export function ShipsPage() {
  return (
    <div style={{ display: 'grid', rowGap: '1rem' }}>
      <PurchaseShipPanel />
      <div className='dashboard-grid'>
        <ShipList />
        <ShipDetails />
      </div>
    </div>
  );
}
