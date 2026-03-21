import type { Contract } from '../../../types/contracts';

export type ContractDetailsKind = 'empty' | 'loading' | 'error' | 'ready';

type ContractDetailsBaseState = {
  title: string;
  message: string;
};

export type ContractDetailsStatusState = ContractDetailsBaseState & {
  kind: Exclude<ContractDetailsKind, 'ready'>;
};

export type ContractDetailsReadyState = {
  kind: 'ready';
  contract: Contract;
  isRefreshing: boolean;
};

export type ContractDetailsViewModel =
  | ContractDetailsStatusState
  | ContractDetailsReadyState;
