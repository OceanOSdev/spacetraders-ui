import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import contractsUiReducer from '../features/contracts/contractsUiSlice'
import shipsUiReducer from '../features/ships/shipsUiSlice'
import { spacetradersApi } from '../services/spacetradersApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shipsUi: shipsUiReducer,
    contractsUi: contractsUiReducer,
    [spacetradersApi.reducerPath]: spacetradersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(spacetradersApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
