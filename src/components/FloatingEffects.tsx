"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Heart, Sparkles } from "lucide-react";

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
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    // Fewer particles on mobile for 60fps performance
    const count = isMobile ? 16 : 32;
    const starCount = isMobile ? 2 : 4;

    const newItems: FloatingItem[] = [];

    // Hearts & Sparkles
    for (let i = 0; i < count; i++) {
      newItems.push({
        id: i,
        x: Math.random() * 100,
        size: isMobile ? Math.random() * 12 + 10 : Math.random() * 18 + 10,
        duration: Math.random() * 8 + 8,
        delay: Math.random() * 4,
        type: Math.random() > 0.45 ? "heart" : "sparkle",
      });
    }

    // Shooting stars
    for (let i = count; i < count + starCount; i++) {
      newItems.push({
        id: i,
        x: Math.random() * 100,
        size: 12,
        duration: Math.random() * 2.5 + 2,
        delay: Math.random() * 12,
        type: "shooting-star",
      });
    }

    setItems(newItems);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
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
                x: `${item.x - 40}vw`,
                y: "110vh",
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: item.duration,
                delay: item.delay,
                repeat: Infinity,
                repeatDelay: Math.random() * 8 + 4,
                ease: "linear",
              }}
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_12px_2px_rgba(255,255,255,0.9)]" />
              <div className="w-14 h-[1.5px] bg-gradient-to-r from-transparent to-white -rotate-45 -translate-y-[1px] translate-x-1" />
            </motion.div>
          );
        }

        return (
          <motion.div
            key={item.id}
            className="absolute bottom-[-40px]"
            initial={{
              x: `${item.x}vw`,
              y: "0vh",
              opacity: 0,
              rotate: 0,
            }}
            animate={{
              y: "-115vh",
              opacity: [0, 0.75, 0.75, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              color: item.type === "heart" ? "#f472b6" : "#ffffff",
            }}
          >
            {item.type === "heart" ? (
              <Heart
                size={item.size}
                fill="currentColor"
                strokeWidth={0}
                className="opacity-75 drop-shadow-[0_0_6px_rgba(244,114,182,0.6)]"
              />
            ) : (
              <Sparkles
                size={item.size}
                fill="currentColor"
                strokeWidth={0}
                className="opacity-65 drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}