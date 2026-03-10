export type ContractDeliveredGood = {
  tradeSymbol: string
  destinationSymbol: string
  unitsRequired: number
  unitsFulfilled: number
}

export type ContractPayment = {
  onAccepted: number
  onFulfilled: number
}

export type ContractTerms = {
  deadline: string
  payment: ContractPayment
  deliver: ContractDeliveredGood[]
}

export type ContractFaction = {
  symbol: string
}

export type Contract = {
  id: string
  factionSymbol?: string
  type: string
  accepted: boolean
  fulfilled: boolean
  // deprecated in favor of deadlineToAccept
  expiration: string
  deadlineToAccept?: string
  terms: ContractTerms
}

export type GetContractsResponse = {
  data: Contract[]
}

export type GetContractResponse = {
  data: Contract
}

export type AcceptContractResponse = {
  data: {
    contract: Contract
  }
}

export type NegotiateContractResponse = {
  data: {
    contract: Contract
  }
}
