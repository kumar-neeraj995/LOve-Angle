"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

interface LandingAnimationProps {
  onComplete: () => void;
}

export default function LandingAnimation({ onComplete }: LandingAnimationProps) {
  useEffect(() => {
    // Automatically transition after 3.5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      onClick={onComplete}
      role="button"
      tabIndex={0}
      aria-label="Tap to begin"
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md px-4 cursor-pointer select-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center max-w-lg mx-auto"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 6, -6, 0] }}
          transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
          className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]"
        >
          ✨
        </motion.div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-[0_0_25px_rgba(255,182,193,0.9)] tracking-wide leading-tight px-2">
          A Magical Question...
        </h1>

        <p className="mt-3 text-pink-200 text-sm sm:text-base font-medium">
          Just for you ❤️
        </p>

        {/* User-friendly tap-to-continue hint */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5], y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="mt-8 sm:mt-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 border border-white/25 text-white/90 text-xs sm:text-sm font-semibold backdrop-blur-sm"
        >
          <span>Tap anywhere to open</span>
          <span className="text-pink-300">❤️</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}