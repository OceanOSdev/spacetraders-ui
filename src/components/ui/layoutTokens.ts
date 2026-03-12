export type GapSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export function getGapValue(
  gap: GapSize | string | undefined,
  fallback: string,
): string {
  if (!gap) {
    return fallback;
  }

  switch (gap) {
    case 'xs':
      return '0.35rem';
    case 'sm':
      return '0.75rem';
    case 'md':
      return '1rem';
    case 'lg':
      return '1.25rem';
    case 'xl':
      return '1.5rem';
    default:
      return gap;
  }
}
