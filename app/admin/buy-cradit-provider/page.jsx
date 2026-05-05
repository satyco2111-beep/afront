"use client";
import { useEffect, useState } from "react";

export default function ProviderCreditPage() {
  const [credit, setCredit] = useState("");
  const [loading, setLoading] = useState(false);
  const [providerId, setProviderId] = useState(null);
  const [currentCredit, setCurrentCredit] = useState("");
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function fetchProvider() {
      const cookieRes = await fetch("/api/cookies");
      const cookieData = await cookieRes.json();

      if (!cookieData.id) return;

      setProviderId(cookieData.id);
      setToken(cookieData.token);

      // get provider data
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/providers/provider/${cookieData.id}`
      );

      const data = await res.json();

      if (data?.provider) {
        setCurrentCredit(data.provider.cradit_value || "0");
      }
    }

    fetchProvider();
  }, []);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (document.getElementById("razorpay-checkout")) return resolve(true);
      const script = document.createElement("script");
      script.id = "razorpay-checkout";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePay = async () => {
    if (!credit) return;
    if (!token) {
      alert("Please login again.");
      return;
    }

    const ok = await loadRazorpay();
    if (!ok) {
      alert("Failed to load payment gateway");
      return;
    }

    setLoading(true);
    try {
      // 1) Create order on backend
      const createRes = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/payments/razorpay/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: credit }),
        }
      );
      const createData = await createRes.json();
      if (!createData.success) {
        alert(createData.message || "Failed to create order");
        return;
      }

      const { order, key_id } = createData;

      // 2) Open Razorpay Checkout
      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Buy Credit",
        description: "Provider credit purchase",
        order_id: order.id,
        handler: async function (response) {
          // 3) Verify payment + add credit
          const verifyRes = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/payments/razorpay/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: credit,
              }),
            }
          );
          const verifyData = await verifyRes.json();
          if (!verifyData.success) {
            alert(verifyData.message || "Payment verification failed");
            return;
          }

          setCurrentCredit(verifyData.providerCredit);
          setCredit("");
          alert(`Payment success. Credit added: ${verifyData.creditAdded} (includes +5% bonus)`);
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-xl font-bold mb-4">Buy Credit</h2>

      <div className="bg-white shadow p-4 rounded mb-4">
        <p className="text-sm text-gray-500">Current Credit</p>
        <p className="text-lg font-bold">{currentCredit}</p>
      </div>

      <input
        type="number"
        value={credit}
        onChange={(e) => setCredit(e.target.value)}
        placeholder="Enter amount (INR)"
        className="w-full border p-2 rounded mb-3"
      />

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay with Razorpay (+5% bonus credit)"}
      </button>
        <p className="text-xs text-gray-500 mt-10"> 
          <a href="https://rzp.io/rzp/xjocsxbc" target="_blank" rel="noopener noreferrer"   className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50">Do Real Payment</a>  
        </p>

       <p className="mt-10 text-sm text-gray-600">
        Please use the above button to make a real payment and test the webhook functionality. After payment, you should see the credit added in your account with provider id
        <p> <strong>{providerId}</strong> </p>.
      </p>


      {/* https://rzp.io/rzp/xjocsxbc */}
    </div>
  );
}