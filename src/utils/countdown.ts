export type CountdownInfo = {
  text: string;
  expired: boolean;
};

export function getCountdownInfo(isoDate: string): CountdownInfo {
  const target = new Date(isoDate).getTime();
  const now = Date.now();
  const diffMs = target - now;

  if (Number.isNaN(target)) {
    return {
      text: 'Unknown deadline',
      expired: false,
    };
  }

  if (diffMs <= 0) {
    return {
      text: 'Expired',
      expired: true,
    };
  }

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return {
      text: `${days}d ${hours}h remaining`,
      expired: false,
    };
  }

  if (totalHours > 0) {
    return {
      text: `${totalHours}h ${minutes}m remaining`,
      expired: false,
    };
  }

  return {
    text: `${Math.max(totalMinutes, 0)}m remaining`,
    expired: false,
  };
}
