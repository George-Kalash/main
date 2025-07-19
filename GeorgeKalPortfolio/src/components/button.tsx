import React from 'react';
import { useHoverRect } from './useHoverRect';
export default function Button({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  // Only the hover‑enter/leave callbacks are required
  const { onEnter, onLeave } = useHoverRect();

  return (
    <button
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={` bg-blue-500 text-white px-4 py-2 rounded ${className}`}
    >
      {children}
    </button>
  );
}
