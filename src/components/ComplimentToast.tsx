"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const compliments = [
  "❤️ You're Beautiful",
  "❤️ You're Amazing",
  "❤️ You Make My World Better",
  "❤️ You Are My Favorite Person",
  "❤️ Your Smile Lights Up My Day",
  "❤️ I Love Your Laugh",
  "❤️ You're So Special To Me",
  "❤️ Pure Magic",
];

export default function ComplimentToast() {
  const [currentToast, setCurrentToast] = useState<{
    id: number;
    text: string;
  } | null>(null);

  useEffect(() => {
    let idCounter = 0;

    const interval = setInterval(() => {
      // 35% chance to show a compliment every 6 seconds
      if (Math.random() > 0.35) {
        const text =
          compliments[Math.floor(Math.random() * compliments.length)];

        setCurrentToast({ id: idCounter++, text });

        // Remove toast after 3 seconds
        setTimeout(() => {
          setCurrentToast(null);
        }, 3000);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-sm px-4 flex justify-center">
      <AnimatePresence>
        {currentToast && (
          <motion.div
            key={currentToast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="px-5 py-2 sm:py-2.5 bg-white/90 backdrop-blur-md text-pink-600 font-extrabold text-xs sm:text-sm rounded-full shadow-lg border border-pink-200 select-none text-center"
          >
            {currentToast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}