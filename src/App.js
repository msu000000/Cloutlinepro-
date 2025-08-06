import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HookGenerator from "./HookGenerator";
import ResultPage from "./ResultPage";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import LoginPage from "./LoginPage";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-4">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Cloutline Pro</h1>
          {user && (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </header>

        <Routes>
          <Route path="/" element={user ? <HookGenerator /> : <LoginPage />} />
          <Route path="/result" element={user ? <ResultPage /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}
