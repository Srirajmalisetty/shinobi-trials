import React, { useEffect, useRef, useState } from 'react';
import { useSound } from '../../context/SoundContext';

export interface SceneVideoPlayerProps {
  src: string;
  onComplete: () => void;
  skippable?: boolean;
}

export const SceneVideoPlayer: React.FC<SceneVideoPlayerProps> = ({
  src,
  onComplete,
  skippable = true,
}) => {
  const { isMuted, toggleMute, setIsVideoPlaying } = useSound();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showSkip, setShowSkip] = useState<boolean>(false);
  const [needsUserPlay, setNeedsUserPlay] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const completedRef = useRef<boolean>(false);

  const handleFinish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsVideoPlaying(false);
    onComplete();
  };

  useEffect(() => {
    setIsVideoPlaying(true);
    return () => {
      setIsVideoPlaying(false);
    };
  }, [setIsVideoPlaying]);

  useEffect(() => {
    if (!skippable) return;
    const timer = setTimeout(() => {
      setShowSkip(true);
    }, 600);

    return () => clearTimeout(timer);
  }, [skippable]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;

    const startPlayback = async () => {
      try {
        await video.play();
        setIsPlaying(true);
        setNeedsUserPlay(false);
      } catch (err) {
        // Autoplay with audio was likely prevented by browser policy, try muted
        try {
          video.muted = true;
          await video.play();
          setIsPlaying(true);
          setNeedsUserPlay(false);
        } catch (mutedErr) {
          // Both unmuted and muted autoplay were restricted; prompt user gesture
          console.warn('Autoplay restricted by browser policy; waiting for user gesture', mutedErr);
          setNeedsUserPlay(true);
        }
      }
    };

    startPlayback();
  }, [src]);

  // Sync mute changes with video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleUserTriggeredPlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    video.play()
      .then(() => {
        setIsPlaying(true);
        setNeedsUserPlay(false);
      })
      .catch((err) => {
        console.error('Failed to play after user gesture:', err);
        handleFinish();
      });
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black select-none overflow-hidden cursor-pointer"
      onClick={() => {
        if (needsUserPlay) {
          handleUserTriggeredPlay();
        }
      }}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        playsInline
        preload="auto"
        muted={isMuted}
        onPlay={() => setIsPlaying(true)}
        onEnded={handleFinish}
        onError={(e) => {
          console.error('Scene video playback error:', e);
          handleFinish();
        }}
        className="w-full h-full object-cover"
      />

      {/* User interaction prompt if browser blocked autoplay */}
      {needsUserPlay && (
        <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-container to-[#ff8c42] flex items-center justify-center text-white shadow-[0_0_40px_rgba(255,107,26,0.8)] mb-6 animate-pulse">
            <span className="material-symbols-outlined text-4xl ml-1">play_arrow</span>
          </div>
          <h2 className="font-headline font-black text-2xl sm:text-3xl text-white uppercase tracking-wider mb-2">
            Shinobi Cinematic
          </h2>
          <p className="font-body text-sm sm:text-base text-white/80 max-w-md mb-6">
            Click anywhere or tap the seal below to begin the Leaf Academy initiation scroll.
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleUserTriggeredPlay();
            }}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-container to-[#ff8c42] hover:brightness-110 text-white font-label font-bold text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(255,107,26,0.6)] transition-all"
          >
            Unseal Cinematic
          </button>
        </div>
      )}

      {/* Audio Mute/Unmute Overlay Control */}
      <div className="absolute top-6 right-6 z-40 flex items-center gap-3 pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          className="p-3 rounded-full bg-black/70 hover:bg-black text-white/90 hover:text-white border border-white/20 backdrop-blur-md shadow-lg transition-all"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          <span className="material-symbols-outlined text-base">
            {isMuted ? 'volume_off' : 'volume_up'}
          </span>
        </button>

        {/* Skip Button */}
        {skippable && (showSkip || isPlaying) && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleFinish();
            }}
            className="px-5 py-2.5 rounded-xl bg-black/80 hover:bg-[#ff6b1a] text-white border border-[#ff6b1a]/60 text-xs font-label uppercase tracking-widest font-bold flex items-center gap-2 backdrop-blur-md shadow-[0_0_20px_rgba(255,107,26,0.5)] transition-all duration-300 transform hover:scale-105"
          >
            <span>Skip</span>
            <span className="material-symbols-outlined text-sm">fast_forward</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SceneVideoPlayer;
