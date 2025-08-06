import React, { useState } from "react";

export default function HookGenerator() {
  const [topic, setTopic] = useState("");
  const [hooks, setHooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateHook = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      if (res.ok) {
        setHooks(data.hooks);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to server");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Hook Generator</h1>
      <input
        type="text"
        placeholder="Enter topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />
      <button
        onClick={generateHook}
        style={{ padding: "10px", marginLeft: "10px" }}
      >
        {loading ? "Generating..." : "Generate Hook"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {hooks.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Generated Hooks:</h2>
          <ul>
            {hooks.map((hook, index) => (
              <li key={index}>{hook}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
