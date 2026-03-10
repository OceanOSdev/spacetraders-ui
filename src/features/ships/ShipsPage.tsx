import { ShipDetails } from "./ShipDetails";
import { ShipList } from "./ShipList";

export function ShipsPage() {
  return (
    <div className='dashboard-grid'>
      <ShipList />
      <ShipDetails />
    </div>
  );
}
