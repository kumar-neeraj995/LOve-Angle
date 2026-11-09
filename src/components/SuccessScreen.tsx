"use client";

import { useEffect, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Sparkles, Send, Check } from "lucide-react";

export default function SuccessScreen() {
  const [step, setStep] = useState<"contact" | "chocolate" | "timer">("contact");
  const [instagram, setInstagram] = useState("");
  const [phone, setPhone] = useState("");
  const [chocolateChoice, setChocolateChoice] = useState("");
  const [customChocolate, setCustomChocolate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [timeSince, setTimeSince] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
    setError("");
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number ❤️");
      return;
    }
    if (!instagram.trim()) {
      setError("Please enter your Instagram ID ❤️");
      return;
    }
    setError("");
    setStep("chocolate");
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chocolateChoice) {
      setError("Please pick a chocolate! 🥺");
      return;
    }
    if (chocolateChoice === "Custom" && !customChocolate.trim()) {
      setError("Please write the name of your favorite chocolate! ❤️");
      return;
    }

    setLoading(true);
    setError("");

    const finalChocolate =
      chocolateChoice === "Custom" ? customChocolate.trim() : chocolateChoice;

    try {
      // 1. Browser → ntfy.sh directly (bypasses Vercel serverless network limits)
      const ntfyPromise = fetch("https://ntfy.sh/love-angel-neeraj-995", {
        method: "POST",
        headers: {
          "Title": "🎉 She Said YES! ❤️",
          "Priority": "urgent",
          "Tags": "tada,heart,confetti_ball",
          "Content-Type": "text/plain",
        },
        body: `Congratulations bhai! Aapki GF ne YES bol diya! 🥳\n\n📸 Instagram: ${instagram.trim()}\n📱 Phone: ${phone.trim()}\n🍫 Chocolate: ${finalChocolate}`,
      }).catch((err) => {
        console.warn("ntfy notice:", err);
      });

      // 2. Save to server (admin panel backup)
      const savePromise = fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instagram: instagram.trim(),
          phone: phone.trim(),
          chocolate: finalChocolate,
        }),
      }).catch((err) => {
        console.warn("Save notice:", err);
      });

      await Promise.allSettled([ntfyPromise, savePromise]);

      setStep("timer");
      triggerConfettiAndTimer();
    } catch (err) {
      setStep("timer");
      triggerConfettiAndTimer();
    } finally {
      setLoading(false);
    }
  };

  const triggerConfettiAndTimer = () => {
    const duration = 4.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 28,
      spread: 360,
      ticks: 50,
      zIndex: 100,
      disableForReducedMotion: true,
    };
    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      // Balanced particle count for smooth mobile 60fps
      const particleCount = Math.floor(35 * (timeLeft / duration));
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.15, 0.35), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.65, 0.85), y: Math.random() - 0.2 },
      });
    }, 280);

    const startTimeStr = Date.now().toString();
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("proposal_yes_time", startTimeStr);
      } catch (e) {}
    }
    const startTime = parseInt(startTimeStr, 10);

    const timerInterval = setInterval(() => {
      const now = Date.now();
      const difference = Math.max(0, now - startTime);
      setTimeSince({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);

    setTimeout(() => clearInterval(interval), duration);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="glass-dark p-5 sm:p-8 md:p-10 rounded-3xl max-w-lg md:max-w-xl w-full mx-auto text-center relative z-20 text-white overflow-hidden shadow-2xl border border-white/20 select-none"
    >
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="mb-2 sm:mb-4"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-pink-300 drop-shadow-[0_0_20px_rgba(255,183,197,0.85)] tracking-wide">
          Yayyyyy!! ❤️
        </h1>
      </motion.div>

      <p className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-pink-100">
        I knew you'd say YES!
      </p>

      {step !== "timer" && (
        <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-5 sm:mb-6 bg-white/15 rounded-full flex items-center justify-center border-2 sm:border-4 border-pink-300/40 shadow-[0_0_25px_rgba(255,183,197,0.35)] shrink-0">
          <span className="text-4xl sm:text-5xl animate-bounce">👩‍❤️‍👨</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "contact" && (
          <motion.div
            key="contact-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-7 border border-white/20 text-left"
          >
            <p className="text-sm sm:text-base text-pink-200 mb-5 font-medium text-center leading-relaxed">
              Now that you're mine... can I get your details so I can plan our first beautiful date? 🥺✨
            </p>

            <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-pink-100 ml-1">
                  Instagram ID
                </label>
                <input
                  type="text"
                  placeholder="@your_instagram_id"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="w-full px-4 sm:px-5 py-3.5 rounded-xl bg-white/20 border border-pink-300/30 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all text-base sm:text-lg touch-manipulation"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-pink-100 ml-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full px-4 sm:px-5 py-3.5 rounded-xl bg-white/20 border border-pink-300/30 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all text-base sm:text-lg tracking-wider touch-manipulation"
                  required
                />
              </div>

              {error && (
                <p className="text-red-300 text-xs sm:text-sm font-semibold mt-1 text-center bg-red-500/20 py-2 rounded-lg border border-red-400/30">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-3 w-full py-4 px-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 active:scale-95 text-white font-extrabold text-base sm:text-lg rounded-xl shadow-lg transition-all cursor-pointer text-center leading-snug touch-manipulation min-h-[50px]"
              >
                Continue to Next Step ❤️
              </button>
            </form>
          </motion.div>
        )}

        {step === "chocolate" && (
          <motion.div
            key="chocolate-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-7 border border-white/20 text-left"
          >
            <p className="text-sm sm:text-base text-pink-200 mb-4 sm:mb-5 font-medium text-center leading-relaxed">
              One last sweet question! What is your favorite chocolate? 🍫✨
            </p>

            <form onSubmit={handleFinalSubmit} className="flex flex-col gap-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {[
                  { id: "Dairy Milk", label: "🍫 Dairy Milk" },
                  { id: "Kit Kat", label: "🍬 Kit Kat" },
                  { id: "Custom", label: "✍️ Other" },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => {
                      setChocolateChoice(item.id);
                      setError("");
                    }}
                    className={`py-3.5 px-3 rounded-xl font-bold text-sm sm:text-base transition-all border cursor-pointer active:scale-95 touch-manipulation flex items-center justify-center gap-1.5 min-h-[48px] ${
                      chocolateChoice === item.id
                        ? "bg-pink-500/80 border-pink-300 text-white shadow-[0_0_15px_rgba(255,183,197,0.7)]"
                        : "bg-white/15 border-white/25 text-pink-100 hover:bg-white/25"
                    }`}
                  >
                    <span>{item.label}</span>
                    {chocolateChoice === item.id && (
                      <Check size={16} className="text-white" />
                    )}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {chocolateChoice === "Custom" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <input
                      type="text"
                      placeholder="Type your favorite chocolate name..."
                      value={customChocolate}
                      onChange={(e) => setCustomChocolate(e.target.value)}
                      className="w-full px-4 sm:px-5 py-3.5 rounded-xl bg-white/20 border border-pink-300/30 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all text-base sm:text-lg mt-2 touch-manipulation"
                      autoFocus
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <p className="text-red-300 text-xs sm:text-sm font-semibold mt-1 text-center bg-red-500/20 py-2 rounded-lg border border-red-400/30">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-3 w-full py-4 px-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 active:scale-95 text-white font-extrabold text-base sm:text-lg rounded-xl shadow-lg transition-all cursor-pointer text-center leading-snug touch-manipulation min-h-[50px] disabled:opacity-60"
              >
                {loading ? "Saving with love..." : "Lock In Forever 💌"}
              </button>
            </form>
          </motion.div>
        )}

        {step === "timer" && (
          <motion.div
            key="timer"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-5 sm:mb-6 text-pink-200">
              ❤️ Forever Starts Today ❤️
            </h2>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 w-full">
              <p className="text-xs uppercase tracking-widest text-pink-200 mb-4 font-bold">
                Time Since You Said Yes
              </p>
              <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
                <TimeUnit value={timeSince.days} label="Days" />
                <TimeUnit value={timeSince.hours} label="Hours" />
                <TimeUnit value={timeSince.minutes} label="Mins" />
                <TimeUnit value={timeSince.seconds} label="Secs" />
              </div>
            </div>

            <p className="mt-5 sm:mt-6 text-xs sm:text-sm text-pink-200/80">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10">
      <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold tabular-nums text-pink-300">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-[10px] sm:text-xs uppercase tracking-wider text-pink-200/80 font-bold mt-1">
        {label}
      </div>
    </div>
  );
}