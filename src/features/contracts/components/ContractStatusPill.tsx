import {
  StatusPill,
  type StatusPillTone,
} from '../../../components/ui/StatusPill';

type ContractStatusPillProps = {
  accepted: boolean;
  fulfilled: boolean;
};

type ContractStatusLabel = 'Available' | 'Fulfilled' | 'Accepted';

type ContractStatusVals = {
  tone: StatusPillTone;
  label: ContractStatusLabel;
};

function getContractStatusVals(
  accepted: boolean,
  fulfilled: boolean,
): ContractStatusVals {
  if (fulfilled) {
    return { tone: 'green', label: 'Fulfilled' };
  }

  if (accepted) {
    return { tone: 'amber', label: 'Accepted' };
  }

  return { tone: 'cyan', label: 'Available' };
}

export function ContractStatusPill({
  accepted,
  fulfilled,
}: ContractStatusPillProps) {
  const vals = getContractStatusVals(accepted, fulfilled);
  return <StatusPill tone={vals.tone}>{vals.label}</StatusPill>;
}
