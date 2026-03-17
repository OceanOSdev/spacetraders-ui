import { spacetradersApi } from '../../../services/spacetradersApi';
import {
  entityTag,
  listTag,
  providesEntity,
  providesList,
} from '../../../services/tagHelper';
import type {
  AcceptContractResponse,
  Contract,
  GetContractResponse,
  GetContractsResponse,
  NegotiateContractResponse,
} from '../../../types/contracts';
import type { ShipCargo } from '../../../types/ships/ships';

export type DeliverContractCargoResponse = {
  contract: Contract;
  cargo: ShipCargo;
};

export const contractsApi = spacetradersApi.injectEndpoints({
  endpoints: (builder) => ({
    getContracts: builder.query<GetContractsResponse, void>({
      query: () => 'my/contracts',
      providesTags: () => providesList('Contracts'),
    }),

    getContract: builder.query<GetContractResponse, string>({
      query: (contractId) => `my/contracts/${contractId}`,
      providesTags: (_result, _error, contractId) =>
        providesEntity('Contract', contractId),
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
      ],
    }),

    negotiateContract: builder.mutation<NegotiateContractResponse, string>({
      query: (shipSymbol) => ({
        url: `my/ships/${shipSymbol}/negotiate/contract`,
        method: 'POST',
        body: {},
      }),
      invalidatesTags: [listTag('Contracts'), listTag('Agent')],
    }),

    deliverContractCargo: builder.mutation<
      unknown,
      {
        contractId: string;
        shipSymbol: string;
        tradeSymbol: string;
        units: number;
      }
    >({
      query: ({ contractId, shipSymbol, tradeSymbol, units }) => ({
        url: `my/contracts/${contractId}/deliver`,
        method: 'POST',
        body: {
          shipSymbol,
          tradeSymbol,
          units,
        },
      }),
      transformResponse: (response: { data: DeliverContractCargoResponse }) =>
        response.data,
      invalidatesTags: (_result, _error, arg) => [
        entityTag('Contract', arg.contractId),
        entityTag('Ship', arg.shipSymbol),
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
  useDeliverContractCargoMutation,
} = contractsApi;
