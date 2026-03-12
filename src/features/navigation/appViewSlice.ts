import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type AppView = 'ships' | 'contracts';

type AppViewState = {
  activeView: AppView;
};

const initialState: AppViewState = {
  activeView: 'ships',
};

const appViewSlice = createSlice({
  name: 'appView',
  initialState,
  reducers: {
    setActiveView(state, action: PayloadAction<AppView>) {
      state.activeView = action.payload;
    },
  },
});

export const { setActiveView } = appViewSlice.actions;
export default appViewSlice.reducer;
