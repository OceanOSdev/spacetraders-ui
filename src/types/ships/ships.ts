// Navigation state for a ship

import type { ShipCargoItem } from './shipCargoItem';

// This is where the ship is and what it's doing.
export type ShipNav = {
  systemSymbol: string;
  waypointSymbol: string;
  status: string;
  flightMode: string;
  route: ShipNavRoute;
};

export type ShipNavRoute = {
  arrival: string;
};

// Fuel info for a ship.
export type ShipFuel = {
  current: number;
  capacity: number;
};

// Cargo summary for a ship.
export type ShipCargo = {
  capacity: number;
  units: number;
  inventory: ShipCargoItem[];
};

export type ShipCooldown = {
  shipSymbol: string;
  totalSeconds: number;
  remainingSeconds: number;
  expiration: string;
};

export type ShipRegistration = {
  name: string;
  factionSymbol: string;
  role: string;
};

// Minimal ship model for UI.
export type Ship = {
  symbol: string;
  registration: ShipRegistration;
  nav: ShipNav;
  fuel: ShipFuel;
  cargo: ShipCargo;
  cooldown: ShipCooldown;
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
