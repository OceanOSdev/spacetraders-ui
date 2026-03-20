import type { RootState } from '../../../app/store';

export const selectSelectedContractId = (state: RootState) =>
  state.contractsUi.selectedContractId;

export const selectSelectedContractShipSymbol = (state: RootState) =>
  state.contractsUi.selectedShipSymbol;
