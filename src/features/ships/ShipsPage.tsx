import { ShipDetails } from "./components/ShipDetails";
import { ShipList } from "./components/ShipList";

export function ShipsPage() {
  return (
    <div className='dashboard-grid'>
      <ShipList />
      <ShipDetails />
    </div>
  );
}
