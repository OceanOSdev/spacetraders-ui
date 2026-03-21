import { spacetradersApi } from '../../../services/spacetradersApi';
import {
  entityTag,
  invalidatesTags,
  listTag,
  providesEntity,
  providesEntityList,
} from '../../../services/tagHelper';
import type {
  GetShipResponse,
  GetShipsResponse,
} from '../../../types/ships/ships';

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

    orbitShip: builder.mutation<unknown, string>({
      query: (shipSymbol) => ({
        url: `my/ships/${shipSymbol}/orbit`,
        method: 'POST',
        body: {},
      }),
      invalidatesTags: (_result, _error, shipSymbol) =>
        invalidatesTags(entityTag('Ship', shipSymbol), listTag('Ships')),
    }),

    dockShip: builder.mutation<unknown, string>({
      query: (shipSymbol) => ({
        url: `my/ships/${shipSymbol}/dock`,
        method: 'POST',
        body: {},
      }),
      invalidatesTags: (_result, _error, shipSymbol) =>
        invalidatesTags(entityTag('Ship', shipSymbol), listTag('Ships')),
    }),

    navigateShip: builder.mutation<
      unknown,
      { shipSymbol: string; waypointSymbol: string }
    >({
      query: ({ shipSymbol, waypointSymbol }) => ({
        url: `my/ships/${shipSymbol}/navigate`,
        method: 'POST',
        body: {
          waypointSymbol,
        },
      }),
      invalidatesTags: (_result, _error, { shipSymbol }) =>
        invalidatesTags(listTag('Ships'), entityTag('Ship', shipSymbol)),
    }),

    refuelShip: builder.mutation<
      unknown,
      { shipSymbol: string; fromCargo?: boolean }
    >({
      query: ({ shipSymbol, fromCargo = false }) => ({
        url: `my/ships/${shipSymbol}/refuel`,
        method: 'POST',
        body: fromCargo ? { fromCargo: true } : {},
      }),
      invalidatesTags: (_result, _error, { shipSymbol }) => [
        entityTag('Ship', shipSymbol),
        listTag('Ships'),
        'Agent',
      ],
    }),

    extractResources: builder.mutation<unknown, string>({
      query: (shipSymbol) => ({
        url: `my/ships/${shipSymbol}/extract`,
        method: 'POST',
        body: {},
      }),
      invalidatesTags: (_result, _error, shipSymbol) =>
        invalidatesTags(entityTag('Ship', shipSymbol), listTag('Ships')),
    }),

    jettisonCargo: builder.mutation<
      unknown,
      { shipSymbol: string; symbol: string; units: number }
    >({
      query: ({ shipSymbol, symbol, units }) => ({
        url: `my/ships/${shipSymbol}/jettison`,
        method: 'POST',
        body: {
          symbol,
          units,
        },
      }),
      invalidatesTags: (_result, _error, { shipSymbol }) =>
        invalidatesTags(listTag('Ships'), entityTag('Ship', shipSymbol)),
    }),
  }),
});

export const {
  useGetShipsQuery,
  useGetShipQuery,
  usePurchaseShipMutation,
  useDockShipMutation,
  useOrbitShipMutation,
  useNavigateShipMutation,
  useRefuelShipMutation,
  useExtractResourcesMutation,
  useJettisonCargoMutation,
} = shipsApi;
