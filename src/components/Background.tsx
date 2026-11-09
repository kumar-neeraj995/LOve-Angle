"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const backgroundImages = [
  // Taj Mahal (Symbol of Love)
  "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop",
  // Romantic Nature / Sunset
  "https://images.unsplash.com/photo-1518131333794-63309a6c9d08?q=80&w=2070&auto=format&fit=crop",
  // Cherry Blossoms
  "https://images.unsplash.com/photo-1494972308805-463bc619d34e?q=80&w=2073&auto=format&fit=crop",
  // Starry Night / Galaxy
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop",
];

export default function Background({ isDark = false }: { isDark?: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 12000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 -z-20 w-full h-full overflow-hidden bg-black select-none pointer-events-none">
      <AnimatePresence>
        <motion.img
          key={index}
          src={backgroundImages[index]}
          alt="Romantic Background"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 3.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Responsive readability overlays */}
      <div 
        className={`absolute inset-0 transition-colors duration-700 ${
          isDark ? "bg-black/65" : "bg-white/35"
        } backdrop-blur-[2px]`} 
      />

      {/* Subtle Glowing Orbs */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[50vw] sm:w-[35vw] h-[50vw] sm:h-[35vw] rounded-full bg-pink-400/30 blur-[60px] sm:blur-[100px] pointer-events-none"
        animate={{
          x: [0, 50, 0],
          y: [0, 50, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[60vw] sm:w-[40vw] h-[60vw] sm:h-[40vw] rounded-full bg-rose-400/30 blur-[70px] sm:blur-[110px] pointer-events-none"
        animate={{
          x: [0, -60, 0],
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}