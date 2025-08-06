import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";

export default function HookGenerator() {
  const [topic, setTopic] = useState("");
  const [hook, setHook] = useState("");
  const [count, setCount] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const navigate = useNavigate();

  // Track daily usage in localStorage
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const stored = JSON.parse(localStorage.getItem("hookUsage") || "{}");
    if (stored.date !== today) {
      localStorage.setItem("hookUsage", JSON.stringify({ date: today, count: 0 }));
      setCount(0);
    } else {
      setCount(stored.count || 0);
    }
  }, []);

  // Simulate checking user Pro status (in real app use backend/payment)
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user?.email === "pro@user.com") {
        setIsPro(true);
      }
    });
  }, [auth]);

  const generateHook = async () => {
    if (!isPro && count >= 5) {
      alert("Free limit reached. Upgrade to Pro for unlimited hooks.");
      return;
    }
    if (!topic) {
      alert("Please enter a topic.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/generate", { topic });
      setHook(res.data.hook);

      // Update usage
      const today = new Date().toISOString().split("T")[0];
      const stored = JSON.parse(localStorage.getItem("hookUsage") || "{}");
      stored.date = today;
      stored.count = (stored.count || 0) + 1;
      localStorage.setItem("hookUsage", JSON.stringify(stored));
      setCount(stored.count);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const goToUpgrade = () => {
    navigate("/upgrade");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Hook Generator</h2>
      <input
        className="border p-2 w-full mb-4"
        type="text"
        placeholder="Enter your topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button
        className="bg-green-500 text-white px-4 py-2 rounded w-full mb-2"
        onClick={generateHook}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Hook"}
      </button>
      {hook && (
        <div className="bg-gray-100 p-4 mt-4 rounded">
          <p className="font-mono">{hook}</p>
        </div>
      )}
      <p className="text-sm mt-2">Daily usage: {count}/5</p>
      {!isPro && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4"
          onClick={goToUpgrade}
        >
          Upgrade to Pro
        </button>
      )}
    </div>
  );
}
