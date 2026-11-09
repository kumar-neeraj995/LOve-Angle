"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface CursorTrail {
  id: number;
  x: number;
  y: number;
}

export default function CustomCursor() {
  const [trail, setTrail] = useState<CursorTrail[]>([]);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Only enable on real pointer / mouse devices (Desktop / Laptop).
    // Touch devices (iPhone, iPad, Android phones & tablets) will skip this entirely.
    if (typeof window !== "undefined") {
      const isFinePointer = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
      if (!isFinePointer) return;
      setEnabled(true);
    }

    let idCounter = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      // Only add trail item occasionally to prevent memory/render pressure
      if (Math.random() > 0.6) {
        setTrail((prev) => [
          ...prev.slice(-10), // Keep max 10 particles
          { id: idCounter++, x: e.clientX, y: e.clientY },
        ]);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Slowly clean up trail particles
  useEffect(() => {
    if (!enabled || trail.length === 0) return;
    const interval = setInterval(() => {
      setTrail((prev) => prev.slice(1));
    }, 120);
    return () => clearInterval(interval);
  }, [enabled, trail]);

  if (!enabled) return null;

  return (
    <>
      {/* The main custom cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50 text-pink-400 drop-shadow-[0_0_8px_rgba(255,183,197,0.8)] mix-blend-difference"
        animate={{
          x: mousePos.x - 12,
          y: mousePos.y - 12,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.08 }}
      >
        <Heart size={24} fill="currentColor" strokeWidth={0} />
      </motion.div>

      {/* The trailing hearts */}
      <AnimatePresence>
        {trail.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0.8, scale: 1, x: item.x - 8, y: item.y - 8 }}
            animate={{
              opacity: 0,
              scale: 0.2,
              y: item.y + 18,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-0 left-0 pointer-events-none z-40 text-pink-300 drop-shadow-[0_0_5px_rgba(255,183,197,0.6)]"
          >
            <Heart size={14} fill="currentColor" strokeWidth={0} />
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}