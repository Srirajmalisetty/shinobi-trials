import { useSound, SoundEffectType } from '../context/SoundContext';

export const useSoundEffect = () => {
  const sound = useSound();
  return {
    ...sound,
    playSound: sound.playSound,
  };
};

export type { SoundEffectType };
