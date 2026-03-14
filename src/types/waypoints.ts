export type WaypointTraitSymbol =
  | 'SHIPYARD'
  | 'MARKETPLACE'
  | 'UNCHARTED'
  | 'UNDER_CONSTRUCTION'
  | string;

export type WaypointKind =
  | 'PLANET'
  | 'GAS_GIANT'
  | 'MOON'
  | 'ORBITAL_STATION'
  | 'JUMP_GATE'
  | 'ASTEROID_FIELD'
  | 'ASTEROID'
  | 'ENGINEERED_ASTEROID'
  | 'ASTEROID_BASE'
  | 'NEBULA'
  | 'DEBRIS_FIELD'
  | 'GRAVITY_WELL'
  | 'ARTIFICIAL_GRAVITY_WELL'
  | 'FUEL_STATION';

export type WaypointTrait = {
  symbol: WaypointTraitSymbol;
  name: string;
  description: string;
};

export type WaypointModifierSymbol =
  | 'STRIPPED'
  | 'UNSTABLE'
  | 'RADIATION_LEAK'
  | 'CRITICAL_LIMIT'
  | 'CIVIL_UNREST';

export type WaypointModifier = {
  name: string;
  description: string;
  symbol: WaypointModifierSymbol;
};

export type Waypoint = {
  symbol: string;
  type: string;
  systemSymbol: string;
  x: number;
  y: number;
  traits: WaypointTrait[];
  modifiers: WaypointModifier[];
  isUnderConstruction: boolean;
};
