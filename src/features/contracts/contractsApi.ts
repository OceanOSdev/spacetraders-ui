import { spacetradersApi } from "../../services/spacetradersApi";
import type { AcceptContractResponse, GetContractResponse, GetContractsResponse, NegotiateContractResponse } from "../../types/contracts";

export const contractsApi = spacetradersApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {
  useGetContractsQuery,
  useGetContractQuery,
  useAcceptContractMutation,
  useNegotiateContractMutation,
} = contractsApi;
