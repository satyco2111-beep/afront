"use client";

import { useState } from "react";

export default function SuperAdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await fetch("/api/superadmin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || "Login failed");
        return;
      }
      window.location.href = "/superadmin/dashboard";
    } catch (e2) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="bg-white shadow rounded p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Super Admin Login</h1>

        <label className="block mb-3">
          <span className="text-sm">Email</span>
          <input
            className="w-full border rounded p-2 mt-1"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input
            className="w-full border rounded p-2 mt-1"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <button
          disabled={loading}
          className="w-full bg-black text-white rounded py-2 disabled:opacity-50"
          type="submit"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && <div className="text-red-600 text-sm mt-3">{message}</div>}
      </form>
    </div>
  );
}

