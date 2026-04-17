"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SuperAdminDashboardPage() {
  const [cookie, setCookie] = useState({ sa_token: null });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const c = await fetch("/api/cookies");
      const d = await c.json();
      setCookie(d);
    })();
  }, []);

  useEffect(() => {
    if (!cookie?.sa_token) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/superadmin/dashboard`, {
          headers: { Authorization: `Bearer ${cookie.sa_token}` },
        });
        const data = await res.json();
        setStats(data.stats);
      } finally {
        setLoading(false);
      }
    })();
  }, [cookie?.sa_token]);

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
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {loading || !stats ? (
          <div>Loading...</div>
        ) : (
          <>
            <Card title="Users" value={stats.users} />
            <Card title="Providers" value={stats.providers} />
            <Card title="Works" value={stats.works} />
            <Card title="Cities" value={stats.cities} />
            <Card title="Local Areas" value={stats.locals} />
            <Card title="Services" value={stats.services} />
          </>
        )}
      </div>

      <div className="bg-white shadow rounded p-4">
        <div className="font-semibold mb-2">Manage</div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Link className="border rounded p-3 hover:bg-gray-50" href="/superadmin/users">
            Users
          </Link>
          <Link className="border rounded p-3 hover:bg-gray-50" href="/superadmin/providers">
            Providers
          </Link>
          <Link className="border rounded p-3 hover:bg-gray-50" href="/superadmin/works">
            Works
          </Link>
          <Link className="border rounded p-3 hover:bg-gray-50" href="/superadmin/cities">
            Cities
          </Link>
          <Link className="border rounded p-3 hover:bg-gray-50" href="/superadmin/locals">
            Local Areas
          </Link>
          <Link className="border rounded p-3 hover:bg-gray-50" href="/superadmin/services">
            Services
          </Link>
          <Link className="border rounded p-3 hover:bg-gray-50" href="/superadmin/withdrawals">
            Credit withdrawals
          </Link>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white shadow rounded p-4">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

