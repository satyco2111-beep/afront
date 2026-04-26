"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SuperAdminPagination from "@/app/component/superadmin/SuperAdminPagination";

const PAGE_SIZE = 20;

export default function SuperAdminWorksPage() {
  const [cookie, setCookie] = useState({ sa_token: null });
  const [works, setWorks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!cookie?.sa_token) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/superadmin/works?page=${page}&limit=${PAGE_SIZE}`,
        {
          headers: { Authorization: `Bearer ${cookie.sa_token}` },
        }
      );
      const data = await res.json();
      const list = data.works || [];
      const pg = data.pagination;
      setWorks(list);
      setPagination(pg || null);
      if (pg && page > pg.totalPages && pg.totalPages >= 1) {
        setPage(pg.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      const c = await fetch("/api/cookies");
      const d = await c.json();
      setCookie(d);
    })();
  }, []);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookie?.sa_token, page]);

  async function del(swrid) {
    if (!confirm("Delete work?")) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/superadmin/works/${swrid}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${cookie.sa_token}` },
    });
    const data = await res.json();
    if (!data.success) alert(data.message || "Failed");
    await load();
  }

  async function updateStatus(swrid, status) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/superadmin/works/${swrid}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.sa_token}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!data.success) alert(data.message || "Failed");
    await load();
  }

  if (!cookie?.sa_token) {
    return (
      <div className="p-6">
        <div className="text-red-600">Please login.</div>
        <Link className="text-blue-600 underline" href="/superadmin/login">
          Login
        </Link>
      </div>
    );
  }


  const getRelativeTime = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now - past;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${diffInDays}d ago`;
};
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Works</h1>
        <Link className="text-blue-600 underline" href="/superadmin/dashboard">
          Dashboard
        </Link>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white shadow rounded overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">SWRID</th>
                <th className="text-left p-2">Title</th>
                <th className="text-left p-2">Price</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Payment</th>
                <th className="text-left p-2">User</th>
                <th className="text-left p-2">Provider</th>
                <th className="text-left p-2">Create Time </th>
                <th className="text-left p-2">Last update time</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {works.map((w) => (
                <tr key={w._id} className="border-t">
                  <td className="p-2 font-mono"><Link href={`/superadmin/works/single/${w.swrid}`} > {w.swrid} </Link></td>
                  <td className="p-2">{w.title}</td>
                  <td className="p-2">{w.price}</td>
                  <td className="p-2">
                    <select
                      className="border rounded p-1"
                      value={w.status || "OPEN"}
                      onChange={(e) => updateStatus(w.swrid, e.target.value)}
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="STARTED">STARTED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="DONE">DONE</option>
                      <option value="CANCELED">CANCELED</option>
                    </select>
                  </td>
                  <td className="p-2">{w.paymentStatus}</td>
                  <td className="p-2 font-mono">{w.suid}</td>
                  <td className="p-2 font-mono">{w.sprovid}</td>
                  {/* <td className="p-2 font-mono">{w.createdAt}</td> */}
                  {/* <td className="p-2 font-mono">{w.updatedAt}</td> */}
                  <td className="p-2 font-mono text-sm text-gray-600">
                    {getRelativeTime(w.createdAt)}
                  </td>
                  <td className="p-2 font-mono text-sm text-gray-600">
                    {getRelativeTime(w.updatedAt)}
                  </td>
                  <td className="p-2">
                    <button onClick={() => del(w.swrid)} className="text-red-600 underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {works.length === 0 && (
                <tr>
                  <td className="p-2 text-gray-600" colSpan={8}>
                    No works
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {pagination && (
            <p className="text-sm text-gray-500 px-2 py-2 border-t">
              Total works: {pagination.total}
            </p>
          )}
        </div>
      )}
      <SuperAdminPagination
        page={page}
        totalPages={pagination?.totalPages ?? 1}
        loading={loading}
        onPageChange={setPage}
      />
    </div>
  );
}

