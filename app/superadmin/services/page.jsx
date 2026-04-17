"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SuperAdminPagination from "@/app/component/superadmin/SuperAdminPagination";

const PAGE_SIZE = 20;

export default function SuperAdminServicesPage() {
  const [cookie, setCookie] = useState({ sa_token: null });
  const [services, setServices] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/services?page=${page}&limit=${PAGE_SIZE}`
      );
      const data = await res.json();
      const list = data.services || [];
      const pg = data.pagination;
      setServices(list);
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
    if (!name) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/superadmin/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.sa_token}`,
      },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!data.success) alert(data.message || "Failed");
    setName("");
    await load();
  }

  async function del(ssrvcid) {
    if (!confirm("Delete service?")) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/superadmin/services/${ssrvcid}`, {
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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Services</h1>
        <Link className="text-blue-600 underline" href="/superadmin/dashboard">
          Dashboard
        </Link>
      </div>

      <div className="bg-white shadow rounded p-4 mb-4 flex gap-2">
        <input
          className="border rounded p-2 flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Service name"
        />
        <button className="bg-black text-white rounded px-4" onClick={add}>
          Add
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white shadow rounded">
          {services.map((s) => (
            <div key={s._id} className="flex items-center justify-between p-3 border-t">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs text-gray-500 font-mono">{s.ssrvcid}</div>
              </div>
              <button className="text-red-600 underline" onClick={() => del(s.ssrvcid)}>
                Delete
              </button>
            </div>
          ))}
          {services.length === 0 && <div className="p-3 text-gray-600">No services</div>}
          {pagination && (
            <p className="text-sm text-gray-500 px-3 py-2 border-t">Total services: {pagination.total}</p>
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

