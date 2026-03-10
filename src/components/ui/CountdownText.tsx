type CountdownTextProps = {
  isoDate: string
  prefix?: string
}

function formatCountdown(isoDate: string): string {
  const target = new Date(isoDate).getTime();
  const now = Date.now();
  const diffMs = target - now;

  if (Number.isNaN(target)) {
    return 'Unknown deadline';
  }

  if (diffMs <= 0) {
    return 'Expired';
  }

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  }

  if (totalHours > 0) {
    return `${totalHours}h ${minutes}m remaining`;
  }

  return `${Math.max(totalMinutes, 0)}m remaining`;
}

export function CountdownText({ isoDate, prefix }: CountdownTextProps) {
  const text = formatCountdown(isoDate);

  return (
    <span className={`countdown-text${text === 'Expired' ? ' is-expired' : ''}`}>
      {prefix ? `${prefix} ${text}` : text}
    </span>
  );
}
