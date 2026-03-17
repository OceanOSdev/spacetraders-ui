type TelemetryBarProps = {
  label: string;
  value: number;
  max: number;
  color?: 'cyan' | 'green' | 'amber';
  warningThresholdPercent?: number;
  dangerThresholdPercent?: number;
  invertThresholds?: boolean;
  size?: 'sm' | 'md';
};

export function TelemetryBar({
  label,
  value,
  max,
  color = 'cyan',
  warningThresholdPercent,
  dangerThresholdPercent,
  invertThresholds = false,
  size = 'sm',
}: TelemetryBarProps) {
  const percent = max === 0 ? 0 : Math.round((value / max) * 100);

  let stateClass = '';

  const exceedsThreshold = (threshold: number) => {
    if (invertThresholds) {
      return percent >= threshold;
    }
    return percent <= threshold;
  };

  if (
    dangerThresholdPercent !== undefined &&
    exceedsThreshold(dangerThresholdPercent)
  ) {
    stateClass = ' telemetry-danger';
  } else if (
    warningThresholdPercent != undefined &&
    exceedsThreshold(warningThresholdPercent)
  ) {
    stateClass = ' telemetry-warning';
  }

  return (
    <div className={`telemetry telemetry-${size}`}>
      <div className='telemetry-header'>
        <span className='telemetry-label'>{label}</span>
        <span className='telemetry-value'>
          {value} / {max}
        </span>
      </div>

      <div className={`telemetry-bar telemetry-${color}${stateClass}`}>
        <div className='telemetry-fill' style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
