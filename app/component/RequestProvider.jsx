"use client";

import { useEffect, useState } from "react";

export default function RequestProviderComponent({
  workId,
  workStatus,
  userId,
  backendUrl,
  onRequestSent,
}) {
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [sentRequests, setSentRequests] = useState([]);
  const [submittingRequestId, setSubmittingRequestId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5  ;

  // Filter states
  const [services, setServices] = useState([]);
  const [cities, setCities] = useState([]);
  const [localAreas, setLocalAreas] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocal, setSelectedLocal] = useState("");

  const isWorkOpen = workStatus === "OPEN" || workStatus === "REQUESTED";

  // Fetch filter options
  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const [servicesRes, citiesRes, localRes] = await Promise.all([
          fetch(`${backendUrl}/api/services`),
          fetch(`${backendUrl}/api/city`),
          fetch(`${backendUrl}/api/local-aria`),
        ]);

        const servicesData = await servicesRes.json();
        const citiesData = await citiesRes.json();
        const localData = await localRes.json();

        if (servicesData.success) setServices(servicesData.services || []);
        if (citiesData.success) setCities(citiesData.citys || []);
        if (localData.success) setLocalAreas(localData.loaclArias || []);
      } catch (err) {
        console.error("Failed to fetch filter options:", err);
      }
    }

    loadFilterOptions();
  }, [backendUrl]);

  // Fetch available live providers with filters and pagination
  useEffect(() => {
    if (!workId || !isWorkOpen) return;

    async function loadProviders() {
      setLoadingProviders(true);
      try {
        const params = new URLSearchParams();
        if (selectedService) params.append("ssrvcid", selectedService);
        if (selectedCity) params.append("sctyid", selectedCity);
        if (selectedLocal) params.append("sloctyid", selectedLocal);
        
        // Add pagination params
        params.append("page", currentPage);
        params.append("limit", itemsPerPage);

        const url = `${backendUrl}/api/providers/live?${params.toString()}`;
        const res = await fetch(url);
        const json = await res.json();
        if (json.success) {
          setProviders(json.providers || []);
          setTotalPages(json.totalPages || 1);
        }
      } catch (err) {
        console.error("Failed to fetch providers:", err);
      } finally {
        setLoadingProviders(false);
      }
    }

    loadProviders();
  }, [workId, isWorkOpen, backendUrl, selectedService, selectedCity, selectedLocal, currentPage]);

  // Filter change handlers
  const handleServiceChange = (e) => {
    setSelectedService(e.target.value);
    setSelectedCity("");
    setSelectedLocal("");
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedLocal("");
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const handleLocalChange = (e) => {
    setSelectedLocal(e.target.value);
    setCurrentPage(1); // Reset to page 1 on filter change
  };

  const clearFilters = () => {
    setSelectedService("");
    setSelectedCity("");
    setSelectedLocal("");
    setCurrentPage(1);
  };

  // Fetch sent requests for this work
  useEffect(() => {
    if (!workId) return;

    async function loadRequests() {
      try {
        const res = await fetch(`${backendUrl}/api/work-requests/work/${workId}`);
        const json = await res.json();
        if (json.success) {
          setSentRequests(json.requests || []);
        }
      } catch (err) {
        console.error("Failed to fetch requests:", err);
      }
    }

    loadRequests();
  }, [workId, backendUrl]);

  // Send request to provider
  const handleSendRequest = async (sprovid) => {
    setSubmittingRequestId(sprovid);
    try {
      const res = await fetch(`${backendUrl}/api/work-requests/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          swrid: workId,
          sprovid,
          suid: userId,
          message: `I would like you to work on this project`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSentRequests([...sentRequests, data.request]);
        alert("Request sent successfully!");
        if (onRequestSent) onRequestSent();
      } else {
        alert(`Failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Failed to send request:", err);
      alert("Failed to send request");
    } finally {
      setSubmittingRequestId(null);
    }
  };

  // Cancel request
  const handleCancelRequest = async (srequestid) => {
    if (!confirm("Are you sure you want to cancel this request?")) return;

    setSubmittingRequestId("cancel");
    try {
      const res = await fetch(`${backendUrl}/api/work-requests/cancel/${srequestid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.success) {
        setSentRequests(
          sentRequests.map((req) =>
            req.srequestid === srequestid ? { ...req, status: "CANCELLED" } : req
          )
        );
        alert("Request cancelled successfully!");
      } else {
        alert(`Failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Failed to cancel request:", err);
      alert("Failed to cancel request");
    } finally {
      setSubmittingRequestId(null);
    }
  };

  const hasRequestedProvider = (sprovid) => {
    return sentRequests.some(
      (req) =>
        req.sprovid === sprovid &&
        (req.status === "PENDING" || req.status === "ACCEPTED")
    );
  };

  const pendingRequest = sentRequests.find((req) => req.status === "PENDING");
  const canSendNewRequest = !pendingRequest;

  if (!isWorkOpen) return null;

  return (
    <div className="bg-white rounded shadow p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4">Request Providers</h2>
      <p className="text-gray-600 mb-6">
        Send requests to available providers to accept this work
      </p>

      {/* Filter Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Service</label>
            <select
              value={selectedService}
              onChange={handleServiceChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Services</option>
              {services.map((service) => (
                <option key={service.ssrvcid} value={service.ssrvcid}>{service.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by City</label>
            <select
              value={selectedCity}
              onChange={handleCityChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city.sctyid} value={city.sctyid}>{city.name}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Local Area</label>
            <select
              value={selectedLocal}
              onChange={handleLocalChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedCity}
            >
              <option value="">All Areas</option>
              {localAreas
                .filter((local) => !selectedCity || local.sctyid === selectedCity)
                .map((local) => (
                  <option key={local.sloctyid} value={local.sloctyid}>{local.name}</option>
                ))}
            </select>
          </div>

          <button onClick={clearFilters} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition">
            Clear Filters
          </button>
        </div>
      </div>

      {pendingRequest && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-300 rounded">
          <p className="text-blue-800"><strong>⏳ You have a pending request waiting</strong></p>
          <button
            onClick={() => handleCancelRequest(pendingRequest.srequestid)}
            disabled={submittingRequestId === "cancel"}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline disabled:opacity-50"
          >
            {submittingRequestId === "cancel" ? "Cancelling..." : "Cancel This Request"}
          </button>
        </div>
      )}

      {loadingProviders ? (
        <p className="text-gray-500 text-center py-10">Loading available providers...</p>
      ) : providers.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No live providers available at this time.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => {
              const hasRequested = hasRequestedProvider(provider.sprovid);
              const isCurrentPending = pendingRequest?.sprovid === provider.sprovid;
              const isDisabled = !canSendNewRequest && !isCurrentPending;

              return (
                <div key={provider.sprovid} className={`border rounded p-4 ${isCurrentPending ? "bg-yellow-50 border-yellow-300" : hasRequested ? "bg-blue-50 border-blue-300" : isDisabled ? "bg-gray-100 border-gray-300" : "bg-gray-50"} hover:shadow-md transition`}>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-sm text-green-600">Live</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2"><strong>Rating:</strong> {(Math.random() * 4 + 1).toFixed(1)} / 5</p>

                  {isCurrentPending ? (
                    <button disabled className="w-full mt-4 bg-yellow-200 text-yellow-800 px-4 py-2 rounded font-semibold cursor-not-allowed">⏳ Awaiting Response</button>
                  ) : hasRequested ? (
                    <button disabled className="w-full mt-4 bg-blue-200 text-blue-800 px-4 py-2 rounded font-semibold cursor-not-allowed">✓ Request Sent</button>
                  ) : isDisabled ? (
                    <button disabled className="w-full mt-4 bg-gray-300 text-gray-600 px-4 py-2 rounded font-semibold cursor-not-allowed">Cannot Request</button>
                  ) : (
                    <button
                      onClick={() => handleSendRequest(provider.sprovid)}
                      disabled={submittingRequestId === provider.sprovid}
                      className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold disabled:opacity-50 transition"
                    >
                      {submittingRequestId === provider.sprovid ? "Sending..." : "Send Request"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-10">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 border rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 border rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}