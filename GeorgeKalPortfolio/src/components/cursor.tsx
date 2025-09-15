import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dot   = useRef<HTMLDivElement>(null);  
  const ring  = useRef<HTMLDivElement>(null); 
  const inBtn = useRef(false);                 

  /* — 1.  inner dot — */
  useEffect(() => {
    if (!dot.current) return;
    const moveDot = (e: MouseEvent) =>
      (dot.current!.style.transform =
        `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`);
    window.addEventListener('mousemove', moveDot);
    return () => window.removeEventListener('mousemove', moveDot);
  }, []);

  /* — 2.  outer ring follow‑or‑frame logic — */
  useEffect(() => {
    if (!ring.current) return;

    const idleSize = 32;

    /** track pointer only when NOT over a button */
    const moveRing = (e: MouseEvent) => {
      if (!inBtn.current) {
        ring.current!.style.transform =
          `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }

      // Check what element is under the cursor
      const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      if (target) {
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          // For input fields, enlarge the ring
          const ringEl = ring.current!;
          const newSize = idleSize * 1.25;
          ringEl.style.width = `${newSize}px`;
          ringEl.style.height = `${newSize}px`;
          ringEl.style.borderRadius = '9999px';
        } else if (target.tagName === 'BUTTON') {
          // Handle button hover
          target.style.cursor = 'none';
          inBtn.current = true;

          const r = target.getBoundingClientRect();
          const ringEl = ring.current!;
          ringEl.style.width = `${r.width}px`;
          ringEl.style.height = `${r.height}px`;
          ringEl.style.borderRadius = '10px';
          ringEl.style.transform =
            `translate(${r.x + r.width / 2}px, ${r.y + r.height / 2}px)
            translate(-50%, -50%)`;
        } else if ((target.tagName === 'A' && !target.classList.contains('no-cursor-enlarge')) || target.classList.contains('cursor-enlarge')) {
          const ringEl = ring.current!;
          const newSize = idleSize * 1.25;
          ringEl.style.width = `${newSize}px`;
          ringEl.style.height = `${newSize}px`;
          ringEl.style.borderRadius = '9999px';
        } else {
          // Reset to normal for other elements
          const ringEl = ring.current!;
          ringEl.style.width = `${idleSize}px`;
          ringEl.style.height = `${idleSize}px`;
          ringEl.style.borderRadius = '9999px';
        }
      }
    };

    window.addEventListener('mousemove', moveRing);   // pointer follow
    return () => {
      window.removeEventListener('mousemove', moveRing);
    };
  }, []);

  /* — 3.  render both layers — */
  return (
    <div className="pointer-events-none fixed inset-0 z-1000">
      <div
        ref={ring}
        className="absolute border-2 border-white rounded-full transition-[width,height,border-radius] duration-130 ease-in-out"
        style={{ width: 32, height: 32, transform: 'translate(-50%,-50%)' }}
      />
      <div
        ref={dot}
        className="absolute w-2 h-2 bg-white rounded-full"
        style={{ transform: 'translate(-50%,-50%)' }}
      />
    </div>
  );
}
