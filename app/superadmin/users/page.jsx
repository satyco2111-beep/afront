"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SuperAdminPagination from "@/app/component/superadmin/SuperAdminPagination";

const PAGE_SIZE = 20;

export default function SuperAdminUsersPage() {
  const [cookie, setCookie] = useState({ sa_token: null });
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!cookie?.sa_token) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/superadmin/users?page=${page}&limit=${PAGE_SIZE}`,
        {
          headers: { Authorization: `Bearer ${cookie.sa_token}` },
        }
      );
      const data = await res.json();
      const list = data.users || [];
      const pg = data.pagination;
      setUsers(list);
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

  async function del(suid) {
    if (!confirm("Delete user and their works?")) return;
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/superadmin/users/${suid}`, {
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
        <h1 className="text-2xl font-bold">Users</h1>
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
                <th className="text-left p-2">SUID</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Mobile</th>
                <th className="text-left p-2">Credit</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-2 font-mono">{u.suid}</td>
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.mobile}</td>
                  <td className="p-2">{u.cradit_value || "0"}</td>
                  <td className="p-2">
                    <button onClick={() => del(u.suid)} className="text-red-600 underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="p-2 text-gray-600" colSpan={6}>
                    No users
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {pagination && (
            <p className="text-sm text-gray-500 px-2 py-2 border-t">
              Total users: {pagination.total}
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

