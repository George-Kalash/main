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
            "radial-gradient(1200px 500px at 50% -10%, rgb(39 43 219 / 44%), transparent), " +
            "radial-gradient(800px 400px at 80% 20%, rgb(16 185 129 / 46%), transparent), " +
            "radial-gradient(600px 300px at 20% 30%, rgb(56 189 248 / 38%), transparent)",
          transform: 'translateZ(0)'
        }}
      />
  );
}