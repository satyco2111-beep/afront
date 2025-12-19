"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function MyWorksPage() {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    async function fetchUserWorks() {
      const cookieRes = await fetch("/api/cookies");
      const cookieData = await cookieRes.json();

      if (!cookieData.id) return;
      const res = await fetch(`http://localhost:8000/api/works/user/${cookieData.id}`);
      const data = await res.json();
      setWorks(data.works || []);
    }
    fetchUserWorks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">My Works</h2>

      {works.map((w) => (
        <div key={w._id} className="bg-white shadow p-4 rounded mb-3">
          <h3 className="font-bold">{w.title}</h3>
          <p>Status: {w.status}</p>
          <p>Payment: {w.paymentStatus}</p>

          <p>  <span className="text-xs bg-blue-100 px-2 py-1 rounded"><Link href={`work-full-detils-number-for-user/${w.swrid}`}> Full Details </Link> </span> </p>
        </div>
      ))}
    </div>
  );
}
