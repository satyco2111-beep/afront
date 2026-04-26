// "use client";

// import { useEffect, useState } from "react";

// export default function SubscriptionPage() {
//   const [plans, setPlans] = useState([]);
//   const [subscription, setSubscription] = useState(null);
//   const [cookies, setCookies] = useState({ id: null });
//   const [loading, setLoading] = useState(true);
//   const [subscribing, setSubscribing] = useState(null);

//   const backendUrl = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

//   // ✅ GET USER FROM COOKIE
//   useEffect(() => {
//     async function fetchCookies() {
//       const res = await fetch("/api/cookies", { cache: "no-store" });
//       const data = await res.json();
//       setCookies(data);
//     }
//     fetchCookies();
//   }, []);

//   // ✅ FETCH DATA AFTER USER ID READY
//   useEffect(() => {
//     if (cookies.id) {
//       fetchData(cookies.id);
//     }
//   }, [cookies.id]);

//   const fetchData = async (suid) => {
//     try {
//       // 🔹 GET PLANS
//       const plansRes = await fetch(`${backendUrl}/api/subscription/plans`);
//       const plansData = await plansRes.json();
//       if (plansData.success) {
//         setPlans(plansData.plans || []);
//       }

//       // 🔹 GET USER SUBSCRIPTION
//       const subRes = await fetch(
//         `${backendUrl}/api/subscription/me-user/${suid}`
//       );
//       const subData = await subRes.json();

//       setSubscription(subData);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ BUY / UPGRADE
//   const handleSubscribe = async (plan) => {
//     setSubscribing(plan.planId);

//     try {
//       const res = await fetch(`${backendUrl}/api/subscription/me-user/buy`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           suid: cookies.id,
//           planId: plan.planId,
//           planName: plan.name,
//           amount: plan.amount,
//         }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         alert(data.message);
//         fetchData(cookies.id); // refresh
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Something went wrong");
//     } finally {
//       setSubscribing(null);
//     }
//   };

//   if (loading) return <div className="p-6">Loading...</div>;

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">Subscription Plans</h1>

//       {/* ✅ CURRENT SUB */}
//       {subscription?.subscribed && (
//         <div className="mb-6 p-4 bg-green-100 rounded">
//           <p>
//             Plan: <b>{subscription.currentPlan}</b>
//           </p>
//           <p>
//             Next Billing:{" "}
//             {new Date(subscription.nextBillingDate).toLocaleDateString()}
//           </p>
//         </div>
//       )}

//       {/* ✅ PLANS */}
//       <div className="grid md:grid-cols-3 gap-6">
//         {plans.map((plan) => {
//           const isCurrent =
//             subscription?.subscribed &&
//             subscription?.currentPlan === plan.name;

//           return (
//             <div key={plan.planId} className="border p-5 rounded shadow">
//               <h2 className="text-xl font-bold">{plan.name}</h2>
//               <p className="text-2xl mt-2">₹{plan.amount}/month</p>

//               {/* BUTTON LOGIC */}
//               <div className="mt-4">
//                 {isCurrent ? (
//                   <button className="bg-gray-400 w-full py-2 rounded">
//                     Current Plan
//                   </button>
//                 ) : subscription?.subscribed ? (
//                   <button
//                     onClick={() => handleSubscribe(plan)}
//                     disabled={subscribing === plan.planId}
//                     className="bg-yellow-500 text-white w-full py-2 rounded"
//                   >
//                     {subscribing === plan.planId
//                       ? "Processing..."
//                       : "Upgrade"}
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => handleSubscribe(plan)}
//                     disabled={subscribing === plan.planId}
//                     className="bg-blue-500 text-white w-full py-2 rounded"
//                   >
//                     {subscribing === plan.planId
//                       ? "Processing..."
//                       : "Subscribe"}
//                   </button>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// ===========================

// "use client";

// import { useEffect, useState } from "react";

// export default function SubscriptionPage() {
//   const [plans, setPlans] = useState([]);
//   const [subscription, setSubscription] = useState(null);
//   const [cookies, setCookies] = useState({ id: null });
//   const [loading, setLoading] = useState(true);
//   const [subscribing, setSubscribing] = useState(null);

// //   const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
//    const backendUrl = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

//   // 🔹 Load Razorpay script
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//   }, []);

//   // 🔹 Get user
//   useEffect(() => {
//     fetch("/api/cookies")
//       .then((res) => res.json())
//       .then(setCookies);
//   }, []);

//   useEffect(() => {
//     if (cookies.id) fetchData();
//   }, [cookies.id]);

//   const fetchData = async () => {
//     try {
//       const plansRes = await fetch(`${backendUrl}/api/subscription/plans`);
//       const plansData = await plansRes.json();
//       setPlans(plansData.plans || []);

//       const subRes = await fetch(
//         `${backendUrl}/api/subscription/me-user/${cookies.id}`
//       );
//       const subData = await subRes.json();
//       setSubscription(subData);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔥 MAIN SUBSCRIBE FLOW
//   const handleSubscribe = async (plan) => {
//     setSubscribing(plan.planId);

//     try {
//       // 1️⃣ Create order
//       const res = await fetch(`${backendUrl}/api/subscription/me-user/create-order`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           suid: cookies.id,
//           planId: plan.planId,
//           planName: plan.name,
//           amount: plan.amount,
//         }),
//       });

//       const data = await res.json();

//       // 2️⃣ Open Razorpay
//       const options = {
//         key: data.key,
//         amount: data.order.amount,
//         currency: "INR",
//         order_id: data.order.id,

//         handler: async function (response) {
//           // 3️⃣ Verify payment
//           await fetch(`${backendUrl}/api/subscription/me-user/verify-payment`, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               ...response,
//               suid: cookies.id,
//               planId: plan.planId,
//               planName: plan.name,
//               amount: plan.amount,
//             }),
//           });

//           alert("Subscription successful");
//           fetchData();
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();

//     } catch (err) {
//       console.error(err);
//       alert("Payment failed");
//     } finally {
//       setSubscribing(null);
//     }
//   };

//   if (loading) return <div>Loading...</div>;

// //   return (
// //     <div className="p-6">
// //       <h1 className="text-2xl font-bold">Subscription Plans</h1>

// //       {subscription?.subscribed && (
// //         <div className="bg-green-100 p-3 mt-4">
// //           Current Plan: {subscription.currentPlan}
// //         </div>
// //       )}

// //       <div className="grid grid-cols-3 gap-4 mt-6">
// //         {plans.map((plan) => {
// //           const isCurrent =
// //             subscription?.currentPlan === plan.name;

// //           return (
// //             <div key={plan.planId} className="border p-4">
// //               <h2>{plan.name}</h2>
// //               <p>₹{plan.amount}</p>

// //               <button
// //                 onClick={() => handleSubscribe(plan)}
// //                 disabled={isCurrent || subscribing === plan.planId}
// //                 className="bg-blue-500 text-white p-2 mt-2"
// //               >
// //                 {isCurrent
// //                   ? "Current"
// //                   : subscribing === plan.planId
// //                   ? "Processing..."
// //                   : "Subscribe"}
// //               </button>
// //             </div>
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );

// // ==================================================

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">Subscription Plans</h1>

//       {/* ✅ CURRENT SUB */}
//       {subscription?.subscribed && (
//         <div className="mb-6 p-4 bg-green-100 rounded">
//           <p>
//             Plan: <b>{subscription.currentPlan}</b>
//           </p>
//           <p>
//             Next Billing:{" "}
//             {new Date(subscription.nextBillingDate).toLocaleDateString()}
//           </p>
//         </div>
//       )}

//       {/* ✅ PLANS */}
//       <div className="grid md:grid-cols-3 gap-6">
//         {plans.map((plan) => {
//           const isCurrent =
//             subscription?.subscribed &&
//             subscription?.currentPlan === plan.name;

//           return (
//             <div key={plan.planId} className="border p-5 rounded shadow">
//               <h2 className="text-xl font-bold">{plan.name}</h2>
//               <p className="text-2xl mt-2">₹{plan.amount}/month</p>

//               {/* BUTTON LOGIC */}
//               <div className="mt-4">
//                 {isCurrent ? (
//                   <button className="bg-gray-400 w-full py-2 rounded">
//                     Current Plan
//                   </button>
//                 ) : subscription?.subscribed ? (
//                   <button
//                     onClick={() => handleSubscribe(plan)}
//                     disabled={subscribing === plan.planId}
//                     className="bg-yellow-500 text-white w-full py-2 rounded"
//                   >
//                     {subscribing === plan.planId
//                       ? "Processing..."
//                       : "Upgrade"}
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => handleSubscribe(plan)}
//                     disabled={subscribing === plan.planId}
//                     className="bg-blue-500 text-white w-full py-2 rounded"
//                   >
//                     {subscribing === plan.planId
//                       ? "Processing..."
//                       : "Subscribe"}
//                   </button>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );



// }




// -=============================


"use client";

import { useEffect, useState } from "react";

export default function SubscriptionPage() {
  const [plans, setPlans] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [cookies, setCookies] = useState({ id: null });
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);

//   const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

  // 🔹 Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // 🔹 Get user
  useEffect(() => {
    fetch("/api/cookies")
      .then((res) => res.json())
      .then(setCookies);
  }, []);

  useEffect(() => {
    if (cookies.id) fetchData();
  }, [cookies.id]);

  const fetchData = async () => {
    try {
      const plansRes = await fetch(`${backendUrl}/api/subscription/plans`);
      const plansData = await plansRes.json();
      setPlans(plansData.plans || []);

      const subRes = await fetch(
        `${backendUrl}/api/subscription/me-user/me-user/${cookies.id}`
      );
      const subData = await subRes.json();
      setSubscription(subData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SUBSCRIBE FLOW (UNCHANGED)
  const handleSubscribe = async (plan) => {
    setSubscribing(plan.planId);

    try {
      const res = await fetch(
        `${backendUrl}/api/subscription/me-user/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            suid: cookies.id,
            planId: plan.planId,
            planName: plan.name,
            amount: plan.amount,
          }),
        }
      );

      const data = await res.json();

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: "INR",
        order_id: data.order.id,

        handler: async function (response) {
          await fetch(
            `${backendUrl}/api/subscription/me-user/verify-payment`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                suid: cookies.id,
                planId: plan.planId,
                planName: plan.name,
                amount: plan.amount,
              }),
            }
          );

          alert("Subscription successful");
          fetchData();
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    } finally {
      setSubscribing(null);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Subscription Plans</h1>

      {/* ✅ CURRENT SUB */}
      {subscription?.subscribed && (
        <div className="mb-6 p-4 bg-green-100 rounded">
          <p>
            Plan: <b>{subscription.currentPlan}</b>
          </p>
          <p>
            Next Billing:{" "}
            {new Date(subscription.nextBillingDate).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* ✅ PLANS */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent =
            subscription?.subscribed &&
            subscription?.currentPlan === plan.name;

          return (
            <div
              key={plan.planId}
              className={`border p-5 rounded shadow transition ${
                isCurrent ? "border-green-500 bg-green-50" : ""
              }`}
            >
              <h2 className="text-xl font-bold">{plan.name}</h2>
              <p className="text-2xl mt-2">₹{plan.amount}/month</p>

              {/* Optional badge */}
              {isCurrent && (
                <p className="text-green-600 text-sm mt-1 font-medium">
                  Active Plan
                </p>
              )}

              {/* 🔥 FIXED BUTTON UI */}
              <div className="mt-4">
                {isCurrent ? (
                  <button className="w-full py-2 rounded bg-gray-300 text-gray-700 cursor-not-allowed">
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={subscribing === plan.planId}
                    className={`w-full py-2 rounded text-white transition-all duration-200
                      ${
                        subscribing === plan.planId
                          ? "bg-gray-400 cursor-not-allowed"
                          : subscription?.subscribed
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                  >
                    {subscribing === plan.planId
                      ? "Processing..."
                      : subscription?.subscribed
                      ? "Upgrade"
                      : "Subscribe"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}