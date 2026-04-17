"use client";

import { useEffect, useMemo, useState } from "react";

export default function WithdrawCreditPage() {
  const [cookie, setCookie] = useState({ token: null, role: null });
  const [credit, setCredit] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isUser = useMemo(() => cookie?.role === "1", [cookie?.role]);
  const base = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

  async function loadCookie() {
    const res = await fetch("/api/cookies");
    const data = await res.json();
    setCookie(data);
  }

  async function loadData() {
    if (!cookie?.token || !isUser) return;
    setLoading(true);
    try {
      const [meRes, listRes] = await Promise.all([
        fetch(`${base}/api/referrals/user/me`, {
          headers: { Authorization: `Bearer ${cookie.token}` },
        }),
        fetch(`${base}/api/user/withdrawal-requests`, {
          headers: { Authorization: `Bearer ${cookie.token}` },
        }),
      ]);
      const me = await meRes.json();
      const list = await listRes.json();
      if (me?.userCredit != null) setCredit(String(me.userCredit));
      if (list?.requests) setRequests(list.requests);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCookie();
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookie?.token, isUser]);

  async function submit(e) {
    e.preventDefault();
    if (!cookie?.token || !isUser) return;
    const amt = Number(amount);
    if (!upiId.trim()) {
      alert("Enter your UPI ID");
      return;
    }
    if (!Number.isFinite(amt) || amt <= 0) {
      alert("Enter a valid amount");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${base}/api/user/withdrawal-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie.token}`,
        },
        body: JSON.stringify({ upiId: upiId.trim(), amount: amt }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.message || "Request failed");
        return;
      }
      setUpiId("");
      setAmount("");
      await loadData();
      alert(data.message || "Request submitted");
    } finally {
      setSubmitting(false);
    }
  }

  if (!cookie?.token) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <p className="text-red-600">Please log in as a user.</p>
      </div>
    );
  }

  if (!isUser) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <p className="text-gray-700">Credit withdrawal is only available for user accounts, not provider accounts.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Withdraw credit</h1>
      <p className="text-sm text-gray-600 mb-6">
        Request a payout to your UPI. A super admin will review your request. When approved, the amount is deducted from your
        credit balance; you will receive the payment to the UPI ID you provide.
      </p>

      <div className="bg-white shadow rounded p-4 mb-6">
        <div className="text-sm text-gray-600">Your credit balance</div>
        <div className="text-2xl font-bold">{loading && credit == null ? "…" : credit ?? "0"}</div>
      </div>

      <form onSubmit={submit} className="bg-white shadow rounded p-4 space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="yourname@paytm"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount to withdraw</label>
          <input
            className="w-full border rounded px-3 py-2"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={submitting || loading}
          className="w-full rounded bg-blue-600 text-white py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit request"}
        </button>
      </form>

      <div>
        <h2 className="text-lg font-semibold mb-3">Your requests</h2>
        {requests.length === 0 ? (
          <p className="text-gray-500 text-sm">No requests yet.</p>
        ) : (
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">UPI</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.swrid} className="border-t">
                    <td className="p-2 whitespace-nowrap">{r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}</td>
                    <td className="p-2">{r.upiId}</td>
                    <td className="p-2">{r.amount}</td>
                    <td className="p-2 capitalize">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
