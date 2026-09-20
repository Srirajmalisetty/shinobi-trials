import React from 'react';
import { useSound } from '../../context/SoundContext';

export const SoundToggleButton: React.FC = () => {
  const { isMuted, toggleMute, playClick } = useSound();

  const handleToggle = () => {
    if (isMuted) {
      // About to unmute -> play click immediately
      toggleMute();
      setTimeout(playClick, 20);
    } else {
      toggleMute();
    }
  };

  return (
    <button
      onClick={handleToggle}
      type="button"
      title={isMuted ? 'Sound Muted (Click to Unmute)' : 'Sound Active (Click to Mute)'}
      className={`relative p-2 rounded-xl border transition-all duration-300 focus:outline-none flex items-center justify-center ${
        !isMuted
          ? 'bg-[#1c1c38] border-[#ffc93c] chakra-glow-gold text-[#ffc93c]'
          : 'bg-[#121224] border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20'
      }`}
    >
      {!isMuted ? (
        // Active sound speaker with radiating soundwaves
        <svg
          className="w-5 h-5 stroke-current stroke-2 fill-none"
          viewBox="0 0 24 24"
        >
          <polygon
            points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
            fill="currentColor"
          />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" strokeLinecap="round" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" strokeLinecap="round" />
        </svg>
      ) : (
        // Muted speaker with slash mark
        <svg
          className="w-5 h-5 stroke-current stroke-2 fill-none"
          viewBox="0 0 24 24"
        >
          <polygon
            points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
            fill="currentColor"
          />
          <line x1="23" y1="9" x2="17" y2="15" strokeLinecap="round" />
          <line x1="17" y1="9" x2="23" y2="15" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
};
