import { Selector } from '../../../components/ui/Selector';

type ShipOption = {
  value: string;
  label: string;
};

type ShipSelectorProps = {
  options: ShipOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function ShipSelector({
  options,
  value,
  onChange,
  placeholder = 'Select ship',
  disabled = false,
}: ShipSelectorProps) {
  return (
    <Selector
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      emptyMessage='No ships available'
    />
  );
}
