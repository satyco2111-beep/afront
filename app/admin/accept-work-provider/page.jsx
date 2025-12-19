"use client";
import { useEffect, useState } from "react";

export default function ProviderWorksPage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [cities, setCities] = useState([]);
  const [localArias, setLocalArias] = useState([]);
  const [filteredLocalArias, setFilteredLocalArias] = useState([]);

  // Filters + pagination
  const [filters, setFilters] = useState({
    page: 1,
    limit: 3,
    city: "",
    locality: "",
    title: "",
    status: "OPEN",
  });

  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
  });

  // ------------------------------------
  // LOAD CITY + LOCAL ARIA
  // ------------------------------------
  useEffect(() => {
    async function loadMeta() {
      const c = await fetch("http://localhost:8000/api/city");
      const citiesData = await c.json();
      setCities(citiesData.citys);

      const la = await fetch("http://localhost:8000/api/local-aria");
      const localData = await la.json();
      setLocalArias(localData.loaclArias);
    }
    loadMeta();
  }, []);

  // When city changes → filter local areas
  useEffect(() => {
    if (!filters.city) {
      setFilteredLocalArias([]);
      return;
    }
    const list = localArias.filter((l) => l.sctyid === filters.city);
    setFilteredLocalArias(list);
  }, [filters.city, localArias]);

  // ------------------------------------
  // FETCH WORKS
  // ------------------------------------
  async function fetchWorks() {
    setLoading(true);

    try {
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`http://localhost:8000/api/works?${params}`);
      const data = await res.json();

      setWorks(data.works || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error("Error:", err);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchWorks();
  }, [filters.page]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  // ------------------------------------
  // ACCEPT WORK
  // ------------------------------------
  async function acceptWork(swrid) {
    const cookie = await fetch("/api/cookies");
    const { id } = await cookie.json();

    await fetch(`http://localhost:8000/api/works/${swrid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ACCEPTED", sprovid: id }),
    });

    fetchWorks();
  }

  // ------------------------------------
  // UI
  // ------------------------------------
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Works</h2>

      {/* FILTERS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">

        {/* Title Search */}
        <input
          className="border p-2 rounded"
          placeholder="Search title"
          value={filters.title}
          onChange={(e) => updateFilter("title", e.target.value)}
        />

        {/* City Select */}
        <select
          className="border p-2 rounded"
          value={filters.city}
          onChange={(e) => updateFilter("city", e.target.value)}
        >
          <option value="">Select City</option>
          {cities.map((c) => (
            <option key={c.sctyid} value={c.sctyid}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Local Area Select */}
        <select
          className="border p-2 rounded"
          value={filters.locality}
          onChange={(e) => updateFilter("locality", e.target.value)}
          disabled={!filters.city}
        >
          <option value="">Local Area</option>
          {filteredLocalArias.map((l) => (
            <option key={l.sloctyid} value={l.sloctyid}>
              {l.name}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          className="border p-2 rounded"
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
        >
          <option value="OPEN">Open</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="INPROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <button
        onClick={fetchWorks}
        className="bg-black text-white px-4 py-2 rounded mb-4"
      >
        Apply Filters
      </button>

      {/* WORK LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : works.length === 0 ? (
        <p>No works found</p>
      ) : (
        <div>
          {works.map((w) => (
            <div key={w._id} className="bg-white shadow p-4 rounded mb-3">
              <h3 className="font-bold text-lg">{w.title}</h3>
              <p>City: {w.sctyid}</p>
              <p>Locality: {w.sloctyid}</p>
              <p>Status: {w.status}</p>
              <p>Price: ₹{w.price}</p>

              {w.status === "OPEN" && (
                <button
                  onClick={() => acceptWork(w.swrid)}
                  className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
                >
                  Accept Work
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="flex items-center gap-4 mt-6">
        <button
          disabled={filters.page <= 1}
          onClick={() =>
            setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
          }
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {pagination.currentPage || 1} of {pagination.totalPages || 1}
        </span>

        <button
          disabled={filters.page >= pagination.totalPages}
          onClick={() =>
            setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
          }
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
