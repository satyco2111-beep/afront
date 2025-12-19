
"use client";
import { useEffect, useState } from "react";

export default function ProviderWorksPage() {
  const [works, setWorks] = useState([]);

  async function loadWorks() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/works`);
    const data = await res.json();
    setWorks(data.works);
  }

  async function acceptWork(swrid) {
    const cookie = await fetch("/api/cookies");
    const { id } = await cookie.json();

    await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/works/${swrid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ACCEPTED", sprovid: id })
    });

    loadWorks();
  }

  useEffect(() => {
    loadWorks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Available Works</h2>

      {works.map((w) => (
        w.status === "OPEN" &&
        <div key={w._id} className="bg-white shadow p-4 rounded mb-3">
          <h3 className="font-bold">{w.title}</h3>
          <p>Price: ₹{w.price}</p>
          <button
            onClick={() => acceptWork(w.swrid)}
            className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
          >
            Accept
          </button>
        </div>
      ))}
    </div>
  );
}
