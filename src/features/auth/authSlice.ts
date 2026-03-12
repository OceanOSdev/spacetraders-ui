import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from '../../types/auth';

// Try to restore a previously saved token from local storage
// if possible
const initialState: AuthState = {
  token: localStorage.getItem('spacetraders_token') ?? '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem('spacetraders_token', action.payload);
    },

    clearToken(state) {
      state.token = '';
      localStorage.removeItem('spacetraders_token');
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;

export default authSlice.reducer;
