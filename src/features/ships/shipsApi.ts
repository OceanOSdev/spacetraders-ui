import { spacetradersApi } from '../../services/spacetradersApi';
import { providesEntity, providesEntityList } from '../../services/tagHelper';
import type { GetShipResponse, GetShipsResponse } from '../../types/ships';

export const shipsApi = spacetradersApi.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch the user's ships
    getShips: builder.query<GetShipsResponse, void>({
      query: () => 'my/ships',

      // Mark this query as providing the "Ships" list tag,
      // and also provide per-ship tags for individual invalidation later.
      providesTags: (result) =>
        providesEntityList(
          'Ships',
          'Ship',
          result?.data,
          (ship) => ship.symbol,
        ),
    }),

    // Fetch details for one particular ship.
    getShip: builder.query<GetShipResponse, string>({
      query: (shipSymbol) => `my/ships/${shipSymbol}`,
      providesTags: (_result, _error, shipSymbol) =>
        providesEntity('Ship', shipSymbol),
    }),

    purchaseShip: builder.mutation<
      unknown, // unknown for now, will add type later
      { shipType: string; waypointSymbol: string }
    >({
      query: ({ shipType, waypointSymbol }) => ({
        url: 'my/ships',
        method: 'POST',
        body: {
          shipType,
          waypointSymbol,
        },
      }),
      invalidatesTags: ['Ships', 'Agent'],
    }),
  }),
});

export const { useGetShipsQuery, useGetShipQuery, usePurchaseShipMutation } =
  shipsApi;
