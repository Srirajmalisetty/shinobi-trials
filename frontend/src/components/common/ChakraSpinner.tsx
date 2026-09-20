import React from 'react';

interface ChakraSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const ChakraSpinner: React.FC<ChakraSpinnerProps> = ({
  size = 'md',
  label,
}) => {
  const sizeClasses = {
    sm: { container: 'w-8 h-8', ring: 'w-7 h-7', dot: 'w-1.5 h-1.5' },
    md: { container: 'w-14 h-14', ring: 'w-12 h-12', dot: 'w-2.5 h-2.5' },
    lg: { container: 'w-20 h-20', ring: 'w-18 h-18', dot: 'w-3.5 h-3.5' },
  }[size];

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses.container} relative flex items-center justify-center`}>
        {/* Continuous rotating orange-to-gold gradient ring */}
        <div
          className={`${sizeClasses.ring} rounded-full border-2 border-transparent border-t-[#ff6b1a] border-r-[#ffc93c] chakra-glow-orange animate-chakra-spin`}
        />
        {/* Glowing gold chakra center dot */}
        <div className={`absolute ${sizeClasses.dot} rounded-full bg-[#ffc93c] shadow-[0_0_8px_#ffc93c]`} />
      </div>
      {label && (
        <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant font-semibold">
          {label}
        </span>
      )}
    </div>
  );
};
