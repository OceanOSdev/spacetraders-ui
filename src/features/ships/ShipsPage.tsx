import { ShipDetails } from "./ShipDetails";
import { ShipList } from "./ShipList";

export function ShipsPage() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '1rem',
        alignItems: 'start',
        marginTop: '1rem',
      }}
    >
      <ShipList />
      <ShipDetails />
    </div>
  );
}
