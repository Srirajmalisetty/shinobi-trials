import React from 'react';
import { useClickAnimation } from '../../hooks/useClickAnimation';

export const ClickEffectOverlay: React.FC = () => {
  const { ripples } = useClickAnimation();

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ left: ripple.x, top: ripple.y }}
        >
          {/* Ring 1 (Outer Gold Shockwave) */}
          <span className="absolute -inset-8 rounded-full border-2 border-[#ffc93c] animate-ping opacity-60 pointer-events-none" />

          {/* Ring 2 (Mid Chakra Orange Surge) */}
          <span
            className="absolute -inset-5 rounded-full border-2 border-[#ff6b1a] shadow-[0_0_15px_#ff6b1a] pointer-events-none animate-pulse"
            style={{ animationDuration: '0.8s' }}
          />

          {/* Ring 3 (Core Radiant Chakra Dot) */}
          <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#ff6b1a] to-[#ffc93c] shadow-[0_0_10px_#ffc93c] opacity-90" />
        </div>
      ))}
    </div>
  );
};
