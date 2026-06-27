"use client";

import { useState, useEffect } from "react";
import Background from "@/components/Background";
import FloatingEffects from "@/components/FloatingEffects";
import CustomCursor from "@/components/CustomCursor";
import LandingAnimation from "@/components/LandingAnimation";
import ProposalCard from "@/components/ProposalCard";
import SuccessScreen from "@/components/SuccessScreen";
import MusicPlayer from "@/components/MusicPlayer";
import ComplimentToast from "@/components/ComplimentToast";
import { AnimatePresence, motion } from "framer-motion";

type Stage = "intro" | "proposal" | "success";

export default function Home() {
  const [stage, setStage] = useState<Stage>("intro");
  const [escapeWarning, setEscapeWarning] = useState(false);

  useEffect(() => {
    // Easter Egg: Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEscapeWarning(true);
        setTimeout(() => setEscapeWarning(false), 3000);
      }
    };

    // Easter Egg: beforeunload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (stage !== "success") {
        e.preventDefault();
        e.returnValue = "Are you sure? Someone loves you ❤️";
        return "Are you sure? Someone loves you ❤️";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [stage]);

  return (
    <main className="min-h-screen w-full relative overflow-hidden flex items-center justify-center font-sans">
      <Background />
      <FloatingEffects />
      
      {/* Hide Custom Cursor on very small screens to avoid touch issues, but it's CSS hidden mostly. We just render it. */}
      <div className="hidden md:block">
        <CustomCursor />
      </div>

      <MusicPlayer />
      
      {stage !== "intro" && <ComplimentToast />}

      {/* Escape key easter egg warning */}
      <AnimatePresence>
        {escapeWarning && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded-full shadow-lg font-bold z-50"
          >
            No escaping love ❤️
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Transitions */}
      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <LandingAnimation key="intro" onComplete={() => setStage("proposal")} />
        )}
        
        {stage === "proposal" && (
          <ProposalCard key="proposal" onYesClick={() => setStage("success")} />
        )}
        
        {stage === "success" && (
          <SuccessScreen key="success" />
        )}
      </AnimatePresence>
    </main>
  );
}
