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
    };

    /** pointer entered some element */
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON') {
        target.style.cursor = 'none';
        inBtn.current = true;

        const r = target.getBoundingClientRect();       // precise size/pos
        const ringEl = ring.current!;


        ringEl.style.width = `${r.width}px`;
        ringEl.style.height = `${r.height}px`;
        ringEl.style.borderRadius = '10px';              // ← only once
        ringEl.style.transform =
          `translate(${r.x + r.width / 2}px, ${r.y + r.height / 2}px)
          translate(-50%, -50%)`;
      } else if ((target.tagName === 'A' && !target.classList.contains('no-cursor-enlarge')) || target.classList.contains('cursor-enlarge')) {
        const ringEl = ring.current!;
        const newSize = idleSize * 1.25;
        ringEl.style.width = `${newSize}px`;
        ringEl.style.height = `${newSize}px`;
        ringEl.style.borderRadius = '9999px';
      }
    };

    /** pointer left the element it was over */
    const out = (e: MouseEvent) => {
      const btn = e.target as HTMLElement;
      if (btn.tagName === 'BUTTON') {
        btn.style.cursor = '';
        inBtn.current = false;
        const ringEl = ring.current!;
        ringEl.style.borderRadius = '9999px';        // one write
        ringEl.style.width        = `${idleSize}px`;
        ringEl.style.height       = `${idleSize}px`;
      } else if ((btn.tagName === 'A' && !btn.classList.contains('no-cursor-enlarge')) || btn.classList.contains('cursor-enlarge')) {
        // Reset ring size for regular links
        const ringEl = ring.current!;
        ringEl.style.width = `${idleSize}px`;
        ringEl.style.height = `${idleSize}px`;
        ringEl.style.borderRadius = '9999px';
      }

    };

    window.addEventListener('mousemove', moveRing);   // pointer follow
    window.addEventListener('mouseover',  over);      // snap to button
    window.addEventListener('mouseout',   out);       // back to idle
    return () => {
      window.removeEventListener('mousemove', moveRing);
      window.removeEventListener('mouseover',  over);
      window.removeEventListener('mouseout',   out);
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
