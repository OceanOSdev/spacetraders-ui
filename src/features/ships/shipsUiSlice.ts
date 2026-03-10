import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type ShipsUiState = {
  selectedShipSymbol: string | null
}

const initialState: ShipsUiState = {
  selectedShipSymbol: null
}

const shipsUiSlice = createSlice({
  name: 'shipsUi',
  initialState,
  reducers: {
    setSelectedShipSymbol(state, action: PayloadAction<string | null>) {
      state.selectedShipSymbol = action.payload;
    },
  },
});

export const { setSelectedShipSymbol } = shipsUiSlice.actions;
export default shipsUiSlice.reducer;
