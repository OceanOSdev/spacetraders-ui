type ContractStatusPillProps = {
  accepted: boolean
  fulfilled: boolean
}

export function ContractStatusPill({
  accepted,
  fulfilled,
}: ContractStatusPillProps) {
  let label = 'Available';
  let variant = 'cyan';

  if (fulfilled) {
    label = 'Fulfilled';
    variant = 'green';
  } else if (accepted) {
    label = 'Accepted';
    variant = 'amber';
  }

  return (
    <span className={`status-pill status-pill-${variant}`}>
      {label}
    </span>
  );
}
