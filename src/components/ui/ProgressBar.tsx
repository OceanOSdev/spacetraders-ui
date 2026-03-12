type ProgressBarProps = {
  label: string;
  value: number;
  max: number;
  color?: 'cyan' | 'green' | 'amber';
  size?: 'sm' | 'md';
};

export function ProgressBar({
  label,
  value,
  max,
  color = 'cyan',
  size = 'sm',
}: ProgressBarProps) {
  const percent = max <= 0 ? 0 : Math.min(100, Math.round((value / max) * 100));

  return (
    <div className={`progress-block progress-${size}`}>
      <div className='progress-header'>
        <span className='progress-label'>{label}</span>
        <span className='progress-value'>
          {value} / {max} ({percent}%)
        </span>
      </div>

      <div className={`progress-bar progress-bar-${color}`}>
        <div className='progress-fill' style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
