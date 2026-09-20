import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

import clickAudio from '../assets/sounds/click.mp3';
import correctAnswerAudio from '../assets/sounds/correct-answer.mp3';
import wrongAnswerAudio from '../assets/sounds/wrong-answer.mp3';
import submitAudio from '../assets/sounds/submit.mp3';
import certificateUnlockAudio from '../assets/sounds/certificate-unlock.mp3';
import scoreRevealAudio from '../assets/sounds/score-reveal.mp3';

export type SoundEffectType = 'click' | 'correct' | 'wrong' | 'submit' | 'unlock' | 'score';

const soundMap: Record<SoundEffectType, string> = {
  click: clickAudio,
  correct: correctAnswerAudio,
  wrong: wrongAnswerAudio,
  submit: submitAudio,
  unlock: certificateUnlockAudio,
  score: scoreRevealAudio,
};

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  isVideoPlaying: boolean;
  setIsVideoPlaying: (playing: boolean) => void;
  playSound: (type: SoundEffectType) => void;
  playClick: () => void;
  playCorrect: () => void;
  playIncorrect: () => void;
  playSubmit: () => void;
  playUnlock: () => void;
  playScore: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    return localStorage.getItem('shinobi_muted') === 'true';
  });

  const [isVideoPlaying, setIsVideoPlayingState] = useState<boolean>(false);
  const isVideoPlayingRef = useRef<boolean>(false);
  const audioPoolRef = useRef<Map<SoundEffectType, HTMLAudioElement>>(new Map());

  // Keep ref synchronized for instantaneous checks inside async/event callbacks
  const setIsVideoPlaying = (playing: boolean) => {
    isVideoPlayingRef.current = playing;
    setIsVideoPlayingState(playing);
  };

  // Preload sound elements on mount for instant fire-and-forget responsiveness
  useEffect(() => {
    Object.entries(soundMap).forEach(([key, src]) => {
      try {
        const audio = new Audio(src);
        audio.preload = 'auto';
        audioPoolRef.current.set(key as SoundEffectType, audio);
      } catch (_) {}
    });
  }, []);

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem('shinobi_muted', String(next));
      return next;
    });
  };

  const playSound = (type: SoundEffectType) => {
    if (isMuted) return;

    // Avoid audio overlap: if video is actively playing (opening, transition, victory, defeat),
    // do not play conflicting sound effects (especially submit and score)
    if (isVideoPlayingRef.current) {
      return;
    }

    try {
      const src = soundMap[type];
      if (!src) return;

      // Create a fresh lightweight audio instance to allow overlapping rapid clicks
      const audio = new Audio(src);
      audio.volume = type === 'click' ? 0.6 : 0.85;
      audio.play().catch(() => {});
    } catch (_) {}
  };

  const playClick = () => playSound('click');
  const playCorrect = () => playSound('correct');
  const playIncorrect = () => playSound('wrong');
  const playSubmit = () => playSound('submit');
  const playUnlock = () => playSound('unlock');
  const playScore = () => playSound('score');

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute,
        isVideoPlaying,
        setIsVideoPlaying,
        playSound,
        playClick,
        playCorrect,
        playIncorrect,
        playSubmit,
        playUnlock,
        playScore,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
