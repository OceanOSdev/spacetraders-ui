type TelemetryBarProps = {
  label: string
  value: number
  max: number
  color?: 'cyan' | 'green' | 'amber'
}

export function TelemetryBar({
  label,
  value,
  max,
  color = 'cyan',
}: TelemetryBarProps) {
  const percent = max === 0 ? 0 : Math.round((value / max) * 100);

  return (
    <div className='telemetry'>
      <div className='telemetry-header'>
        <span className='telemetry-label'>{label}</span>
        <span className='telemetry-value'>
          {value} / {max}
        </span>
      </div>

      <div className={`telemetry-bar telemetry-${color}`}>
        <div
          className='telemetry-fill'
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
