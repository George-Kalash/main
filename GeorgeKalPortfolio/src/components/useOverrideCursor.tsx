import { useCallback } from 'react';

export function useOverrideCursor(desired: string = 'pointer') {
  // onEnter: set cursor on the element AND <body> (body is optional)
  const onEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.cursor = desired;      // element‑level
    document.body.style.cursor = desired;        // global fallback
  }, [desired]);

  // onLeave: clean up
  const onLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.cursor = '';
    document.body.style.cursor = '';
  }, []);

  return { onEnter, onLeave };
}
