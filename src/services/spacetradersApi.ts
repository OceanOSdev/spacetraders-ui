import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { AgentResponse } from '../types/spacetaders'
import type { AuthState } from '../types/auth'
import type { GetShipResponse, GetShipsResponse } from '../types/ships'

type ApiRootState = {
  auth: AuthState
}

const BASE_URL = 'https://api.spacetraders.io/v2/';

export const spacetradersApi = createApi({
  reducerPath: 'spacetradersApi',

  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as ApiRootState).auth.token;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),

  tagTypes: ['Agent', 'Ships', 'Ship'],

  endpoints: (builder) => ({
    // Fetch the agent profile
    getAgent: builder.query<AgentResponse, void>({
      query: () => 'my/agent',
      providesTags: ['Agent'],
    }),

    // Fetch the user's ships
    getShips: builder.query<GetShipsResponse, void>({
      query: () => 'my/ships',

      // Mark this query as providing the "Ships" list tag,
      // and also provide per-ship tags for individual invalidation later.
      providesTags: (result) => {
        if (!result) {
          return [{ type: 'Ships' as const }];
        }

        return [
          { type: 'Ships' as const },
          ...result.data.map((ship) => ({ type: 'Ship' as const, id: ship.symbol })),
        ];
      },
    }),

    // Fetch details for one particular ship.
    getShip: builder.query<GetShipResponse, string>({
      query: (shipSymbol) => `my/ships/${shipSymbol}`,
      providesTags: (_result, _error, shipSymbol) => [
        { type: 'Ship', id: shipSymbol },
      ],
    }),
  }),
});

export const {
  useGetAgentQuery,
  useGetShipsQuery,
  useGetShipQuery,
} = spacetradersApi;
