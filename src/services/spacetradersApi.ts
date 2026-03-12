import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { AgentResponse } from '../types/spacetraders'
import type { AuthState } from '../types/auth'
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

  tagTypes: ['Agent', 'Ships', 'Ship', 'Contracts', 'Contract', 'Waypoints', 'Waypoint'] as const,

  endpoints: (builder) => ({
    // Fetch the agent profile
    getAgent: builder.query<AgentResponse, void>({
      query: () => 'my/agent',
      providesTags: ['Agent'],
    }),

    getWaypoint: builder.query<
      { data: Waypoint },
      { systemSymbol: string; waypointSymbol: string }
    >({
      query: ({ systemSymbol, waypointSymbol }) =>
        `systems/${systemSymbol}/waypoints/${waypointSymbol}`,
    }),

    getSystemWaypoints: builder.query<
      { data: Waypoint[] },
      { systemSymbol: string, traits?: string }
    >({
      query: ({ systemSymbol, traits }) => ({
        url: `systems/${systemSymbol}/waypoints`,
        params: traits ? { traits } : undefined,
      }),
    }),
  }),
});

export const {
  useGetAgentQuery,
  useGetWaypointQuery,
  useGetSystemWaypointsQuery,
} = spacetradersApi;
