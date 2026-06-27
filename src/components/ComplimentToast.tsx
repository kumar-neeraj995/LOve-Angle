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
];

export default function ComplimentToast() {
  const [currentToast, setCurrentToast] = useState<{ id: number; text: string; top: string; left: string } | null>(null);

  useEffect(() => {
    let idCounter = 0;

    const interval = setInterval(() => {
      // 30% chance to show a compliment every 5 seconds
      if (Math.random() > 0.3) {
        const text = compliments[Math.floor(Math.random() * compliments.length)];
        
        // Random position on screen, keeping it somewhat centered
        const top = `${Math.random() * 60 + 20}%`;
        const left = `${Math.random() * 60 + 20}%`;

        setCurrentToast({ id: idCounter++, text, top, left });

        // Remove toast after 3 seconds
        setTimeout(() => {
          setCurrentToast(null);
        }, 3000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {currentToast && (
        <motion.div
          key={currentToast.id}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed pointer-events-none z-50 px-6 py-3 bg-white/70 backdrop-blur-md text-pink-600 font-bold rounded-full shadow-lg border border-pink-200"
          style={{ top: currentToast.top, left: currentToast.left, transform: "translate(-50%, -50%)" }}
        >
          {currentToast.text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
