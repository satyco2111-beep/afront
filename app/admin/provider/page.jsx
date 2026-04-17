"use client";

import { useEffect, useMemo, useState } from "react";

export default function ProviderAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [cities, setCities] = useState([]);
  const [localAreas, setLocalAreas] = useState([]);

  const [selectedService, setSelectedService] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocal, setSelectedLocal] = useState("");
  const [isLive, setIsLive] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEN_BASE_URL || "";

  const filteredLocalAreas = useMemo(() => {
    if (!selectedCity) return localAreas;
    return localAreas.filter((area) => area.sctyid === selectedCity);
  }, [localAreas, selectedCity]);

  useEffect(() => {
    async function load() {
      try {
        const cookieRes = await fetch("/api/cookies");
        const cookieJson = await cookieRes.json();
        const providerId = cookieJson?.id || cookieJson?.sprovid || cookieJson?.providerId;
        if (!providerId) throw new Error("Provider login required");

        const [providerRes, servicesRes, citiesRes, localRes] = await Promise.all([
          fetch(`${backendUrl}/api/providers/provider/${providerId}`),
          fetch(`${backendUrl}/api/services`),
          fetch(`${backendUrl}/api/city`),
          fetch(`${backendUrl}/api/local-aria`),
        ]);

        const providerJson = await providerRes.json();
        const servicesJson = await servicesRes.json();
        const citiesJson = await citiesRes.json();
        const localJson = await localRes.json();

        if (!providerJson.success) throw new Error(providerJson.message || "Provider not found");

        const current = providerJson.provider;
        setProvider(current);
        setServices(servicesJson.services || []);
        setCities(citiesJson.citys || []);
        setLocalAreas(localJson.loaclArias || []);

        setSelectedService(current.ssrvcid || "");
        setSelectedCity(current.sctyid || "");
        setSelectedLocal(current.sloctyid || "");
        setIsLive(Boolean(current.islive || current.isLive));
      } catch (err) {
        setError(err.message || "Failed to load provider dashboard");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [backendUrl]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!provider) return;

    setSaving(true);
    setError("");

    try {
      const payload = {
        islive: isLive,
      };

      // Only include service/city/local area if going live
      if (isLive) {
        payload.ssrvcid = selectedService;
        payload.sctyid = selectedCity;
        payload.sloctyid = selectedLocal;
      }

      const res = await fetch(`${backendUrl}/api/providers/provider/${provider.sprovid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to save provider data");

      setProvider(data.provider);
      // Update states with returned data
      setSelectedService(data.provider?.ssrvcid || "");
      setSelectedCity(data.provider?.sctyid || "");
      setSelectedLocal(data.provider?.sloctyid || "");
      alert(isLive ? "Provider is now live!" : "Provider is now offline. Service selections cleared.");
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading provider dashboard...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl bg-white rounded shadow p-6 space-y-6">
        <h1 className="text-3xl font-bold">Provider Dashboard</h1>
        <p className="text-sm text-gray-600">
          Select your service type, city, local area and go live.
        </p>

        {isLive && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
            Status: <strong>LIVE</strong> - You are currently visible to customers
          </div>
        )}
        {!isLive && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            Status: <strong>OFFLINE</strong> - You are not visible to customers
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Service Type</label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              disabled={!isLive}
              className="w-full rounded border px-3 py-2 disabled:bg-gray-200 disabled:cursor-not-allowed"
              required={isLive}
            >
              <option value="">Select service</option>
              {services.map((item) => (
                <option key={item.ssrvcid} value={item.ssrvcid}>
                  {item.name || item.service || item.title}
                </option>
              ))}
            </select>
            {!isLive && <p className="text-xs text-gray-500 mt-1">Go live to select a service</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedLocal("");
              }}
              disabled={!isLive}
              className="w-full rounded border px-3 py-2 disabled:bg-gray-200 disabled:cursor-not-allowed"
              required={isLive}
            >
              <option value="">Select city</option>
              {cities.map((item) => (
                <option key={item.sctyid} value={item.sctyid}>
                  {item.name || item.city}
                </option>
              ))}
            </select>
            {!isLive && <p className="text-xs text-gray-500 mt-1">Go live to select a city</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Local Area</label>
            <select
              value={selectedLocal}
              onChange={(e) => setSelectedLocal(e.target.value)}
              disabled={!isLive || !selectedCity}
              className="w-full rounded border px-3 py-2 disabled:bg-gray-200 disabled:cursor-not-allowed"
              required={isLive}
            >
              <option value="">Select local area</option>
              {filteredLocalAreas.map((item) => (
                <option key={item.sloctyid} value={item.sloctyid}>
                  {item.name || item.localarea}
                </option>
              ))}
            </select>
            {!isLive && <p className="text-xs text-gray-500 mt-1">Go live to select a local area</p>}
            {isLive && !selectedCity && <p className="text-xs text-gray-500 mt-1">Please select a city first</p>}
          </div>

          <div className="flex items-center gap-2 p-4 border rounded bg-gray-50">
            <input
              id="go-live"
              type="checkbox"
              checked={isLive}
              onChange={(e) => {
                setIsLive(e.target.checked);
                if (!e.target.checked) {
                  setSelectedService("");
                  setSelectedCity("");
                  setSelectedLocal("");
                }
              }}
              className="h-4 w-4"
            />
            <label htmlFor="go-live" className="text-sm font-medium">
              Go live / available
            </label>
          </div>

          <button
            type="submit"
            disabled={saving || (isLive && (!selectedService || !selectedCity || !selectedLocal))}
            className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
          >
            {saving ? "Saving..." : isLive ? "Go Live" : "Go Offline"}
          </button>
        </form>
      </div>
    </div>
  );
}
