"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const base = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

function formatPrice(p) {
  const n = Number(p);
  if (!Number.isFinite(n)) return "—";
  return `₹${n.toLocaleString("en-IN")}`;
}

export default function ProviderDashboardHome() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const c = await fetch("/api/cookies");
        const { token } = await c.json();
        if (!token) {
          setErr("Please log in.");
          return;
        }
        const res = await fetch(`${base}/api/providers/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          setErr(json.message || "Could not load dashboard");
          return;
        }
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setErr("Network error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const profile = data?.profile;
  const stats = data?.stats;
  const recentOpenJobs = data?.recentOpenJobs || [];
  const recentActive = data?.recentActive || [];
  const recentCompleted = data?.recentCompleted || [];

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-green-800">
              Welcome{profile?.name ? `, ${profile.name}` : ""} 👋
            </h2>
            <p className="text-gray-600">Find work, complete tasks, and track your jobs.</p>
            {stats?.payment_due && (
              <p className="mt-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 inline-block">
                Payment due: {stats.amount_due ? `₹${stats.amount_due}` : "Yes"} — contact admin if needed.
              </p>
            )}
          </div>
          <Link
            href="/admin/profile"
            className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
          >
            Edit profile
          </Link>
        </div>

        {loading && <div className="text-gray-600">Loading dashboard…</div>}
        {err && !loading && <div className="text-red-600">{err}</div>}

        {!loading && !err && stats && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-gray-500 text-sm">Total earnings (completed)</p>
                <h3 className="text-3xl font-bold mt-2 text-green-600">₹{stats.totalEarnings?.toLocaleString?.("en-IN") ?? stats.totalEarnings}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-gray-500 text-sm">Open jobs (market)</p>
                <h3 className="text-3xl font-bold mt-2 text-blue-600">{stats.availableOpenJobs}</h3>
                <Link href="/admin/work-list-filter" className="text-xs text-blue-600 underline mt-1 inline-block">
                  Browse all
                </Link>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-gray-500 text-sm">Your active jobs</p>
                <h3 className="text-3xl font-bold mt-2 text-yellow-600">{stats.activeCount}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-gray-500 text-sm">Your completed jobs</p>
                <h3 className="text-3xl font-bold mt-2 text-green-700">{stats.completedCount}</h3>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-12">
              <div className="bg-white p-6 rounded-2xl shadow md:col-span-1">
                <p className="text-gray-500 text-sm">Credit balance</p>
                <p className="text-2xl font-bold mt-1">{stats.credit ?? "0"}</p>
                <Link href="/admin/buy-cradit-provider" className="text-sm text-blue-600 underline mt-2 inline-block">
                  Buy credit
                </Link>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow md:col-span-2">
                <p className="text-gray-500 text-sm">Jobs assigned to you (all time)</p>
                <p className="text-2xl font-bold mt-1">{stats.totalAssigned}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow mb-12">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-semibold">Available jobs</h3>
                <Link href="/admin/work-list-filter" className="text-blue-600 hover:underline text-sm font-medium">
                  View all
                </Link>
              </div>
              <div className="divide-y">
                {recentOpenJobs.length === 0 && (
                  <div className="p-6 text-gray-500">No open jobs right now.</div>
                )}
                {recentOpenJobs.map((job) => (
                  <div
                    key={job.swrid}
                    className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div>
                      <Link
                        href={`/admin/work-full-detils/${job.swrid}`}
                        className="font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {job.title || "Untitled"}
                      </Link>
                      <p className="text-sm text-gray-500">
                        Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-green-600 font-bold">{formatPrice(job.price)}</span>
                      <Link
                        href={`/admin/work-full-detils/${job.swrid}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow mb-12">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-semibold">Your active jobs</h3>
                <Link href="/admin/my-work-provider" className="text-blue-600 hover:underline text-sm font-medium">
                  View all
                </Link>
              </div>
              <div className="divide-y">
                {recentActive.length === 0 && (
                  <div className="p-6 text-gray-500">No active jobs. Browse available work above.</div>
                )}
                {recentActive.map((job) => (
                  <div key={job.swrid} className="p-6 flex justify-between items-center gap-4">
                    <div>
                      <Link
                        href={`/admin/work-full-detils/${job.swrid}`}
                        className="font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {job.title || "Untitled"}
                      </Link>
                      <p className="text-sm text-gray-500">{job.status}</p>
                    </div>
                    <span className="text-yellow-700 font-medium">{formatPrice(job.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-semibold">Recently completed</h3>
                <Link href="/admin/my-work-provider" className="text-blue-600 hover:underline text-sm font-medium">
                  View all
                </Link>
              </div>
              <div className="divide-y">
                {recentCompleted.length === 0 && (
                  <div className="p-6 text-gray-500">No completed jobs yet.</div>
                )}
                {recentCompleted.map((job) => (
                  <div key={job.swrid} className="p-6 flex justify-between items-center gap-4">
                    <div>
                      <Link
                        href={`/admin/work-full-detils/${job.swrid}`}
                        className="font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {job.title || "Untitled"}
                      </Link>
                      <p className="text-sm text-gray-500">Payment: {job.paymentStatus || "—"}</p>
                    </div>
                    <span className="text-green-600 font-bold">{formatPrice(job.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
