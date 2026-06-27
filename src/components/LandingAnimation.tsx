"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

interface LandingAnimationProps {
  onComplete: () => void;
}

export default function LandingAnimation({ onComplete }: LandingAnimationProps) {
  useEffect(() => {
    // Automatically transition to the proposal card after the intro
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.5, delay: 3, ease: "easeInOut" }}
      onAnimationComplete={() => onComplete()}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
          className="text-6xl md:text-8xl mb-4"
        >
          ✨
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] tracking-wider">
          A Magical Question...
        </h1>
      </motion.div>
    </motion.div>
  );
}
