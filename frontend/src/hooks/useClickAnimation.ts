import { useState, useEffect } from 'react';

export interface RippleEffect {
  id: number;
  x: number;
  y: number;
}

export const useClickAnimation = () => {
  const [ripples, setRipples] = useState<RippleEffect[]>([]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Target buttons or elements with data-chakra-btn or primary CTA classes
      const target = (e.target as HTMLElement)?.closest('button, [data-chakra-btn="true"], a.chakra-cta');
      if (!target) return;

      const newRipple: RippleEffect = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };

      setRipples((prev) => [...prev.slice(-4), newRipple]);

      // Remove ripple after 1.2s
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 1200);
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return { ripples };
};
