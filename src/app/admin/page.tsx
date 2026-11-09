"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Lock, Unlock, Heart, RefreshCw } from "lucide-react";

interface SavedData {
  instagram: string;
  phone: string;
  chocolate: string;
  timestamp: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState<SavedData[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const responseData = await res.json();
        setData(responseData.data);
      } else {
        const errData = await res.json();
        setError(errData.error || "Incorrect password");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const reloadData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const responseData = await res.json();
        setData(responseData.data);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center font-sans">
      <div className="w-full max-w-4xl mb-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-pink-600 hover:text-pink-700 bg-white/80 px-3.5 py-1.5 rounded-full shadow-sm border border-pink-200"
        >
          <ArrowLeft size={16} />
          Back to Proposal
        </Link>
      </div>

      {!data ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl w-full max-w-md border border-pink-200 text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center text-pink-500">
            <Lock size={28} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-pink-600 mb-2">
            Admin Panel 🔒
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mb-6">
            Enter your password to view GF's response ❤️
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 sm:px-5 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-base text-gray-800"
              required
            />
            {error && <p className="text-red-500 text-xs sm:text-sm font-semibold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-base rounded-xl shadow transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Checking..." : "Unlock Dashboard"}
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-md p-5 sm:p-8 rounded-3xl shadow-xl w-full max-w-4xl border border-pink-200"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-pink-100">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-pink-600 flex items-center gap-2">
                <span>Response Data</span>
                <Heart size={24} className="text-red-500 fill-red-500" />
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Total responses: {data.length}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={reloadData}
                disabled={loading}
                className="flex-1 sm:flex-initial px-3.5 py-2 bg-pink-100 text-pink-700 rounded-xl hover:bg-pink-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
                title="Refresh responses"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
              <button
                onClick={() => setData(null)}
                className="flex-1 sm:flex-initial px-3.5 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Lock size={14} />
                Lock
              </button>
            </div>
          </div>

          {data.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-4xl mb-3">💌</p>
              <p className="font-semibold text-base sm:text-lg">No responses found yet.</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">Wait for her to click YES and enter details! ❤️</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto rounded-2xl border border-pink-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-pink-100/70 text-pink-800 text-sm">
                      <th className="p-4 font-bold">Instagram ID</th>
                      <th className="p-4 font-bold">Phone Number</th>
                      <th className="p-4 font-bold">Favorite Chocolate</th>
                      <th className="p-4 font-bold">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-50 text-sm">
                    {data.map((item, index) => (
                      <tr key={index} className="hover:bg-pink-50/50 transition-colors">
                        <td className="p-4 font-semibold text-gray-900">
                          {item.instagram}
                        </td>
                        <td className="p-4 font-semibold text-gray-900">
                          <a
                            href={`tel:${item.phone}`}
                            className="text-pink-600 hover:underline"
                          >
                            {item.phone}
                          </a>
                        </td>
                        <td className="p-4 text-gray-700 font-medium">
                          {item.chocolate}
                        </td>
                        <td className="p-4 text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Friendly Card View for Android & iPhones */}
              <div className="md:hidden flex flex-col gap-3">
                {data.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl bg-pink-50/60 border border-pink-200 text-left flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-pink-500">
                        Response #{data.length - index}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Instagram:</span>
                      <span className="font-bold text-gray-900">{item.instagram}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Phone:</span>
                      <a
                        href={`tel:${item.phone}`}
                        className="font-bold text-pink-600 underline"
                      >
                        {item.phone}
                      </a>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Chocolate:</span>
                      <span className="font-bold text-gray-800">{item.chocolate}</span>
                    </div>

                    <div className="text-[11px] text-gray-400 text-right mt-1">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}