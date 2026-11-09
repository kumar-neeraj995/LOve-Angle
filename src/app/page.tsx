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
    // Easter Egg: Escape key on desktop
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
    <main className="min-h-[100dvh] w-full relative overflow-x-hidden overflow-y-auto flex items-center justify-center font-sans py-6 sm:py-10 px-3 sm:px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
      <Background />
      <FloatingEffects />
      
      {/* Auto-detects mouse vs touch internally */}
      <CustomCursor />

      <MusicPlayer />
      
      {stage !== "intro" && <ComplimentToast />}

      {/* Escape warning toast */}
      <AnimatePresence>
        {escapeWarning && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 bg-red-500/90 backdrop-blur-md text-white text-xs sm:text-sm px-5 py-2 rounded-full shadow-xl font-bold z-50 border border-white/20"
          >
            No escaping love ❤️
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Transitions */}
      <div className="w-full max-w-lg md:max-w-xl flex items-center justify-center relative z-20 my-auto">
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
      </div>
    </main>
  );
}