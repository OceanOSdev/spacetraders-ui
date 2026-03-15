import { spacetradersApi } from '../../../services/spacetradersApi';
import {
  entityTag,
  invalidatesTags,
  listTag,
  providesEntity,
} from '../../../services/tagHelper';
import type { SellCargoResponse, Market } from '../../../types/markets';

export type GetMarketArgs = {
  systemSymbol: string;
  waypointSymbol: string;
};

export type SellCargoArgs = {
  shipSymbol: string;
  waypointSymbol: string; // might need this for invalidating tag
  symbol: string;
  units: number;
};

export const marketsApi = spacetradersApi.injectEndpoints({
  endpoints: (build) => ({
    getMarket: build.query<Market, GetMarketArgs>({
      query: ({ systemSymbol, waypointSymbol }) => ({
        url: `systems/${systemSymbol}/waypoints/${waypointSymbol}/market`,
      }),
      transformResponse: (response: { data: Market }) => response.data,
      providesTags: (_result, _error, arg) =>
        providesEntity('Market', arg.waypointSymbol),
    }),

    sellCargo: build.mutation<SellCargoResponse, SellCargoArgs>({
      query: ({ shipSymbol, symbol, units }) => ({
        url: `my/ships/${shipSymbol}/sell`,
        method: 'POST',
        body: { symbol, units },
      }),
      transformResponse: (response: { data: SellCargoResponse }) =>
        response.data,
      invalidatesTags: (_result, _error, arg) =>
        invalidatesTags(
          entityTag('Ship', arg.shipSymbol),
          entityTag('Market', arg.waypointSymbol),
          listTag('Agent'),
        ),
    }),
  }),
});

export const { useGetMarketQuery, useSellCargoMutation } = marketsApi;
