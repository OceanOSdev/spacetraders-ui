import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { AgentResponse } from '../types/spacetaders'
import type { AuthState } from '../types/auth'

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

  tagTypes: ['Agent'],

  endpoints: (builder) => ({
    getAgent: builder.query<AgentResponse, void>({
      query: () => 'my/agent',
      providesTags: ['Agent'],
    }),
  }),
});

export const { useGetAgentQuery } = spacetradersApi;
