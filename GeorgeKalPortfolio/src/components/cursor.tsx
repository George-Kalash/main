import { useRef, useEffect, MouseEvent, MouseEventHandler } from 'react';

export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(()=> {
    const el = ref.current;
    if(!el) return;
    
    const handleMouseDown = (e: MouseEvent) => {
      el.style.height = `20px`;
      el.style.width = `20px`;
    };

    const handleMouseUp = (e: MouseEvent) => {
      el.style.height = `32px`;
      el.style.width = `31px`;
    }

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown); 
      window.removeEventListener('mouseup', handleMouseUp); 
    }
  });

  return (
    <div
			id='newCursor'
      ref={ref}
      className="fixed pointer-events-none size-8"
      style={{
        transform: 'translate(-50%, -50%)',
        willChange: 'transform',
      }}
    >
      {/* Outer (larger) circle */}
      <div
        className="w-full h-full border-2 rounded-full border-black"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      {/* Inner (smaller) dot */}
      <div
        className="size-1 bg-black rounded-full absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
}
