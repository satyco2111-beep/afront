"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SuperAdminPagination from "@/app/component/superadmin/SuperAdminPagination";

const PAGE_SIZE = 20;
const base = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

export default function SuperAdminLocalsPage() {
  const [cookie, setCookie] = useState({ sa_token: null });
  const [cities, setCities] = useState([]);
  const [locals, setLocals] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [sctyid, setSctyid] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [cRes, lRes] = await Promise.all([
        fetch(`${base}/api/city`),
        fetch(`${base}/api/local-aria?page=${page}&limit=${PAGE_SIZE}`),
      ]);
      const cData = await cRes.json();
      const lData = await lRes.json();
      setCities(cData.citys || []);
      const list = lData.loaclArias || [];
      const pg = lData.pagination;
      setLocals(list);
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
    if (!cookie?.sa_token) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookie?.sa_token, page]);

  async function add() {
    if (!name || !sctyid) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/superadmin/locals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.sa_token}`,
      },
      body: JSON.stringify({ name, sctyid }),
    });
    const data = await res.json();
    if (!data.success) alert(data.message || "Failed");
    setName("");
    await load();
  }

  async function del(sloctyid) {
    if (!confirm("Delete local area?")) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/superadmin/locals/${sloctyid}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${cookie.sa_token}` },
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Local Areas</h1>
        <Link className="text-blue-600 underline" href="/superadmin/dashboard">
          Dashboard
        </Link>
      </div>

      <div className="bg-white shadow rounded p-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-2">
        <input
          className="border rounded p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Local area name"
        />
        <select className="border rounded p-2" value={sctyid} onChange={(e) => setSctyid(e.target.value)}>
          <option value="">Select city</option>
          {cities.map((c) => (
            <option key={c.sctyid} value={c.sctyid}>
              {c.name}
            </option>
          ))}
        </select>
        <button className="bg-black text-white rounded px-4 py-2" onClick={add}>
          Add
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white shadow rounded overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">City</th>
                <th className="text-left p-2">ID</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {locals.map((l) => (
                <tr key={l._id} className="border-t">
                  <td className="p-2">{l.name}</td>
                  <td className="p-2 font-mono">{l.sctyid}</td>
                  <td className="p-2 font-mono">{l.sloctyid}</td>
                  <td className="p-2">
                    <button className="text-red-600 underline" onClick={() => del(l.sloctyid)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {locals.length === 0 && (
                <tr>
                  <td className="p-2 text-gray-600" colSpan={4}>
                    No local areas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {pagination && (
            <p className="text-sm text-gray-500 px-2 py-2 border-t">Total local areas: {pagination.total}</p>
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

