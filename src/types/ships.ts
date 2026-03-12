// Navigation state for a ship
// This is where the ship is and what it's doing.
export type ShipNav = {
  systemSymbol: string;
  waypointSymbol: string;
  status: string;
  flightMode: string;
};

// Fuel info for a ship.
export type ShipFuel = {
  current: number;
  capacity: number;
};

// Cargo item in ship's inventory.
export type ShipCargoItem = {
  symbol: string;
  units: number;
};

// Cargo summary for a ship.
export type ShipCargo = {
  capacity: number;
  units: number;
  inventory: ShipCargoItem[];
};

// Minimal ship model for UI.
export type Ship = {
  symbol: string;
  nav: ShipNav;
  fuel: ShipFuel;
  cargo: ShipCargo;
};

// Response for GET /my/ships
export type GetShipsResponse = {
  data: Ship[];
};

// Reponse for GET /my/ships/{shipSymbol}
export type GetShipResponse = {
  data: Ship;
};

export type PurchaseShipRequest = {
  shipType: string;
  waypointSymbol: string;
};
