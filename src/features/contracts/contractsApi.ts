import { spacetradersApi } from "../../services/spacetradersApi";
import { entityTag, listTag, providesEntity, providesList } from "../../services/tagHelper";
import type { AcceptContractResponse, GetContractResponse, GetContractsResponse, NegotiateContractResponse } from "../../types/contracts";

export const contractsApi = spacetradersApi.injectEndpoints({
  endpoints: (builder) => ({
    getContracts: builder.query<GetContractsResponse, void>({
      query: () => 'my/contracts',
      providesTags: () => providesList('Contracts')
    }),

    getContract: builder.query<GetContractResponse, string>({
      query: (contractId) => `my/contracts/${contractId}`,
      providesTags: (_result, _error, contractId) => providesEntity('Contract', contractId),
    }),

    acceptContract: builder.mutation<AcceptContractResponse, string>({
      query: (contractId) => ({
        url: `my/contracts/${contractId}/accept`,
        method: 'POST',
        body: {},
      }),
      invalidatesTags: (_result, _error, contractId) => [
        listTag('Contracts'),
        entityTag('Contract', contractId),
        listTag('Agent'),
      ]
    }),

    negotiateContract: builder.mutation<NegotiateContractResponse, string>({
      query: (shipSymbol) => ({
        url: `my/ships/${shipSymbol}/negotiate/contract`,
        method: 'POST',
        body: {},
      }),
      invalidatesTags: [
        listTag('Contracts'),
        listTag('Agent'),
      ],
    }),
  }),
});

export const {
  useGetContractsQuery,
  useGetContractQuery,
  useAcceptContractMutation,
  useNegotiateContractMutation,
} = contractsApi;
