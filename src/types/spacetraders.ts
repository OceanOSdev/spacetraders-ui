// Small subset of the SpaceTraders agent model.
export type Agent = {
  symbol: string
  headquarters: string
  credits: number
  shipCount: number
}

// The API wraps most responses in a top-level data object.
export type AgentResponse = {
  data: Agent
}
