"use client";

import { useEffect, useState } from "react";

export default function WorksListPage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorks() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/works`, {
          cache: "no-store"
        });
        const data = await res.json();

        console.log(data);

        if (data.success) {
          setWorks(data.works || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorks();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">All Works</h2>

      {works.length === 0 ? (
        <p className="text-center text-gray-600">No works found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">User</th>
              </tr>
            </thead>

            <tbody>
              {works.map((work) => (
                <tr key={work._id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{work.title}</td>
                  <td className="p-3">₹{work.price}</td>
                  <td className="p-3 font-semibold text-blue-600">
                    {work.status || "OPEN"}
                  </td>
                  <td className="p-3">{work.suid || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



