"use client";

import { useEffect, useMemo, useState } from "react";

export default function ReferralsPage() {
  const [cookie, setCookie] = useState({ token: null, role: null });
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);
  const [email, setEmail] = useState("");

  const isProvider = useMemo(() => cookie?.role === "2", [cookie?.role]);

  async function loadCookie() {
    const res = await fetch("/api/cookies");
    const data = await res.json();
    setCookie(data);
  }

  async function loadInfo() {
    if (!cookie?.token) return;
    setLoading(true);
    try {
      const path = isProvider ? "provider/me" : "user/me";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/referrals/${path}`,
        {
          headers: { Authorization: `Bearer ${cookie.token}` },
        }
      );
      const data = await res.json();
      setInfo(data);
    } finally {
      setLoading(false);
    }
  }

  async function sendInvite() {
    if (!email) return;
    setLoading(true);
    try {
      const path = isProvider ? "provider/invite" : "user/invite";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/referrals/${path}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie.token}`,
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Failed to send invite");
        return;
      }
      setEmail("");
      await loadInfo();
      alert("Invite sent. Referral code shared by email.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCookie();
  }, []);

  useEffect(() => {
    loadInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookie?.token, cookie?.role]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Referrals</h1>

      {!cookie?.token ? (
        <div className="text-red-600">Please login first.</div>
      ) : (
        <>
          {cookie?.role !== "2" && (
            <div className="bg-white shadow rounded p-4 mb-4">
              <div className="text-sm text-gray-600 mb-1">Your credit</div>
              <div className="text-lg font-bold">{info?.userCredit ?? "0"}</div>
              <div className="text-xs text-gray-500 mt-2">
                You earn credit when your referred user’s first work is accepted (3% of work price).
              </div>
            </div>
          )}

          <div className="bg-white shadow rounded p-4 mb-4">
            <div className="text-sm text-gray-600 mb-1">Your referral code</div>
            <div className="font-mono text-lg">{info?.referralCode || "..."}</div>
            <div className="text-xs text-gray-500 mt-2">
              Ask your friend to enter this code during signup.
            </div>
          </div>

          <div className="bg-white shadow rounded p-4 mb-4">
            <div className="font-semibold mb-2">Invite by email</div>
            <div className="flex gap-2">
              <input
                className="border p-2 rounded flex-1"
                placeholder="friend@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={sendInvite}
                disabled={loading}
                className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded p-4">
            <div className="font-semibold mb-2">Recent invites</div>
            {loading && !info ? (
              <div>Loading...</div>
            ) : (info?.invites || []).length === 0 ? (
              <div className="text-gray-600">No invites yet.</div>
            ) : (
              <div className="space-y-2">
                {info.invites.map((i) => (
                  <div key={i._id} className="border rounded p-2">
                    <div className="text-sm">
                      <span className="font-semibold">{i.inviteeEmail}</span>
                      <span className="ml-2 text-xs text-gray-500">{i.status}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(i.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

