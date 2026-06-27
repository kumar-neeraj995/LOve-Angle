"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProposalCardProps {
  onYesClick: () => void;
}

export default function ProposalCard({ onYesClick }: ProposalCardProps) {
  const [noHoverCount, setNoHoverCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [showNiceTry, setShowNiceTry] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate Yes button size and glow based on failed "No" attempts
  const yesScale = 1 + noHoverCount * 0.15;
  const yesGlow = noHoverCount > 0 ? `0 0 ${10 + noHoverCount * 5}px rgba(255, 77, 77, 0.8)` : "none";

  const moveNoButton = () => {
    setNoHoverCount((prev) => prev + 1);
    
    // Calculate random position within constraints
    // Using smaller distances so it doesn't fly off screen
    const maxDistanceX = 100;
    const maxDistanceY = 80;
    
    // Ensure it moves away from current position
    let newX = (Math.random() - 0.5) * maxDistanceX * 2;
    let newY = (Math.random() - 0.5) * maxDistanceY * 2;
    
    // Push it further if it's too close to 0
    if (Math.abs(newX) < 30) newX = newX > 0 ? 50 : -50;
    if (Math.abs(newY) < 30) newY = newY > 0 ? 40 : -40;
    
    setNoPosition({ x: newX, y: newY });
  };

  const handleNoClick = () => {
    setShowNiceTry(true);
    moveNoButton();
    setTimeout(() => setShowNiceTry(false), 2000);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-white/95 backdrop-blur-xl p-8 md:p-12 rounded-[40px] max-w-xl w-[90%] mx-auto text-center relative z-20 flex flex-col items-center shadow-[0_10px_50px_rgba(255,105,180,0.5)] border-4 border-pink-300"
    >
      {/* Teddy Bears with blinking heart */}
      <div className="w-48 h-48 md:w-64 md:h-64 relative mb-8 rounded-full overflow-hidden border-8 border-pink-200 shadow-[0_0_20px_rgba(255,183,197,0.8)] mx-auto bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center text-7xl md:text-8xl">
        <div className="flex items-center gap-1">
          <span className="scale-x-[-1] animate-pulse">🧸</span>
          <span className="text-4xl text-red-500 animate-ping absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">❤️</span>
          <span className="text-4xl text-red-500 absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">❤️</span>
          <span className="animate-pulse">🧸</span>
        </div>
      </div>

      <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-red-600 via-pink-500 to-red-500 bg-clip-text text-transparent drop-shadow-md">
        Will You Be My Girlfriend? ❤️
      </h1>
      
      <p className="text-lg md:text-xl text-red-900/80 font-semibold mb-12 px-4 leading-relaxed">
        I really love you and want to spend beautiful moments with you.
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative min-h-[120px] w-full">
        {/* YES BUTTON */}
        <motion.button
          animate={{
            scale: yesScale,
            boxShadow: yesGlow,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          onClick={onYesClick}
          className="relative px-10 py-5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-extrabold text-2xl rounded-full shadow-[0_10px_30px_rgba(255,77,77,0.6)] hover:shadow-[0_15px_40px_rgba(255,77,77,0.8)] hover:-translate-y-1 active:translate-y-0 transition-all overflow-hidden z-10"
        >
          <motion.div
            className="absolute inset-0 bg-white/30 skew-x-[45deg]"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 3 }}
          />
          ❤️ YES! ❤️
        </motion.button>

        {/* NO BUTTON */}
        <motion.button
          animate={{
            x: noPosition.x,
            y: noPosition.y,
            scale: noHoverCount > 0 ? 0.9 : 1,
            rotate: noPosition.x ? (Math.random() - 0.5) * 20 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          onHoverStart={moveNoButton}
          onClick={handleNoClick}
          style={{ position: noHoverCount > 0 ? "absolute" : "relative" }}
          className="px-8 py-4 bg-gray-100 backdrop-blur-md text-gray-500 font-bold text-xl rounded-full shadow border-2 border-gray-300 hover:bg-gray-200 transition-colors z-30"
        >
          💔 No
        </motion.button>
      </div>

      {/* Playful Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: showNiceTry ? 1 : 0, y: showNiceTry ? 0 : 10 }}
        className="absolute bottom-6 text-pink-600 font-bold text-lg bg-pink-100 px-6 py-2 rounded-full shadow-lg border border-pink-300"
      >
        Nice try 😜 You can't reject me that easily ❤️
      </motion.div>
    </motion.div>
  );
}
