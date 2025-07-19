import { useOverrideCursor } from './useOverrideCursor';

export default function Button({
  children,
  className = '',
  onClick,
  hoverCursor = 'pointer',        // could also be 'crosshair', 'wait', 'url(/fancy.svg), auto', etc.
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverCursor?: string;
}) {
  const { onEnter, onLeave } = useOverrideCursor(hoverCursor);

  return (
    <button
      className={`bg-blue-500 text-white font-bold py-2 px-4 rounded ${className}`}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {children}
    </button>
  );
}
