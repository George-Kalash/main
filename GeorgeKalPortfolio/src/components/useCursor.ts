import { useCallback } from 'react';
// useCursor.ts
type CursorState = 'default' | 'pointer' | 'custom';

export function useCursor() {
  const setCursor = useCallback((state: CursorState) => {
    switch (state) {
      case 'pointer':
        document.body.style.cursor = 'pointer';
        break;
      case 'custom':
        document.body.style.cursor = 'text'; // or your URL-cursor
        break;
      default:
        document.body.style.cursor = 'auto';
    }
  }, []);

  const handleMouseEnter = useCallback(
    (state: CursorState = 'pointer') => () => setCursor(state),
    [setCursor],
  );
  const handleMouseLeave = useCallback(() => setCursor('default'), [setCursor]);

  return { handleMouseEnter, handleMouseLeave };
}
