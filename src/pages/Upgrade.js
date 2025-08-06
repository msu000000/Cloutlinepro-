import React from "react";

export default function Upgrade() {
  const handlePayment = () => {
    // In real app integrate Stripe/PayPal
    window.location.href = "https://your-payment-link.com";
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-4">Upgrade to Pro</h2>
      <p className="mb-6">
        Unlock <strong>unlimited hooks</strong> for just $5/month.
      </p>
      <button
        className="bg-yellow-500 text-white px-6 py-3 rounded text-lg"
        onClick={handlePayment}
      >
        Go Pro Now
      </button>
    </div>
  );
}
