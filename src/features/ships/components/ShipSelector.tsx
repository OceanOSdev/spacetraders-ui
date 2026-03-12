import { useEffect, useMemo, useRef, useState } from 'react';

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
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value == value) ?? null,
    [options, value],
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen || highlightedIndex < 0 || !listRef.current) return;

    const activeItem = listRef.current.querySelector<HTMLElement>(
      `[data-option-index='${highlightedIndex}']`,
    );

    activeItem?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex, isOpen]);

  function handleToggle() {
    if (disabled) return;
    setIsOpen((open) => !open);
  }

  function handleSelect(nextValue: string) {
    onChange(nextValue);
    setIsOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          return;
        }
        setHighlightedIndex((index) => Math.min(index + 1, options.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          return;
        }
        setHighlightedIndex((index) => Math.max(index - 1, 0));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          return;
        }
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          handleSelect(options[highlightedIndex].value);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsOpen(false);
        break;
    }
  }

  return (
    <div
      className={`ship-selector${disabled ? ' is-disabled' : ''}${isOpen ? ' is-open' : ''}`}
      ref={containerRef}
    >
      <button
        type='button'
        className='ship-selector-trigger'
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span
          className={`ship-selector-value${selectedOption ? '' : ' is-placeholder'}`}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <span className='ship-selector-chevron' aria-hidden='true'>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className='ship-selector-menu' role='listbox' ref={listRef}>
          {options.length === 0 ? (
            <div className='ship-selector-empty'>No ships available</div>
          ) : (
            options.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlightedIndex;

              return (
                <button
                  key={option.value}
                  type='button'
                  role='option'
                  aria-selected={isSelected}
                  data-option-index={index}
                  className={
                    `ship-selector-option` +
                    (isSelected ? ' is-selected' : '') +
                    (isHighlighted ? ' is-highlighted' : '')
                  }
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => handleSelect(option.value)}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <span className='ship-selector-check' aria-hidden='true'>
                      ✓
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
