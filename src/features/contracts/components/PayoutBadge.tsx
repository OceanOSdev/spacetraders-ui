type PayoutBadgeProps = {
  label: string;
  amount: number;
};

export function PayoutBadge({ label, amount }: PayoutBadgeProps) {
  return (
    <div className='payout-badge'>
      <div className='payout-badge-label'>{label}</div>
      <div className='payout-badge-value'>{amount.toLocaleString()} cr</div>
    </div>
  );
}
