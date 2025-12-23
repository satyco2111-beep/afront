
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function WorkDetailsPage() {
  const { id } = useParams(); // swrid

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const [work, setWork] = useState(null);
  const [user, setUser] = useState(null);
  const [city, setCity] = useState(null);
  const [local, setLocal] = useState(null);
  const [service, setService] = useState(null);
    const [updatepage, setUpdatePage] = useState(1);


  // 🔁 FETCH ALL DETAILS
  useEffect(() => {
    if (!id) return;

    async function fetchDetails() {
      try {
        const workRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/works/${id}`);
        const workData = await workRes.json();
        if (!workData.success) throw new Error("Work not found");

        const w = workData.work;
        setWork(w);

        const [
          cityRes,
          localRes,
          serviceRes,
        ] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/city`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/local-aria`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/services`),
        ]);

     
        const cityData = await cityRes.json();
        const localData = await localRes.json();
        const serviceData = await serviceRes.json();

    
        setCity(cityData.citys.find(c => c.sctyid === w.sctyid));
        setLocal(localData.loaclArias.find(l => l.sloctyid === w.sloctyid));
        setService(serviceData.services.find(s => s.ssrvcid === w.ssrvcid));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [id,updatepage]);

  // ✅ STATUS UPDATE FUNCTION (NEW)
  const updateStatus = async (newStatus) => {
    if (!work) return;
       const cookie = await fetch("/api/cookies");
    const { id } = await cookie.json();

    try {
      setActionLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/works/${work.swrid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, sprovid: id }),
      });

      const data = await res.json();
      if (!data.success) throw new Error("Failed to update status");
      if(data.success){ updatePaymentDue(work.price)}

      setWork(data.work); // update UI instantly
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };


  // updatePaymentDue ==================================
  const updatePaymentDue = async (price) => {
    if (!work) return;
       const cookie = await fetch("/api/cookies");
    const { id } = await cookie.json();
     const duePrice = Number(price) * 0.05;
     console.log("duePrice",duePrice)

    try {
      setActionLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/providers/payment-due/${id}?amount=${duePrice}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({sprovid: id }),
      });

      const data = await res.json(); console.log("data; ",data)
      if (!data.success) throw new Error("Failed to update payment due status");

      // setWork(data.work); // update UI instantly
      setUpdatePage(2)
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

   // updatePaymentComplete ================

   const updatePaymentComplete = async () => {
    if (!work) return;
       const cookie = await fetch("/api/cookies");
    const { id } = await cookie.json();

    try {
      setActionLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/providers/payment-complete/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({sprovid: id }),
      });

      const data = await res.json();
      if (!data.success) throw new Error("Failed to update complete Pay status");
      


      // ====
            const resUpW = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/works/${work.swrid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DONE",paymentStatus:"PAID" ,sprovid: id }),
      });

      const dataW = await resUpW.json();
      if (!dataW.success) throw new Error("Failed to update status");

      setWork(dataW.work);


      // setWork(data.work); // update UI instantly
            // setUpdatePage(3)
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };


  if (loading) {
    return <div className="p-6 text-center">Loading work details...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="max-w-4xl w-full bg-white rounded shadow p-6 space-y-6">

        {/* WORK INFO */}
        <section>
          <h1 className="text-3xl font-bold">{work.title}</h1>
          <p className="text-gray-600 mt-2">{work.description}</p>

          <div className="mt-4 flex flex-wrap gap-4">
            <span className="bg-blue-100 px-3 py-1 rounded">
              Price: ₹{work.price}
            </span>
            <span className="bg-green-100 px-3 py-1 rounded">
              Status: {work.status || "pending"}
            </span>
            <span className="bg-yellow-100 px-3 py-1 rounded">
              Payment: {work.paymentStatus || "unpaid"}
            </span>
          </div>
        </section>

        {/* LOCATION */}
        <section className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Location</h2>
          <p>🏙 City: <b>{city?.name || "N/A"}</b></p>
          <p>📍 Local Area: <b>{local?.name || "N/A"}</b></p>
        </section>

        {/* SERVICE */}
        <section className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Service</h2>
          <p>🛠 {service?.name || "N/A"}</p>
        </section>

      
        {/* ACTION BUTTONS (NEW FUNCTIONALITY ADDED) */}
        <section className="border-t pt-4">
          {work.status !== "COMPLETED"? <h2 className="text-xl font-semibold mb-2">Action</h2>:null}

          <div className="flex gap-4 flex-wrap">
            {work.status === "OPEN"?
            <button
              // disabled={actionLoading || work.status === "accepted"}
              // onClick={() => updateStatus("ACCEPTED")}
              // onClick={() => {updateStatus("ACCEPTED");updatePaymentDue(work.price)}}
              onClick={() => {updateStatus("ACCEPTED")}}
              className="bg-yellow-300 px-4 py-2 rounded disabled:opacity-50"
            >
              ACCEPT
            </button>:null}

            {work.status === "ACCEPTED"?
            <button
              // disabled={actionLoading || work.status !== "IN PROGRESS"}
              onClick={() => updateStatus("STARTED")}
              className="bg-orange-300 px-4 py-2 rounded disabled:opacity-50"
            >
              START
            </button>:null}

           {work.status === "STARTED"?
            <button
             
              onClick={() => updateStatus("COMPLETED")}
              className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              COMPLETED
            </button>:null}
              {work.status === "COMPLETED"?
             <button
             
              // onClick={() => updateStatus("DONE")}
              onClick={() => updatePaymentComplete()}
              className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              PAY
            </button>:null}
          </div>
        </section>

        {/* META */}
        <section className="border-t pt-4 text-sm text-gray-500">
          {/* <p>Work ID: {work.swrid}</p> */}
          <p>Created At: {new Date(work.createdAt).toLocaleString()}</p>
        </section>

      </div>
    </div>
  );
}













// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// export default function WorkDetailsPage() {
//   const { id } = useParams(); // swrid
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [work, setWork] = useState(null);
//   const [user, setUser] = useState(null);
//   const [city, setCity] = useState(null);
//   const [local, setLocal] = useState(null);
//   const [service, setService] = useState(null);
//   console.log(id)

//   // FETCH ALL DETAILS
//   useEffect(() => {
//     if (!id) return;

    
//     async function fetchDetails() {
//       try {
//         // 1️⃣ Get Work
//         const workRes = await fetch(`{process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/works/${id}`);
//         const workData = await workRes.json();
//         if (!workData.success) throw new Error("Work not found");

//         const w = workData.work;
//         setWork(w);

//         // 2️⃣ Parallel fetch related data
//         const [
//           userRes,
//           cityRes,
//           localRes,
//           serviceRes,
//         ] = await Promise.all([
//           fetch(`{process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/user/user/${w.suid}`),
//           fetch(`{process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/city`),
//           fetch(`{process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/local-aria`),
//           fetch(`{process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/services`),
//         ]);

//         const userData = await userRes.json();
//         const cityData = await cityRes.json();
//         const localData = await localRes.json();
//         const serviceData = await serviceRes.json();

//         setUser(userData.user || null);

//         setCity(cityData.citys.find(c => c.sctyid === w.sctyid));
//         setLocal(localData.loaclArias.find(l => l.sloctyid === w.sloctyid));
//         setService(serviceData.services.find(s => s.ssrvcid === w.ssrvcid));

//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchDetails();
//   }, [id]);

//   if (loading) {
//     return <div className="p-6 text-center">Loading work details...</div>;
//   }

//   if (error) {
//     return <div className="p-6 text-center text-red-600">{error}</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
//       <div className="max-w-4xl w-full bg-white rounded shadow p-6 space-y-6">

//         {/* WORK INFO */}
//         <section>
//           <h1 className="text-3xl font-bold">{work.title}</h1>
//           <p className="text-gray-600 mt-2">{work.description}</p>

//           <div className="mt-4 flex flex-wrap gap-4">
//             <span className="bg-blue-100 px-3 py-1 rounded">
//               Price: ₹{work.price}
//             </span>
//             <span className="bg-green-100 px-3 py-1 rounded">
//               Status: {work.status || "pending"}
//             </span>
//             <span className="bg-yellow-100 px-3 py-1 rounded">
//               Payment: {work.paymentStatus || "unpaid"}
//             </span>
//           </div>
//         </section>

//         {/* LOCATION */}
//         <section className="border-t pt-4">
//           <h2 className="text-xl font-semibold mb-2">Location</h2>
//           <p>🏙 City: <b>{city?.name || "N/A"}</b></p>
//           <p>📍 Local Area: <b>{local?.name || "N/A"}</b></p>
//         </section>

//         {/* SERVICE */}
//         <section className="border-t pt-4">
//           <h2 className="text-xl font-semibold mb-2">Service</h2>
//           <p>🛠 {service?.name || "N/A"}</p>
//         </section>

//         {/* USER DETAILS */}
//         <section className="border-t pt-4">
//           <h2 className="text-xl font-semibold mb-2">Posted By</h2>
//           <p>👤 Name: <b>{user?.name}</b></p>
//           <p>📧 Email: <b>{user?.email}</b></p>
//           <p>🆔 User ID: {user?.suid}</p>
//         </section>
//         {/* ACTION BUTTON */}
//         <section className="border-t pt-4">
//           <h2 className="text-xl font-semibold mb-2">Action</h2>
//           <p> <button className="bg-yellow-300 px-3 py-1 rounded"> ACCEPTE</button></p>
//           <p> <button className="bg-orange-300 px-3 py-1 rounded"> START</button></p>
//           <p> <button className="bg-green-500 px-3 py-1 rounded"> DONE</button></p>
      
//         </section>

//         {/* META */}
//         <section className="border-t pt-4 text-sm text-gray-500">
//           <p>Work ID: {work.swrid}</p>
//           <p>Created At: {new Date(work.createdAt).toLocaleString()}</p>
//         </section>

//       </div>
//     </div>
//   );
// }
