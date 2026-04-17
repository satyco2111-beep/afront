"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SuperAdminPagination from "@/app/component/superadmin/SuperAdminPagination";

const PAGE_SIZE = 20;

export default function SuperAdminWithdrawalsPage() {
  const [cookie, setCookie] = useState({ sa_token: null });
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const base = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

  useEffect(() => {
    (async () => {
      const c = await fetch("/api/cookies");
      const d = await c.json();
      setCookie(d);
    })();
  }, []);

  async function load() {
    if (!cookie?.sa_token) return;
    setLoading(true);
    try {
      const res = await fetch(`${base}/api/superadmin/withdrawals?page=${page}&limit=${PAGE_SIZE}`, {
        headers: { Authorization: `Bearer ${cookie.sa_token}` },
      });
      const data = await res.json();
      const list = data.withdrawals || [];
      const pg = data.pagination;
      setRows(list);
      setPagination(pg || null);
      if (pg && page > pg.totalPages && pg.totalPages >= 1) {
        setPage(pg.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookie?.sa_token, page]);

  async function act(swrid, action) {
    if (!cookie?.sa_token) return;
    if (!confirm(`Are you sure you want to ${action} this request?`)) return;
    setBusyId(swrid);
    try {
      const res = await fetch(`${base}/api/superadmin/withdrawals/${encodeURIComponent(swrid)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie.sa_token}`,
        },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Action failed");
        return;
      }
      await load();
    } finally {
      setBusyId(null);
    }
  }

  if (!cookie?.sa_token) {
    return (
      <div className="p-6">
        <div className="text-red-600">Please login as super admin.</div>
        <Link className="text-blue-600 underline" href="/superadmin/login">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Credit withdrawal requests</h1>
      <p className="text-sm text-gray-600 mb-4">
        Approve after you pay the user via UPI. Approving deducts credit from their account. Reject if the request should not be
        paid.
      </p>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="overflow-x-auto border rounded bg-white shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">When</th>
                <th className="text-left p-2">User</th>
                <th className="text-left p-2">UPI</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Credit (now)</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((w) => (
                <tr key={w.swrid} className="border-t">
                  <td className="p-2 whitespace-nowrap align-top">
                    {w.createdAt ? new Date(w.createdAt).toLocaleString() : "—"}
                  </td>
                  <td className="p-2 align-top">
                    {w.user ? (
                      <>
                        <div className="font-medium">{w.user.name || "—"}</div>
                        <div className="text-gray-600 text-xs">{w.user.email}</div>
                        <div className="text-gray-500 text-xs">{w.user.suid}</div>
                      </>
                    ) : (
                      w.suid
                    )}
                  </td>
                  <td className="p-2 align-top break-all max-w-[140px]">{w.upiId}</td>
                  <td className="p-2 align-top font-semibold">{w.amount}</td>
                  <td className="p-2 align-top">{w.user?.cradit_value ?? "—"}</td>
                  <td className="p-2 align-top capitalize">{w.status}</td>
                  <td className="p-2 align-top whitespace-nowrap">
                    {w.status === "pending" ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={busyId === w.swrid}
                          className="rounded bg-green-600 text-white px-2 py-1 text-xs hover:bg-green-700 disabled:opacity-50"
                          onClick={() => act(w.swrid, "approve")}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={busyId === w.swrid}
                          className="rounded bg-gray-600 text-white px-2 py-1 text-xs hover:bg-gray-700 disabled:opacity-50"
                          onClick={() => act(w.swrid, "reject")}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <div className="p-4 text-gray-500">No withdrawal requests.</div>}
          {pagination && <p className="text-sm text-gray-500 px-4 py-2 border-t">Total requests: {pagination.total}</p>}
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
