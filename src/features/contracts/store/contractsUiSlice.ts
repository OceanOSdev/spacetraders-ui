import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type ContractsUiState = {
  selectedContractId: string | null;
};

const initialState: ContractsUiState = {
  selectedContractId: null,
};

const contractsUiSlice = createSlice({
  name: 'contractsUi',
  initialState,
  reducers: {
    setSelectedContractId(state, action: PayloadAction<string | null>) {
      state.selectedContractId = action.payload;
    },
  },
});

export const { setSelectedContractId } = contractsUiSlice.actions;
export default contractsUiSlice.reducer;
