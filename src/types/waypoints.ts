export type WaypointTraitSymbol =
  | 'SHIPYARD'
  | 'MARKETPLACE'
  | 'UNCHARTED'
  | 'UNDER_CONSTRUCTION'
  | string

export type WaypointTrait = {
  symbol: WaypointTraitSymbol
  name: string
  description: string
}

export type Waypoint = {
  symbol: string
  type: string
  systemSymbol: string
  x: number
  y: number
  traits: WaypointTrait[]
  isUnderConstruction: boolean
}
