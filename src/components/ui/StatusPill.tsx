type StatusPillProps = {
  status: string
}

function normalizeStatus(status: string): string {
  return status.trim().toUpperCase();
}

type StatusVariant = 'green' | 'cyan' | 'amber' | 'red' | 'gray';

function getStatusVariant(status: string): StatusVariant {
  const normalized = normalizeStatus(status);

  switch (normalized) {
    case 'DOCKED':
      return 'green';
    case 'IN_ORBIT':
      return 'cyan';
    case 'IN_TRANSIT':
      return 'amber';
    case 'OFFLINE':
    case 'DAMAGED':
      return 'red';
    default:
      return 'gray';
  }
}

function formatStatusLabel(status: string): string {
  return normalizeStatus(status).replaceAll('_', ' ');
}

export function StatusPill({ status }: StatusPillProps) {
  const variant = getStatusVariant(status);

  return (
    <span className={`status-pill status-pill-${variant}`}>
      {formatStatusLabel(status)}
    </span>
  );
}
