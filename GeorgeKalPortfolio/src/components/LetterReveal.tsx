import React, { useEffect, useMemo, useState } from "react";
import Button from "./button";

type LetterRevealProps = {
  text: string;
  className?: string;
  charClass?: string;
  maxDelay?: number; // maximum random delay in ms
  duration?: number; // animation duration per char in ms
};

export default function LetterReveal({
  text,
  className = "",
  charClass = "inline-block",
  maxDelay = 700,
  duration = 300,
}: LetterRevealProps) {
  const [mounted, setMounted] = useState(false);

  // Respect reduced motion preference
  const prefersReduced = typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  // Precompute random delays once per mount for stable animation
  const delays = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < text.length; i++) {
      // keep spaces fast so whole word becomes readable
      const base = text[i] === " " ? Math.floor(Math.random() * Math.min(100, maxDelay / 4)) : Math.floor(Math.random() * maxDelay);
      out.push(base);
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    if (prefersReduced) {
      setMounted(true);
      return;
    }
    // small next-tick so CSS transitions apply
    const t = window.setTimeout(() => setMounted(true), 10);
    return () => window.clearTimeout(t);
  }, [prefersReduced]);

  return (
    <span aria-hidden={false} className={className}>
      
      {text.split("").map((ch, i) => {
        const delay = delays[i] ?? 0;
        const style: React.CSSProperties = prefersReduced
          ? { opacity: 1, transform: "none" }
          : {
              transition: `opacity ${duration}ms cubic-bezier(.2,.8,.2,1) ${delay}ms, transform ${duration}ms cubic-bezier(.2,.8,.2,1) ${delay}ms`,
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0) scale(1)" : "translateY(8px) scale(.98)",
              willChange: "opacity, transform",
            };

        // preserve whitespace visually
        if (ch === " ") {
          return (
            <span key={i} className={`${charClass} align-middle`} style={style}>
              &nbsp;
            </span>
          );
        }

        return (
          <span key={i} className={`${charClass} align-middle`} style={style}>
            {ch}
          </span>
        );
      })}
     
    </span>
  );
}
