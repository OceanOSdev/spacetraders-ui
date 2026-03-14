import { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import { getCountdownInfo } from '../../utils/countdown';

type CountdownTextProps = {
  isoDate: string;
  prefix?: string;
  className?: string;
};

export function CountdownText({
  isoDate,
  prefix,
  className,
}: CountdownTextProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const { text, expired } = getCountdownInfo(isoDate, now);

  return (
    <span className={cn('countdown-text', expired && 'is-expired', className)}>
      {prefix ? `${prefix} ${text}` : text}
    </span>
  );
}
