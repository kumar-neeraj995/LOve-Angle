"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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

  return (
    <div className="min-h-screen bg-pink-50 p-6 flex flex-col items-center justify-center font-sans">
      {!data ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-pink-100 text-center"
        >
          <h1 className="text-3xl font-bold text-pink-600 mb-6">Admin Panel 🔒</h1>
          <p className="text-gray-500 mb-6">Enter password to view GF's response ❤️</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow transition-colors disabled:opacity-50"
            >
              {loading ? "Checking..." : "Unlock"}
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 md:p-8 rounded-3xl shadow-xl w-full max-w-4xl border border-pink-100"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-pink-600">Response Data 💌</h1>
            <button 
              onClick={() => setData(null)}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-bold"
            >
              Lock Again
            </button>
          </div>
          
          {data.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No responses found yet. Wait for her to say yes! ❤️
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-pink-50 text-pink-700">
                    <th className="p-4 border-b border-pink-100 font-semibold rounded-tl-xl">Instagram ID</th>
                    <th className="p-4 border-b border-pink-100 font-semibold">Phone Number</th>
                    <th className="p-4 border-b border-pink-100 font-semibold">Chocolate</th>
                    <th className="p-4 border-b border-pink-100 font-semibold rounded-tr-xl">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 border-b border-gray-100 font-medium text-gray-800">{item.instagram}</td>
                      <td className="p-4 border-b border-gray-100 font-medium text-gray-800">{item.phone}</td>
                      <td className="p-4 border-b border-gray-100 text-gray-600">{item.chocolate}</td>
                      <td className="p-4 border-b border-gray-100 text-sm text-gray-500">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
