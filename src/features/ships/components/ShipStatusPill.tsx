import { StatusPill, type StatusPillTone } from "../../../components/ui/StatusPill";

type ShipStatusPillProps = {
  status: string
}

function normalizeStatus(status: string): string {
  return status.trim().toUpperCase();
}

function getStatusVariant(status: string): StatusPillTone {
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

export function ShipStatusPill({ status }: ShipStatusPillProps) {
  return (
    <StatusPill tone={getStatusVariant(status)}>
      {formatStatusLabel(status)}
    </StatusPill>
  );
}
