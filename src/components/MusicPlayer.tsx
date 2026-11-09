"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, SkipForward } from "lucide-react";

// Original romantic songs
const PLAYLIST = [
  "/music/song1.webm",
  "/music/song2.webm",
  "/music/song3.webm"
];

// Helper: If device cannot play webm (like some Safari/iOS versions), use the exact mp3 fallback
function getSongUrl(url: string) {
  if (typeof window !== "undefined") {
    const a = document.createElement("audio");
    if (!a.canPlayType('audio/webm') && a.canPlayType('audio/mpeg')) {
      return url.replace(".webm", ".mp3");
    }
  }
  return url;
}

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element with original song
    if (!audioRef.current) {
      const initialSrc = getSongUrl(PLAYLIST[0]);
      audioRef.current = new Audio(initialSrc);
      audioRef.current.loop = false;
      
      const onEnded = () => {
        playNextSong();
      };

      audioRef.current.addEventListener("ended", onEnded);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("ended", onEnded);
          audioRef.current.pause();
        }
      };
    }
  }, []);

  const playNextSong = () => {
    setCurrentSongIndex((prev) => {
      const nextIndex = (prev + 1) % PLAYLIST.length;
      if (audioRef.current) {
        audioRef.current.src = getSongUrl(PLAYLIST[nextIndex]);
        if (isPlaying) {
          audioRef.current.play().catch(() => {});
        }
      }
      return nextIndex;
    });
  };

  useEffect(() => {
    // Play or Pause based on state
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.log("Autoplay blocked, waiting for interaction:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  useEffect(() => {
    // Autoplay on first user interaction anywhere
    const handleFirstInteraction = () => {
      if (!isPlaying && audioRef.current) {
        setIsPlaying(true);
      }
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, [isPlaying]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying((prev) => !prev);
  };

  const skipSong = (e: React.MouseEvent) => {
    e.stopPropagation();
    playNextSong();
    setIsPlaying(true);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3 select-none">
      {isPlaying && (
        <button
          onClick={skipSong}
          className="p-2 sm:p-2.5 bg-white/70 hover:bg-white/90 active:scale-95 backdrop-blur-md rounded-full shadow-md border border-pink-200 text-pink-600 transition-all cursor-pointer"
          aria-label="Next Song"
          title="Next Song"
        >
          <SkipForward size={18} className="sm:w-5 sm:h-5" />
        </button>
      )}
      
      <button
        onClick={toggleMute}
        className={`p-3.5 sm:p-4 rounded-full backdrop-blur-md shadow-lg border transition-all cursor-pointer active:scale-95 flex items-center justify-center ${
          isPlaying
            ? "bg-white/80 border-pink-300 text-pink-600 shadow-[0_0_20px_rgba(255,182,193,0.7)] animate-pulse"
            : "bg-white/60 border-pink-100 text-pink-400 hover:bg-white/80"
        }`}
        aria-label="Toggle Music"
        title={isPlaying ? "Mute Music" : "Play Music"}
      >
        {isPlaying ? (
          <Volume2 size={24} className="sm:w-6 sm:h-6" />
        ) : (
          <VolumeX size={24} className="sm:w-6 sm:h-6" />
        )}
      </button>
    </div>
  );
}