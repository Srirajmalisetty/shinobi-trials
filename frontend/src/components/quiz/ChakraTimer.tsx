import React, { useEffect, useState } from 'react';

interface ChakraTimerProps {
  initialSeconds?: number;
  expiresAt?: string; // Server-issued ISO expiry timestamp
  onTimeUp: () => void;
}

export const ChakraTimer: React.FC<ChakraTimerProps> = ({
  initialSeconds = 600,
  expiresAt,
  onTimeUp,
}) => {
  const calculateSecondsLeft = (): number => {
    if (expiresAt) {
      const expiryMs = Date.parse(expiresAt);
      const nowMs = Date.now();
      const diffSec = Math.floor((expiryMs - nowMs) / 1000);
      return Math.max(0, diffSec);
    }
    return initialSeconds;
  };

  const [secondsLeft, setSecondsLeft] = useState<number>(calculateSecondsLeft);
  const totalSeconds = initialSeconds > 0 ? initialSeconds : 600;

  useEffect(() => {
    // Immediate check
    const current = calculateSecondsLeft();
    setSecondsLeft(current);
    if (current <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      const remaining = calculateSecondsLeft();
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onTimeUp]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft < 60;

  const percentage = Math.min(100, Math.max(0, (secondsLeft / totalSeconds) * 100));
  const strokeDashoffset = 100 - percentage;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all ${
        isUrgent
          ? 'bg-red-950/60 border-red-500 text-red-300 animate-pulse shadow-[0_0_15px_rgba(230,57,70,0.5)]'
          : 'bg-surface-container-low border-[#28283d] text-primary'
      }`}
    >
      {/* Mini circular progress indicator */}
      <div className="relative w-7 h-7 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-[#28283d]"
            strokeWidth="3.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={isUrgent ? 'text-red-500' : 'text-primary-container'}
            strokeDasharray="100, 100"
            strokeDashoffset={strokeDashoffset}
            strokeWidth="3.5"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
          />
        </svg>
        <div className={`w-1.5 h-1.5 rounded-full ${isUrgent ? 'bg-red-400' : 'bg-tertiary'} absolute`}></div>
      </div>

      <div className="flex flex-col">
        <span className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
          {expiresAt ? 'Server Expiry' : 'Chakra Time'}
        </span>
        <span className="font-headline font-bold text-sm tracking-widest text-on-surface font-mono">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};
