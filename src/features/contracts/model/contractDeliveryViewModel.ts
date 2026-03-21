import type { ContractDeliveryRow } from './contractDelivery';

export type ContractDeliveryKind = 'empty' | 'loading' | 'error' | 'ready';

type ContractDeliveryBaseState = {
  title: string;
  message: string;
};

export type ContractDeliveryStatusState = ContractDeliveryBaseState & {
  kind: Exclude<ContractDeliveryKind, 'ready'>;
};

export type ContractDeliveryReadyState = {
  kind: 'ready';
  contractId: string;
  shipSymbol: string;
  rows: ContractDeliveryRow[];
};

export type ContractDeliveryViewModel =
  | ContractDeliveryStatusState
  | ContractDeliveryReadyState;
