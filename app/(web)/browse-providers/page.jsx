"use client";

import { useEffect, useState } from "react";

export default function BrowseProvidersPage() {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [cities, setCities] = useState([]);
  const [localAreas, setLocalAreas] = useState([]);
  const [providers, setProviders] = useState([]);

  const [selectedService, setSelectedService] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocal, setSelectedLocal] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEN_BASE_URL || "";

  // Load all live providers by default on page load
  useEffect(() => {
    async function loadAllProviders() {
      setLoading(true);
      try {
        const res = await fetch(`${backendUrl}/api/providers/live`);
        const json = await res.json();
        if (json.success) {
          setProviders(json.providers || []);
        }
      } catch (err) {
        console.error("Failed to fetch providers:", err);
      } finally {
        setLoading(false);
      }
    }

    if (backendUrl) {
      loadAllProviders();
    }
  }, [backendUrl]);

  // Fetch dropdown data
  useEffect(() => {
    async function loadData() {
      try {
        const [servicesRes, citiesRes, localRes] = await Promise.all([
          fetch(`${backendUrl}/api/services`),
          fetch(`${backendUrl}/api/city`),
          fetch(`${backendUrl}/api/local-aria`),
        ]);

        const servicesJson = await servicesRes.json();
        const citiesJson = await citiesRes.json();
        const localJson = await localRes.json();

        setServices(servicesJson.services || []);
        setCities(citiesJson.citys || []);
        setLocalAreas(localJson.loaclArias || []);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    }

    loadData();
  }, [backendUrl]);

  // Fetch live providers based on filters
  const handleFilter = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedService) params.append("ssrvcid", selectedService);
      if (selectedCity) params.append("sctyid", selectedCity);
      if (selectedLocal) params.append("sloctyid", selectedLocal);

      const res = await fetch(`${backendUrl}/api/providers/live?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setProviders(json.providers || []);
      }
    } catch (err) {
      console.error("Failed to fetch providers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLocalAreas = selectedCity
    ? localAreas.filter((area) => area.sctyid === selectedCity)
    : localAreas;

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedLocal("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Browse Live Providers</h1>
        <p className="text-gray-600 mb-8">Filter providers by service type, city, and location</p>

        {/* Filter Section */}
        <div className="bg-white rounded shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Filter Providers</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Service Type</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full rounded border px-3 py-2"
              >
                <option value="">All Services</option>
                {services.map((item) => (
                  <option key={item.ssrvcid} value={item.ssrvcid}>
                    {item.name || item.service || item.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <select
                value={selectedCity}
                onChange={handleCityChange}
                className="w-full rounded border px-3 py-2"
              >
                <option value="">All Cities</option>
                {cities.map((item) => (
                  <option key={item.sctyid} value={item.sctyid}>
                    {item.name || item.city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Local Area</label>
              <select
                value={selectedLocal}
                onChange={(e) => setSelectedLocal(e.target.value)}
                className="w-full rounded border px-3 py-2"
              >
                <option value="">All Areas</option>
                {filteredLocalAreas.map((item) => (
                  <option key={item.sloctyid} value={item.sloctyid}>
                    {item.name || item.localarea}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleFilter}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold disabled:opacity-50 transition"
          >
            {loading ? "Searching..." : "Search Providers"}
          </button>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded shadow p-6">
          <div className="mb-6 p-4 bg-blue-50 rounded border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900">
              Live Providers Found: <span className="text-2xl">{providers.length}</span>
            </h3>
            {selectedService && (
              <p className="text-sm text-blue-700 mt-1">
                Service: {services.find((s) => s.ssrvcid === selectedService)?.name || selectedService}
              </p>
            )}
            {selectedCity && (
              <p className="text-sm text-blue-700">
                City: {cities.find((c) => c.sctyid === selectedCity)?.name || selectedCity}
              </p>
            )}
            {selectedLocal && (
              <p className="text-sm text-blue-700">
                Area: {localAreas.find((a) => a.sloctyid === selectedLocal)?.name || selectedLocal}
              </p>
            )}
          </div>

          {/* {providers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No providers found. Try adjusting your search or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <div key={provider.sprovid} className="border rounded p-6 bg-gray-50 hover:shadow-lg transition">
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold text-gray-800">{provider.name}</h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                      <span className="text-sm text-green-600 font-medium">Live & Available</span>
                    </div>
                  </div>

                  {provider.mobile && (
                    <p className="text-sm text-gray-600">
                      <strong>Contact:</strong> {provider.mobile}
                    </p>
                  )}

                  {provider.ssrvcid && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Service:</strong> {services.find((s) => s.ssrvcid === provider.ssrvcid)?.name || provider.ssrvcid}
                    </p>
                  )}

                  {provider.sctyid && (
                    <p className="text-sm text-gray-600">
                      <strong>City:</strong> {cities.find((c) => c.sctyid === provider.sctyid)?.name || provider.sctyid}
                    </p>
                  )}

                  {provider.sloctyid && (
                    <p className="text-sm text-gray-600">
                      <strong>Area:</strong> {localAreas.find((a) => a.sloctyid === provider.sloctyid)?.name || provider.sloctyid}
                    </p>
                  )}

                  <button className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold transition">
                    Hire Provider
                  </button>
                </div>
              ))}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
