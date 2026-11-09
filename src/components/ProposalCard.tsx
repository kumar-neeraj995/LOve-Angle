"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProposalCardProps {
  onYesClick: () => void;
}

const PLAYFUL_MESSAGES = [
  "Nice try 😜 You can't reject me that easily ❤️",
  "Are you sure? Think again! 🥺",
  "Oops, missed it! Try again 🏃‍♀️💨",
  "Wrong button! Look to the left 👉",
  "My heart only accepts YES! ❤️",
  "You're stuck with me forever! 🥰",
];

export default function ProposalCard({ onYesClick }: ProposalCardProps) {
  const [noHoverCount, setNoHoverCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [playfulMsg, setPlayfulMsg] = useState("");
  const [showNiceTry, setShowNiceTry] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect touch device (Android, iPhone, iPad, tablets)
    if (typeof window !== "undefined") {
      setIsTouchDevice(
        "ontouchstart" in window || navigator.maxTouchPoints > 0
      );
    }
  }, []);

  // Safe scaled Yes button, capped so it never breaks mobile screen width
  const yesScale = Math.min(1 + noHoverCount * 0.07, 1.25);
  const yesGlow =
    noHoverCount > 0
      ? `0 0 ${Math.min(12 + noHoverCount * 4, 30)}px rgba(255, 77, 77, 0.75)`
      : "none";

  const moveNoButton = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault?.();
    }

    setNoHoverCount((prev) => {
      const next = prev + 1;
      const msgIndex = (next - 1) % PLAYFUL_MESSAGES.length;
      setPlayfulMsg(PLAYFUL_MESSAGES[msgIndex]);
      setShowNiceTry(true);
      return next;
    });

    // Mobile-friendly safe distance constraints so button NEVER flies off-screen
    const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 640;
    const maxDistanceX = isSmallScreen ? 70 : 120;
    const maxDistanceY = isSmallScreen ? 50 : 80;

    let newX = (Math.random() - 0.5) * maxDistanceX * 2;
    let newY = (Math.random() - 0.5) * maxDistanceY * 2;

    // Minimum jump distance so it always dodges noticeably
    const minJump = isSmallScreen ? 35 : 50;
    if (Math.abs(newX) < minJump) newX = newX >= 0 ? minJump : -minJump;
    if (Math.abs(newY) < minJump) newY = newY >= 0 ? minJump : -minJump;

    setNoPosition({ x: Math.round(newX), y: Math.round(newY) });
  };

  const handleNoInteraction = (e: React.SyntheticEvent) => {
    moveNoButton(e);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-white/95 backdrop-blur-xl p-5 sm:p-8 md:p-10 rounded-3xl sm:rounded-[36px] max-w-lg md:max-w-xl w-full mx-auto text-center relative z-20 flex flex-col items-center shadow-[0_12px_45px_rgba(255,105,180,0.35)] border-2 sm:border-4 border-pink-200 select-none"
    >
      {/* Teddy Bears with beating heart */}
      <div className="w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 relative mb-4 sm:mb-6 rounded-full overflow-hidden border-4 sm:border-8 border-pink-200 shadow-[0_0_25px_rgba(255,183,197,0.7)] mx-auto bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center text-4xl sm:text-6xl md:text-7xl shrink-0">
        <div className="flex items-center gap-1 relative">
          <span className="scale-x-[-1] animate-pulse">🧸</span>
          <span className="text-2xl sm:text-3xl text-red-500 animate-ping absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            ❤️
          </span>
          <span className="text-2xl sm:text-3xl text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            ❤️
          </span>
          <span className="animate-pulse">🧸</span>
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2.5 sm:mb-3 bg-gradient-to-r from-red-600 via-pink-600 to-red-500 bg-clip-text text-transparent drop-shadow-sm leading-tight px-2">
        Will You Be My Girlfriend? ❤️
      </h1>

      <p className="text-sm sm:text-base md:text-lg text-red-900/80 font-medium mb-6 sm:mb-8 px-2 leading-relaxed max-w-md">
        I really love you and want to spend every beautiful moment with you.
      </p>

      {/* Button Area */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 relative min-h-[130px] sm:min-h-[110px] w-full max-w-md mx-auto">
        {/* YES BUTTON */}
        <motion.button
          animate={{
            scale: yesScale,
            boxShadow: yesGlow,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 14 }}
          onClick={onYesClick}
          className="relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-4.5 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 text-white font-extrabold text-xl sm:text-2xl rounded-full shadow-[0_8px_25px_rgba(255,77,77,0.55)] hover:shadow-[0_12px_35px_rgba(255,77,77,0.7)] active:scale-95 transition-all cursor-pointer overflow-hidden z-10 shrink-0 touch-manipulation"
        >
          <motion.div
            className="absolute inset-0 bg-white/30 skew-x-[45deg]"
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: "linear",
              repeatDelay: 2.5,
            }}
          />
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span>❤️</span>
            <span>YES!</span>
            <span>❤️</span>
          </span>
        </motion.button>

        {/* NO BUTTON - Playfully dodges on touch & mouse hover */}
        <motion.button
          animate={{
            x: noPosition.x,
            y: noPosition.y,
            scale: noHoverCount > 0 ? 0.95 : 1,
            rotate: noPosition.x ? (noPosition.x > 0 ? 8 : -8) : 0,
          }}
          transition={{ type: "spring", stiffness: 450, damping: 18 }}
          // Desktop hover
          onMouseEnter={handleNoInteraction}
          // Touch device events for iPhone, Android, and Tablets
          onTouchStart={handleNoInteraction}
          onPointerDown={handleNoInteraction}
          onClick={handleNoInteraction}
          style={{ position: noHoverCount > 0 ? "absolute" : "relative" }}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gray-100/90 backdrop-blur-md text-gray-600 font-bold text-base sm:text-lg rounded-full shadow border border-gray-300 hover:bg-gray-200 active:bg-gray-300 transition-colors z-30 touch-manipulation shrink-0 cursor-pointer select-none"
        >
          💔 No
        </motion.button>
      </div>

      {/* Playful Feedback Banner */}
      <div className="h-10 mt-3 flex items-center justify-center w-full">
        <AnimatePresence>
          {showNiceTry && playfulMsg && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="text-pink-600 font-bold text-xs sm:text-sm bg-pink-100/90 px-4 py-1.5 rounded-full border border-pink-200 shadow-sm inline-block"
            >
              {playfulMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}