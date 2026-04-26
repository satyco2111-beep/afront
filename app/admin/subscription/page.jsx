"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SubscriptionPage() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [subscribing, setSubscribing] = useState(null);
  const [backendUrl] = useState(process.env.NEXT_PUBLIC_BACKEN_BASE_URL);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch plans
      const plansRes = await fetch(`${backendUrl}/api/subscription/plans`);
      const plansData = await plansRes.json();
      if (plansData.success) {
        setPlans(plansData.plans || []);
      }

      // Fetch current subscription
      const subRes = await fetch(`${backendUrl}/api/subscription/current`, {
        credentials: "include",
      });
      const subData = await subRes.json();
      if (subData.success) {
        setCurrentSubscription(subData.subscription);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    setSubscribing(planId);
    try {
      const res = await fetch(`${backendUrl}/api/subscription/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, }),
        credentials: "include",
      });

      const data = await res.json();

      if (data.success && data.shortUrl) {
        // Redirect to Razorpay checkout
        window.location.href = data.shortUrl;
      } else {
        alert(data.message || "Failed to create subscription");
      }
    } catch (err) {
      console.error("Subscription error:", err);
      alert("Failed to initiate subscription");
    } finally {
      setSubscribing(null); 
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;

    try {
      const res = await fetch(`${backendUrl}/api/subscription/cancel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchData();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Failed to cancel subscription");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 text-lg">
            Unlock premium features with our monthly subscription plans
          </p>
        </div>

        {/* Current Subscription Status */}
        {currentSubscription && (
          <div className="mb-8 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">Current Subscription</h3>
                <p className="text-gray-600">
                  Plan: <span className="font-semibold">{currentSubscription.planName}</span>
                </p>
                <p className="text-gray-600">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      currentSubscription.status === "ACTIVE"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {currentSubscription.status}
                  </span>
                </p>
                {currentSubscription.nextBillingDate && (
                  <p className="text-gray-600">
                    Next Billing:{" "}
                    {new Date(currentSubscription.nextBillingDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button
                onClick={handleCancelSubscription}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.planId}
              className={`bg-white rounded-lg shadow-lg p-8 ${
                plan.name === "Pro" ? "ring-2 ring-blue-500" : ""
              }`}
            >
              {plan.name === "Pro" && (
                <div className="bg-blue-500 text-white text-center py-1 rounded-t-lg -mx-8 -mt-8 mb-4">
                  Most Popular
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
                {plan.description && (
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                )}
              </div>

              <div className="text-center mt-6">
                <span className="text-5xl font-bold text-gray-800">
                  ₹{plan.amount}
                </span>
                <span className="text-gray-600">/month</span>
              </div>

              {/* Features */}
              {plan.features && plan.features.length > 0 && (
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <span className="text-green-500 mr-3">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              {/* Subscribe Button */}
              <div className="mt-8">
                {currentSubscription?.status === "ACTIVE" ? (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-600 py-3 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan.planId)}
                    disabled={subscribing === plan.planId}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition"
                  >
                    {subscribing === plan.planId
                      ? "Processing..."
                      : plan.name === "Pro"
                      ? "Get Started"
                      : "Subscribe"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Plans Available */}
        {plans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No subscription plans available at the moment.
            </p>
            <p className="text-gray-500 mt-2">
              Please check back later or contact support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}