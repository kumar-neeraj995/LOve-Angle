"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, SkipForward, Music } from "lucide-react";

// Use MP3 for 100% universal compatibility across iOS (iPhone, iPad), Android, and Desktop
const PLAYLIST = [
  "/music/song1.mp3",
  "/music/song2.mp3",
  "/music/song3.mp3",
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element once
    if (!audioRef.current) {
      const audio = new Audio(PLAYLIST[0]);
      audio.preload = "auto";
      audio.loop = false;
      audioRef.current = audio;

      const handleEnded = () => {
        playNextSong();
      };

      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("ended", handleEnded);
        audio.pause();
      };
    }
  }, []);

  const playNextSong = () => {
    setCurrentSongIndex((prev) => {
      const nextIndex = (prev + 1) % PLAYLIST.length;
      if (audioRef.current) {
        audioRef.current.src = PLAYLIST[nextIndex];
        if (isPlaying) {
          audioRef.current.play().catch(() => {});
        }
      }
      return nextIndex;
    });
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn("Audio autoplay blocked by browser:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  // Audio unlock on user touch/click for Apple iOS and Android policies
  useEffect(() => {
    const unlockAudio = () => {
      if (!isPlaying && audioRef.current) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
      // Remove listeners once triggered
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("touchend", unlockAudio);
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("touchstart", unlockAudio, { passive: true });
    window.addEventListener("touchend", unlockAudio, { passive: true });
    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("click", unlockAudio);

    return () => {
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("touchend", unlockAudio);
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("click", unlockAudio);
    };
  }, [isPlaying]);

  const toggleMute = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setIsPlaying((prev) => !prev);
  };

  const skipSong = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    playNextSong();
    setIsPlaying(true);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3 select-none">
      {isPlaying && (
        <button
          onClick={skipSong}
          onTouchEnd={skipSong}
          className="p-2.5 sm:p-3 bg-white/70 hover:bg-white/90 active:scale-95 backdrop-blur-md rounded-full shadow-md border border-pink-200 text-pink-600 transition-all cursor-pointer"
          aria-label="Next Song"
          title="Next Song"
        >
          <SkipForward size={18} className="sm:w-5 sm:h-5" />
        </button>
      )}

      <button
        onClick={toggleMute}
        onTouchEnd={toggleMute}
        className={`p-3 sm:p-4 rounded-full backdrop-blur-md shadow-lg border transition-all cursor-pointer active:scale-95 flex items-center justify-center ${
          isPlaying
            ? "bg-white/80 border-pink-300 text-pink-600 shadow-[0_0_20px_rgba(255,182,193,0.7)] animate-pulse"
            : "bg-white/60 border-pink-100 text-pink-400 hover:bg-white/80"
        }`}
        aria-label="Toggle Music"
        title={isPlaying ? "Mute Music" : "Play Music"}
      >
        {isPlaying ? (
          <Volume2 size={22} className="sm:w-6 sm:h-6" />
        ) : (
          <VolumeX size={22} className="sm:w-6 sm:h-6" />
        )}
      </button>
    </div>
  );
}