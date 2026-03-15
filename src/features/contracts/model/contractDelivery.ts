import type { Contract } from '../../../types/contracts';
import type { Ship } from '../../../types/ships/ships';

export type ContractDeliveryRow = {
  tradeSymbol: string;
  unitsRequired: number;
  unitsFulfilled: number;
  unitsRemaining: number;
  unitsOnShip: number;
  maxDeliverableUnits: number;
  isAtDestination: boolean;
  canDeliver: boolean;
  disabledReason?: string;
};

function getUnitsOnShip(ship: Ship | undefined, tradeSymbol: string): number {
  if (!ship) return 0;

  const item = ship.cargo.inventory.find(
    (cargoItem) => cargoItem.symbol === tradeSymbol,
  );

  return item?.units ?? 0;
}

export function buildContractDeliveryRows(
  contract: Contract,
  ship: Ship | undefined,
): ContractDeliveryRow[] {
  return contract.terms.deliver.map((deliverable) => {
    const unitsRemaining = Math.max(
      0,
      deliverable.unitsRequired - deliverable.unitsFulfilled,
    );

    const unitsOnShip = getUnitsOnShip(ship, deliverable.tradeSymbol);

    const destinationSymbol = deliverable.destinationSymbol;
    const isAtDestination = ship?.nav.waypointSymbol === destinationSymbol;

    const maxDeliverableUnits = Math.min(unitsRemaining, unitsOnShip);

    let canDeliver = true;
    let disabledReason: string | undefined;

    if (!ship) {
      canDeliver = false;
      disabledReason = 'Select a ship';
    } else if (!isAtDestination) {
      canDeliver = false;
      disabledReason = 'Ship must be at the delivery waypoint';
    } else if (unitsRemaining <= 0) {
      canDeliver = false;
      disabledReason = 'Already fulfilled';
    } else if (unitsOnShip <= 0) {
      canDeliver = false;
      disabledReason = 'Ship has no matching cargo';
    }
    return {
      tradeSymbol: deliverable.tradeSymbol,
      unitsRequired: deliverable.unitsRequired,
      unitsFulfilled: deliverable.unitsFulfilled,
      unitsRemaining,
      unitsOnShip,
      maxDeliverableUnits,
      isAtDestination,
      canDeliver,
      disabledReason,
    };
  });
}
