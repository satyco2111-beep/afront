"use client";
import { useEffect, useState } from "react";

export default function WorksPage() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters + pagination
  const [filters, setFilters] = useState({
    page: 1,
    limit: 1,
    city: "",
    locality: "",
    title: "",
    minPrice: "",
    maxPrice: "",
    paymentStatus: "",
    status: "",
    ssrvcid: ""
  });

  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
  });

  async function fetchWorks() {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/works?${params}`);
      const data = await res.json();

      setWorks(data.works || []);
      setPagination(data.pagination || {});
    } catch (err) {
      console.error("Error loading works:", err);
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
      page: 1, // Reset to page 1 when filters change
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Works</h2>

      {/* FILTERS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <input
          className="border p-2 rounded"
          placeholder="City"
          value={filters.city}
          onChange={(e) => updateFilter("city", e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Locality"
          value={filters.locality}
          onChange={(e) => updateFilter("locality", e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Title"
          value={filters.title}
          onChange={(e) => updateFilter("title", e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => updateFilter("minPrice", e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => updateFilter("maxPrice", e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Payment Status"
          value={filters.paymentStatus}
          onChange={(e) => updateFilter("paymentStatus", e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Status"
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Service"
          value={filters.ssrvcid}
          onChange={(e) => updateFilter("ssrvcid", e.target.value)}
        />
      </div>

      <button
        onClick={fetchWorks}
        className="bg-black text-white px-4 py-2 rounded mb-4"
      >
        Apply Filters
      </button>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {works.length === 0 ? (
            <p>No works found</p>
          ) : (
            works.map((w) => (
              <div key={w._id} className="bg-white shadow p-4 rounded mb-3">
                <h3 className="font-bold">{w.title}</h3>
                <p>Status: {w.status}</p>
                <p>Payment: {w.paymentStatus}</p>
                <p>Price: {w.price}</p>
              </div>
            ))
          )}
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
