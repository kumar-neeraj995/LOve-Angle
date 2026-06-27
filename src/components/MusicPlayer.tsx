"use client";

import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, SkipForward } from "lucide-react";

const PLAYLIST = [
  "/music/song1.webm",
  "/music/song2.webm",
  "/music/song3.webm"
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element once
    if (!audioRef.current) {
      audioRef.current = new Audio(PLAYLIST[0]);
      audioRef.current.loop = false;
      
      // Auto play next song when current finishes
      audioRef.current.addEventListener("ended", playNextSong);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", playNextSong);
        audioRef.current.pause();
      }
    };
  }, []);

  const playNextSong = () => {
    setCurrentSongIndex((prev) => {
      const nextIndex = (prev + 1) % PLAYLIST.length;
      if (audioRef.current) {
        audioRef.current.src = PLAYLIST[nextIndex];
        if (isPlaying) {
          audioRef.current.play().catch(console.error);
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
          console.error("Autoplay prevented:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  useEffect(() => {
    // Attempt autoplay on first interaction
    const handleInteraction = () => {
      if (!isPlaying && audioRef.current) {
        setIsPlaying(true);
      }
      document.removeEventListener("click", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);
    return () => document.removeEventListener("click", handleInteraction);
  }, [isPlaying]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const skipSong = (e: React.MouseEvent) => {
    e.stopPropagation();
    playNextSong();
    setIsPlaying(true); // Ensure it starts playing if it was paused
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3">
      {isPlaying && (
        <button
          onClick={skipSong}
          className="p-2 bg-white/20 backdrop-blur-md rounded-full shadow-lg border border-white/40 text-pink-600 hover:bg-white/40 transition-colors"
          aria-label="Next Song"
        >
          <SkipForward size={20} />
        </button>
      )}
      
      <button
        onClick={toggleMute}
        className="p-4 bg-white/30 backdrop-blur-md rounded-full shadow-[0_0_15px_rgba(255,183,197,0.5)] border border-pink-200 text-pink-600 hover:bg-white/50 transition-all hover:scale-105"
        aria-label="Toggle Music"
      >
        {isPlaying ? <Volume2 size={26} /> : <VolumeX size={26} />}
      </button>
    </div>
  );
}
