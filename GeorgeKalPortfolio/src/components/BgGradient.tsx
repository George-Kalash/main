import React from "react";
export default function BgGradient() {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          // keep the same layered radial gradients
          background:
            "radial-gradient(1200px 500px at 50% -10%, rgba(99,102,241,0.25), transparent)," +
            "radial-gradient(800px 400px at 80% 20%, rgba(16,185,129,0.25), transparent)," +
            "radial-gradient(600px 300px at 20% 30%, rgba(56,189,248,0.2), transparent)",
          // promote to its own layer to avoid being affected by parent transforms
          transform: 'translateZ(0)'
        }}
      />
  );
}