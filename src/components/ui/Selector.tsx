import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';

type SelectorOption = {
  value: string;
  label: string;
};

type SelectorProps = {
  options: SelectorOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  emptyMessage?: string;
  className?: string;
};

export function Selector({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  disabled = false,
  emptyMessage = 'No options available',
  className = '',
}: SelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
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
    if (!isOpen || highlightedIndex < 0 || !listRef.current) {
      return;
    }

    const activeItem = listRef.current.querySelector<HTMLElement>(
      `[data-option-index='${highlightedIndex}']`,
    );

    activeItem?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex, isOpen]);

  // Reset highlightedIndex when menu closes
  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  function handleToggle() {
    if (disabled) return;
    setIsOpen((open) => !open);
  }

  function handleSelect(nextValue: string) {
    onChange(nextValue);
    setIsOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
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
      className={`selector${disabled ? ' is-disabled' : ''}${isOpen ? ' is-open' : ''}${
        className ? `${className}` : ''
      }`}
      ref={containerRef}
    >
      <button
        type='button'
        className='selector-trigger'
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span
          className={`selector-value${selectedOption ? '' : ' is-placeholder'}`}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <span className='selector-chevron' aria-hidden='true'>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className='selector-menu' role='listbox' ref={listRef}>
          {options.length === 0 ? (
            <div className='selector-empty'>{emptyMessage}</div>
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
                    `selector-option` +
                    (isSelected ? ' is-selected' : '') +
                    (isHighlighted ? ' is-highlighted' : '')
                  }
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => handleSelect(option.value)}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <span className='selector-check' aria-hidden='true'>
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
