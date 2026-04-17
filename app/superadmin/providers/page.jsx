"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SuperAdminPagination from "@/app/component/superadmin/SuperAdminPagination";

const PAGE_SIZE = 20;

export default function SuperAdminProvidersPage() {
  const [cookie, setCookie] = useState({ sa_token: null });
  const [providers, setProviders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!cookie?.sa_token) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/superadmin/providers?page=${page}&limit=${PAGE_SIZE}`,
        {
          headers: { Authorization: `Bearer ${cookie.sa_token}` },
        }
      );
      const data = await res.json();
      const list = data.providers || [];
      const pg = data.pagination;
      setProviders(list);
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

  async function del(sprovid) {
    if (!confirm("Delete provider?")) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/superadmin/providers/${sprovid}`, {
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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Providers</h1>
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
                <th className="text-left p-2">SPROVID</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Mobile</th>
                <th className="text-left p-2">Credit</th>
                <th className="text-left p-2">Live</th>
                <th className="text-left p-2">Due</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-2 font-mono">{p.sprovid}</td>
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.email}</td>
                  <td className="p-2">{p.mobile}</td>
                  <td className="p-2">{p.cradit_value || "0"}</td>
                  <td className="p-2">{String(p.islive)}</td>
                  <td className="p-2">{String(p.payment_due)}</td>
                  <td className="p-2">
                    <button onClick={() => del(p.sprovid)} className="text-red-600 underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {providers.length === 0 && (
                <tr>
                  <td className="p-2 text-gray-600" colSpan={7}>
                    No providers
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {pagination && (
            <p className="text-sm text-gray-500 px-2 py-2 border-t">
              Total providers: {pagination.total}
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

