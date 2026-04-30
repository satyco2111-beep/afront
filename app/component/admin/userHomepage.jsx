"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const base = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

function statusStyle(status) {
  const s = status || "";
  if (s === "OPEN") return "bg-yellow-100 text-yellow-800";
  if (s === "DONE" || s === "COMPLETED") return "bg-green-100 text-green-700";
  if (s === "ACCEPTED" || s === "STARTED") return "bg-blue-100 text-blue-700";
  if (s === "CANCELED") return "bg-gray-100 text-gray-700";
  return "bg-gray-100 text-gray-700";
}

export default function UserDashboardHome() {
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
        const res = await fetch(`${base}/api/user/dashboard`, {
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
  const recentWorks = data?.recentWorks || [];

  return (
    <main className="min-h-screen bg-gray-100">
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Welcome back{profile?.name ? `, ${profile.name}` : ""} 👋
            </h2>
            <p className="text-gray-600">Manage your posted work and track progress.</p>
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
                <p className="text-gray-500 text-sm">Total jobs posted</p>
                <h3 className="text-3xl font-bold mt-2">{stats.totalWorks}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-gray-500 text-sm">In progress</p>
                <h3 className="text-3xl font-bold mt-2 text-blue-600">{stats.activeWorks}</h3>
                <p className="text-xs text-gray-500 mt-1">Open, accepted, or started</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-gray-500 text-sm">Completed</p>
                <h3 className="text-3xl font-bold mt-2 text-green-600">{stats.completedWorks}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow">
                <p className="text-gray-500 text-sm">Awaiting provider</p>
                <h3 className="text-3xl font-bold mt-2 text-yellow-600">{stats.openWorks}</h3>
                <p className="text-xs text-gray-500 mt-1">Status: OPEN</p>
              </div>
            </div>

            <div className="bg-blue-600 text-white p-10 rounded-2xl mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Need something done?</h3>
                <p className="opacity-90">Post a new job and find skilled providers.</p>
              </div>
              <Link href="/admin/add-work">
                <button
                  type="button"
                  className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition"
                >
                  Post new job
                </button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-semibold">Recent jobs</h3>
                <Link href="/admin/my-work-list" className="text-blue-600 hover:underline text-sm font-medium">
                  View all
                </Link>
              </div>
              <div className="divide-y">
                {recentWorks.length === 0 && (
                  <div className="p-6 text-gray-500">No jobs yet. Post your first job above.</div>
                )}
                {recentWorks.map((job) => (
                  <div key={job.swrid} className="p-6 flex flex-wrap justify-between items-center gap-3">
                    <div>
                      <Link
                        href={`/admin/work-full-detils-number-for-user/${job.swrid}`}
                        className="font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {job.title || "Untitled"}
                      </Link>
                      <p className="text-sm text-gray-500">
                        Updated {job.updatedAt ? new Date(job.updatedAt).toLocaleDateString() : "—"}
                      </p>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${statusStyle(job.status)}`}>
                      {job.status || "—"}
                    </span>
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
