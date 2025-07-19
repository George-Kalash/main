import { useState, useCallback } from 'react';

export function useHoverRect() {
  const [rect, setRect] = useState<DOMRect | null>(null);

  const onEnter = useCallback(
    (e: React.MouseEvent<HTMLElement>) => setRect(e.currentTarget.getBoundingClientRect()),
    []
  );

  const onLeave = useCallback(() => setRect(null), []);

  return { rect, onEnter, onLeave };
}
