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
  // Starry Night / Galaxy (For Dark Mode contrast)
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
    <div className="fixed inset-0 -z-20 w-full h-full overflow-hidden bg-black">
      <AnimatePresence>
        <motion.img
          key={index}
          src={backgroundImages[index]}
          alt="Romantic Background"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Overlays for readability based on Light/Dark mode */}
      <div 
        className={`absolute inset-0 transition-colors duration-1000 ${
          isDark ? "bg-black/60" : "bg-white/30"
        } backdrop-blur-[2px]`} 
      />

      {/* Animated Glowing Orbs for extra depth */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-pink-400/40 blur-[100px] pointer-events-none"
        animate={{
          x: [0, 100, 0],
          y: [0, 100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-400/40 blur-[120px] pointer-events-none"
        animate={{
          x: [0, -150, 0],
          y: [0, -100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}
