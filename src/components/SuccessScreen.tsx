"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

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
      setError("Please tell me which chocolate you want! ❤️");
      return;
    }

    setLoading(true);
    setError("");

    const finalChocolate = chocolateChoice === "Custom" ? customChocolate : chocolateChoice;

    try {
      const res = await fetch("https://formsubmit.co/ajax/kumarnk15122002@gmail.com", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: "🎉 WOO-HOO! SHE SAID YES! ❤️ (Proposal Response)",
          _template: "box",
          Instagram_ID: instagram,
          Phone_Number: phone,
          Favorite_Chocolate: finalChocolate,
          Message: "Congratulation Bhai! Aapki GF ne YES bol diya hai! ❤️🎉 Ab jaldi se date plan karo!",
        }),
      });

      if (res.ok) {
        setStep("timer");
        triggerConfettiAndTimer();
      } else {
        setError("Failed to connect. Please try again 🥺");
      }
    } catch (err) {
      setError("Could not connect. Please try again ❤️");
    } finally {
      setLoading(false);
    }
  };

  const triggerConfettiAndTimer = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    const startTimeStr = Date.now().toString();
    localStorage.setItem("proposal_yes_time", startTimeStr);
    const startTime = parseInt(startTimeStr, 10);

    const timerInterval = setInterval(() => {
      const now = Date.now();
      const difference = now - startTime;
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
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "backOut" }}
      className="glass-dark p-8 md:p-12 rounded-3xl max-w-2xl w-[95%] mx-auto text-center relative z-20 text-white overflow-hidden"
    >
      {/* Background Chocolates for Chocolate Step */}
      <AnimatePresence>
        {step === "chocolate" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -50, x: Math.random() * 800 - 400, rotate: 0 }}
                animate={{ y: 800, rotate: 360, x: Math.random() * 800 - 400 }}
                transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
                className="absolute text-4xl"
                style={{ left: "50%", top: "-10%" }}
              >
                {["🍫", "🍬", "🍩", "🍪", "🍭"][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        animate={{ scale: [1, 1.05, 1], rotate: [0, -2, 2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-pink-300 drop-shadow-[0_0_15px_rgba(255,183,197,0.8)]">
          Yayyyyy!! ❤️
        </h1>
      </motion.div>

      <p className="text-2xl md:text-3xl mb-8 font-semibold opacity-90 relative z-10">
        I knew you'd say YES!
      </p>

      {step !== "timer" && (
        <div className="w-40 h-40 md:w-56 md:h-56 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center border-4 border-pink-300/50 shadow-[0_0_30px_rgba(255,183,197,0.4)] overflow-hidden relative z-10">
          <div className="text-6xl animate-pulse">👩‍❤️‍👨</div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === "contact" && (
          <motion.div
            key="contact-form"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-10 border border-white/20 text-left relative z-10"
          >
            <p className="text-lg md:text-xl text-pink-200 mb-8 font-medium text-center">
              Now that you're mine... can I get your Instagram ID and Phone Number to plan our first beautiful date? 🥺✨
            </p>
            <form onSubmit={handleContactSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="block text-md font-semibold text-pink-100 ml-2">Instagram ID</label>
                <input
                  type="text"
                  placeholder="@your_beautiful_id"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full px-6 py-4 rounded-xl bg-white/20 border border-pink-300/30 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all text-lg"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="block text-md font-semibold text-pink-100 ml-2">Phone Number</label>
                <input
                  type="text"
                  placeholder="10-digit number"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full px-6 py-4 rounded-xl bg-white/20 border border-pink-300/30 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all tracking-wider text-lg"
                  required
                />
              </div>
              {error && <p className="text-red-300 text-sm font-medium mt-1 animate-bounce text-center">{error}</p>}
              <button
                type="submit"
                className="mt-6 w-full py-5 px-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold text-lg rounded-xl shadow-lg transition-transform hover:-translate-y-1 active:translate-y-0 text-center leading-snug"
              >
                Go to next step with your permission okay ❤️
              </button>
            </form>
          </motion.div>
        )}

        {step === "chocolate" && (
          <motion.div
            key="chocolate-form"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-left relative z-10"
          >
            <p className="text-lg md:text-xl text-pink-200 mb-6 font-medium text-center">
              One last important question! What is your favorite chocolate? 🍫✨
            </p>
            <form onSubmit={handleFinalSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {["Dairy Milk", "Kit Kat", "Custom"].map((choc) => (
                  <motion.button
                    type="button"
                    key={choc}
                    onClick={() => {
                      setChocolateChoice(choc);
                      setError("");
                    }}
                    animate={{
                      scale: chocolateChoice === choc ? 1.05 : 1,
                      boxShadow: chocolateChoice === choc ? "0 0 15px rgba(255, 183, 197, 0.8)" : "none",
                    }}
                    whileHover={{ scale: 1.02 }}
                    className={`py-4 rounded-xl font-bold transition-colors border-2 ${
                      chocolateChoice === choc
                        ? "bg-pink-500/50 border-pink-400 text-white animate-pulse"
                        : "bg-white/10 border-white/20 text-pink-100 hover:bg-white/20"
                    }`}
                  >
                    {choc === "Dairy Milk" ? "🍫 Dairy Milk" : choc === "Kit Kat" ? "🍬 Kit Kat" : "✍️ Write My Own"}
                  </motion.button>
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
                      placeholder="Type your favorite chocolate..."
                      value={customChocolate}
                      onChange={(e) => setCustomChocolate(e.target.value)}
                      className="w-full px-5 py-3 rounded-xl bg-white/20 border border-pink-300/30 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all mt-2"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {error && <p className="text-red-300 text-sm font-medium mt-1 animate-bounce text-center">{error}</p>}
              
              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold text-lg rounded-xl shadow-lg transition-transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending my love..." : "Submit 💌"}
              </button>
            </form>
          </motion.div>
        )}

        {step === "timer" && (
          <motion.div
            key="timer"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center relative z-10"
          >
            <h2 className="text-3xl font-bold mb-8 text-pink-200">
              ❤️ Forever Starts Today ❤️
            </h2>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 w-full">
              <p className="text-sm uppercase tracking-widest text-pink-200 mb-4 font-bold">
                Time Since You Said Yes
              </p>
              <div className="flex justify-center gap-4 md:gap-8 text-center">
                <TimeUnit value={timeSince.days} label="Days" />
                <TimeUnit value={timeSince.hours} label="Hours" />
                <TimeUnit value={timeSince.minutes} label="Minutes" />
                <TimeUnit value={timeSince.seconds} label="Seconds" />
              </div>
            </div>
            
            <p className="mt-8 text-sm opacity-60">
              {new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-3xl md:text-5xl font-bold tabular-nums w-12 md:w-20">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-xs md:text-sm uppercase tracking-wider opacity-70 mt-1">
        {label}
      </div>
    </div>
  );
}
