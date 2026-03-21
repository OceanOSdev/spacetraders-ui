import { useMemo } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { useGetContractQuery } from '../api/contractsApi';
import type {
  ContractDeliveryKind,
  ContractDeliveryStatusState,
  ContractDeliveryViewModel,
} from '../model/contractDeliveryViewModel';
import {
  selectSelectedContractId,
  selectSelectedContractShipSymbol,
} from '../store/contractsSelectors';
import { buildContractDeliveryRows } from '../model/contractDelivery';
import { useGetShipQuery } from '../../ships/api/shipsApi';

function makeState(
  kind: Exclude<ContractDeliveryKind, 'ready'>,
  message: string,
): ContractDeliveryStatusState {
  return {
    kind,
    title: 'Cargo Delivery',
    message,
  };
}

export function useContractDeliveryViewModel(): ContractDeliveryViewModel {
  const contractId = useAppSelector(selectSelectedContractId);
  const shipSymbol = useAppSelector(selectSelectedContractShipSymbol);

  const {
    data: contractData,
    error: contractError,
    isLoading: isContractLoading,
  } = useGetContractQuery(contractId ?? '', {
    skip: !contractId,
  });

  const {
    data: shipData,
    error: shipError,
    isLoading: isShipLoading,
  } = useGetShipQuery(shipSymbol ?? '', {
    skip: !shipSymbol,
  });

  const contract = contractData?.data;
  const ship = shipData?.data;

  const rows = useMemo(() => {
    if (!contract || !ship) return [];
    return buildContractDeliveryRows(contract, ship);
  }, [contract, ship]);

  if (!contractId) {
    return makeState('empty', 'Select a contract to deliver cargo.');
  }

  if (!shipSymbol) {
    return makeState('empty', 'Select a ship to deliver cargo.');
  }

  if (isContractLoading || isShipLoading) {
    return makeState('loading', 'Loading contract delivery data...');
  }

  if (contractError || shipError) {
    return makeState('error', 'Could not load contract delivery data.');
  }

  if (!contract) {
    return makeState('empty', 'No contract details found.');
  }

  if (!ship) {
    return makeState('empty', 'No ship details found.');
  }

  if (rows.length === 0) {
    return makeState('empty', 'No deliverables for this contract.');
  }

  return {
    kind: 'ready',
    contractId: contract.id,
    shipSymbol: ship.symbol,
    rows,
  };
}
