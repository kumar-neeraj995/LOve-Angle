"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Heart, Sparkles, Star } from "lucide-react";

interface FloatingItem {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  type: "heart" | "sparkle" | "shooting-star";
}

export default function FloatingEffects() {
  const [items, setItems] = useState<FloatingItem[]>([]);

  useEffect(() => {
    const generateItems = () => {
      const newItems: FloatingItem[] = [];
      // Hearts & Sparkles
      for (let i = 0; i < 40; i++) {
        newItems.push({
          id: i,
          x: Math.random() * 100,
          size: Math.random() * 20 + 10,
          duration: Math.random() * 10 + 10,
          delay: Math.random() * 5,
          type: Math.random() > 0.4 ? "heart" : "sparkle",
        });
      }
      // Shooting stars
      for (let i = 40; i < 45; i++) {
        newItems.push({
          id: i,
          x: Math.random() * 100,
          size: Math.random() * 15 + 10,
          duration: Math.random() * 3 + 2, // fast
          delay: Math.random() * 15,
          type: "shooting-star",
        });
      }
      setItems(newItems);
    };

    generateItems();
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {items.map((item) => {
        if (item.type === "shooting-star") {
          return (
            <motion.div
              key={item.id}
              className="absolute top-[-50px] right-[-50px]"
              initial={{
                x: `${item.x}vw`,
                y: "-10vh",
                opacity: 0,
              }}
              animate={{
                x: `${item.x - 50}vw`,
                y: "110vh",
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: item.duration,
                delay: item.delay,
                repeat: Infinity,
                repeatDelay: Math.random() * 10 + 5,
                ease: "linear",
              }}
              style={{
                color: "#fff",
                filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 1))",
              }}
            >
              <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_15px_3px_rgba(255,255,255,0.8)]" />
              <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-white -rotate-45 -translate-y-[1px] translate-x-1" />
            </motion.div>
          );
        }

        return (
          <motion.div
            key={item.id}
            className="absolute bottom-[-50px]"
            initial={{
              x: `${item.x}vw`,
              y: "0vh",
              opacity: 0,
              rotate: 0,
            }}
            animate={{
              y: "-120vh",
              opacity: [0, 0.8, 0.8, 0],
              rotate: [0, 180, 360],
              x: [`${item.x}vw`, `${item.x + (Math.random() * 10 - 5)}vw`],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              color: item.type === "heart" ? "var(--color-romantic-pink)" : "#fff",
              filter: "drop-shadow(0 0 8px rgba(255, 183, 197, 0.8))",
            }}
          >
            {item.type === "heart" ? (
              <Heart size={item.size} fill="currentColor" strokeWidth={0} />
            ) : (
              <Sparkles size={item.size} fill="currentColor" strokeWidth={0} />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
