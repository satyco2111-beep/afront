
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

  // 🔁 FETCH ALL DETAILS
  useEffect(() => {
    if (!id) return;

    async function fetchDetails() {
      try {
        const workRes = await fetch(`http://localhost:8000/api/works/${id}`);
        const workData = await workRes.json();
        if (!workData.success) throw new Error("Work not found");

        const w = workData.work;
        setWork(w);

        const [
          providerRes,
          cityRes,
          localRes,
          serviceRes,
        ] = await Promise.all([
          fetch(`http://localhost:8000/api/providers/provider/${w.sprovid ? w.sprovid :1}`),
          fetch(`http://localhost:8000/api/city`),
          fetch(`http://localhost:8000/api/local-aria`),
          fetch(`http://localhost:8000/api/services`),
        ]);

        const providerData = await providerRes.json();
        const cityData = await cityRes.json();
        const localData = await localRes.json();
        const serviceData = await serviceRes.json();
        console.log("providerData",providerData)
        setUser(providerData?.provider || null);
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
  }, [id]);



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

        {/* USER DETAILS */}
        <section className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">ACCEPTED BY</h2>
          <p>👤 Name: <b>{user?.name}</b></p>
          <p>📧 Email: <b>{user?.email}</b></p>
          <p>📧 Mobile: <b>{user?.mobile}</b></p>
          {/* <p>🆔 User ID: {user?.suid}</p> */}
          <div className="flex gap-4 mt-2">
            {/* Call */}
            <a
              href={`tel:${user?.mobile}`}
              className="text-blue-600 hover:underline"
            >
              📞 Call
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${user?.mobile}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              💬 WhatsApp Chat
            </a>

            {/* Email */}
            <a
              href={`mailto:${user?.email}`}
              className="text-red-600 hover:underline"
            >
              ✉️ Email
            </a>
          </div>
        </section>
          {/* {work.status !== "COMPLETED"? <h2 className="text-xl font-semibold mb-2">Action</h2>:null} */}

      

        {/* META */}
        <section className="border-t pt-4 text-sm text-gray-500">
          {/* <p>Work ID: {work.swrid}</p> */}
          <p>Created At: {new Date(work.createdAt).toLocaleString()}</p>
        </section>

      </div>
    </div>
  );
}

