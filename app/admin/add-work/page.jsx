"use client";

import { useEffect, useState } from "react";

export default function AddWorkPage() {
  const [cities, setCities] = useState([]);
  const [allLocalAreas, setAllLocalAreas] = useState([]);
  const [filteredLocalAreas, setFilteredLocalAreas] = useState([]);
  const [services, setServices] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    sctyid: "",
    sloctyid: "",
    ssrvcid: "",
    price: "",
    suid: "",
    sprovid: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [cookies, setCookies] = useState({ token: null, role: null, id: null });

  // GET USER ID FROM COOKIES
  useEffect(() => {
    async function fetchCookies() {
      const res = await fetch("/api/cookies", { cache: "no-store" });
      const data = await res.json();
      setCookies(data);
      setForm((p) => ({ ...p, suid: data.id }));
    }
    fetchCookies();
  }, []);

  // FETCH CITY, LOCAL AREA, SERVICE
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/city`)
      .then((res) => res.json())
      .then((data) => setCities(data.citys || []))
      .catch(console.log);

    fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/local-aria`)
      .then((res) => res.json())
      .then((data) => setAllLocalAreas(data.loaclArias || []))
      .catch(console.log);

    fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/services`)
      .then((res) => res.json())
      .then((data) => setServices(data.services || []))
      .catch(console.log);
  }, []);

  // HANDLE INPUT CHANGE
  function handleChange(e) {
    const { name, value } = e.target;

    // If city changes → filter local areas
    if (name === "sctyid") {
      setForm((p) => ({
        ...p,
        sctyid: value,
        sloctyid: "", // reset local area
      }));

      const filtered = allLocalAreas.filter(
        (l) => l.sctyid === value
      );
      setFilteredLocalAreas(filtered);
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  }

  // SUBMIT FORM
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/works/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    setLoading(false);

    if (data.success) {
      setMsg({ type: "success", text: data.message });
          // ✅ RESET FORM AFTER SUCCESS
    setForm({
      title: "",
      description: "",
      sctyid: "",
      sloctyid: "",
      ssrvcid: "",
      price: "",
      suid: cookies.id, // keep logged-in user id
      sprovid: "",
    });

    // ✅ CLEAR FILTERED LOCAL AREAS
    setFilteredLocalAreas([]);

    setTimeout(() => setMsg(null), 3000);


    } else {
      setMsg({ type: "error", text: data.message });
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Add Work</h2>
 {/* <p>dddd{process.env.NEXT_PUBLIC_BACKEN_BASE_URL}</p> */}
        {msg && (
          <p
            className={`p-2 mb-3 text-center rounded ${
              msg.type === "success" ? "bg-green-200" : "bg-red-200"
            }`}
          >
            {msg.text}
          </p>
        )}

        <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
          <input
            name="title"
            className="border p-2 rounded"
            placeholder="Work Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            className="border p-2 rounded"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />

          {/* CITY */}
          <select
            name="sctyid"
            className="border p-2 rounded"
            value={form.sctyid}
            onChange={handleChange}
            required
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c._id} value={c.sctyid}>
                {c.name}
              </option>
            ))}
          </select>

          {/* LOCAL AREA (FILTERED) */}
          <select
            name="sloctyid"
            className="border p-2 rounded"
            value={form.sloctyid}
            onChange={handleChange}
            required
            disabled={!form.sctyid}
          >
            <option value="">Select Local Area</option>
            {filteredLocalAreas.map((l) => (
              <option key={l._id} value={l.sloctyid}>
                {l.name}
              </option>
            ))}
          </select>

          {/* SERVICE */}
          <select
            name="ssrvcid"
            className="border p-2 rounded"
            value={form.ssrvcid}
            onChange={handleChange}
            required
          >
            <option value="">Select Service</option>
            {services.map((s) => (
              <option key={s._id} value={s.ssrvcid}>
                {s.name}
              </option>
            ))}
          </select>

          <input
            name="price"
            type="number"
            className="border p-2 rounded"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />

          <input
            name="sprovid"
            className="border p-2 rounded"
            placeholder="Provider ID (optional)"
            value={form.sprovid}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Submitting..." : "Add Work"}
          </button>
        </form>
      </div>
    </div>
  );
}
