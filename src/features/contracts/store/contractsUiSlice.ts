import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type ContractsUiState = {
  selectedContractId: string | null;
  selectedShipSymbol: string | null;
};

const initialState: ContractsUiState = {
  selectedContractId: null,
  selectedShipSymbol: null,
};

const contractsUiSlice = createSlice({
  name: 'contractsUi',
  initialState,
  reducers: {
    setSelectedContractId(state, action: PayloadAction<string | null>) {
      state.selectedContractId = action.payload;
    },
    setSelectedShipSymbol(state, action: PayloadAction<string | null>) {
      state.selectedShipSymbol = action.payload;
    },
  },
});

export const { setSelectedContractId, setSelectedShipSymbol } =
  contractsUiSlice.actions;
export default contractsUiSlice.reducer;
