import { useAppSelector } from '../../../app/hooks';
import { useGetContractQuery } from '../api/contractsApi';
import type {
  ContractDetailsKind,
  ContractDetailsStatusState,
  ContractDetailsViewModel,
} from '../model/contractDetailsViewModel';
import { selectSelectedContractId } from '../store/contractsSelectors';

function makeState(
  kind: Exclude<ContractDetailsKind, 'ready'>,
  message: string,
): ContractDetailsStatusState {
  return {
    kind,
    title: 'Contract Details',
    message,
  };
}

export function useContractDetailsViewModel(): ContractDetailsViewModel {
  const selectedContractId = useAppSelector(selectSelectedContractId);

  const { data, error, isLoading, isFetching } = useGetContractQuery(
    selectedContractId ?? '',
    {
      skip: !selectedContractId,
    },
  );

  if (!selectedContractId) {
    return makeState('empty', 'Select a contract to see details.');
  }

  if (isLoading) {
    return makeState('loading', 'Loading contract terms...');
  }

  if (error) {
    return makeState('error', 'Could not load contract details.');
  }

  const contract = data?.data;

  if (!contract) {
    return makeState('empty', 'No contract details found.');
  }

  return {
    kind: 'ready',
    contract,
    isRefreshing: isFetching,
  };
}
