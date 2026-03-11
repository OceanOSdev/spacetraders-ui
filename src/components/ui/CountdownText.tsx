import { cn } from "../../utils/cn";
import { getCountdownInfo } from "../../utils/countdown";

type CountdownTextProps = {
  isoDate: string
  prefix?: string
  className?: string
}

export function CountdownText({ isoDate, prefix, className }: CountdownTextProps) {
  const { text, expired } = getCountdownInfo(isoDate);

  return (
    <span className={cn('countdown-text', expired && 'is-expired', className)}>
      {prefix ? `${prefix} ${text}` : text}
    </span >
  );
}
