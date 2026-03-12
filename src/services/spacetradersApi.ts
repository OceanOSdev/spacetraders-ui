import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { AgentResponse } from '../types/spacetraders'
import type { AuthState } from '../types/auth'
import type { GetShipResponse, GetShipsResponse } from '../types/ships'
import type { AcceptContractResponse, GetContractResponse, GetContractsResponse, NegotiateContractResponse } from '../types/contracts'
import type { Waypoint } from '../types/waypoints'

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

  tagTypes: ['Agent', 'Ships', 'Ship', 'Contracts', 'Contract'] as const,

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
        { type: 'Ship' as const, id: shipSymbol },
      ],
    }),

    getContracts: builder.query<GetContractsResponse, void>({
      query: () => 'my/contracts',
      providesTags: (result) =>
        result
          ? [
            { type: 'Contracts' as const },
            ...result.data.map((contract) => ({
              type: 'Contract' as const,
              id: contract.id,
            })),
          ]
          : [{ type: 'Contracts' as const }],
    }),

    getContract: builder.query<GetContractResponse, string>({
      query: (contractId) => `my/contracts/${contractId}`,
      providesTags: (_result, _error, contractId) => [
        { type: 'Contract' as const, id: contractId },
      ],
    }),

    acceptContract: builder.mutation<AcceptContractResponse, string>({
      query: (contractId) => ({
        url: `my/contracts/${contractId}/accept`,
        method: 'POST',
        body: {},
      }),
      invalidatesTags: (_result, _error, contractId) => [
        { type: 'Contracts' as const },
        { type: 'Contract' as const, id: contractId },
        { type: 'Agent' as const },
      ],
    }),

    negotiateContract: builder.mutation<NegotiateContractResponse, string>({
      query: (shipSymbol) => ({
        url: `my/ships/${shipSymbol}/negotiate/contract`,
        method: 'POST',
        body: {},
      }),
      invalidatesTags: [
        { type: 'Contracts' as const },
        { type: 'Agent' as const },
      ],
    }),

    getWaypoint: builder.query<
      { data: Waypoint },
      { systemSymbol: string; waypointSymbol: string }
    >({
      query: ({ systemSymbol, waypointSymbol }) =>
        `/systems/${systemSymbol}/waypoints/${waypointSymbol}`,
    }),
  }),
});

export const {
  useGetAgentQuery,
  useGetShipsQuery,
  useGetShipQuery,
  useGetContractsQuery,
  useGetContractQuery,
  useAcceptContractMutation,
  useNegotiateContractMutation,
} = spacetradersApi;
