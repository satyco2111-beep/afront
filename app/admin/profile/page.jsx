"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const base = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

export default function AdminProfilePage() {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [cookieReady, setCookieReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const c = await fetch("/api/cookies");
      const d = await c.json();
      setRole(d.role ?? null);
      setToken(d.token ?? null);
      setCookieReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!token || !role) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setMessage("");
      try {
        const path = role === "2" ? `${base}/api/providers/dashboard` : `${base}/api/user/dashboard`;
        const res = await fetch(path, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok || !data.success) {
          setMessage(data.message || "Could not load profile");
          return;
        }
        const p = role === "2" ? data.profile : data.profile;
        setName(p?.name || "");
        setMobile(p?.mobile || "");
        setEmail(p?.email || "");
      } catch {
        if (!cancelled) setMessage("Network error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, role]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!token || !role) return;
    setSaving(true);
    setMessage("");
    try {
      const path = role === "2" ? `${base}/api/providers/profile` : `${base}/api/user/profile`;
      const res = await fetch(path, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, mobile }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setMessage(data.message || "Update failed");
        return;
      }
      const updated = role === "2" ? data.provider : data.user;
      if (updated) {
        setName(updated.name || "");
        setMobile(updated.mobile || "");
        setEmail(updated.email || "");
      }
      setMessage("Profile saved.");
    } catch {
      setMessage("Network error");
    } finally {
      setSaving(false);
    }
  }

  if (!cookieReady) {
    return (
      <div className="p-8 max-w-lg mx-auto text-gray-600">
        Loading…
      </div>
    );
  }

  if (!token) {
    return (
      <div className="p-8 max-w-lg mx-auto">
        <p className="text-red-600">Please log in.</p>
        <Link href="/login" className="text-blue-600 underline mt-2 inline-block">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Edit profile</h1>
          <Link href="/admin" className="text-sm text-blue-600 hover:underline">
            Dashboard
          </Link>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Update your name and mobile number. Email cannot be changed.
        </p>

        {loading ? (
          <p className="text-gray-600">Loading…</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                value={email}
                readOnly
                disabled
                autoComplete="off"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
              <input
                className="w-full border rounded-lg px-3 py-2"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                autoComplete="tel"
              />
            </div>
            {message && (
              <p className={`text-sm ${message.includes("saved") ? "text-green-600" : "text-red-600"}`}>{message}</p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-lg bg-blue-600 text-white py-2.5 font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
