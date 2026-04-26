"use client";

import { useEffect, useState } from "react";

export default function RequestProviderReqsted({
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

  const isWorkOpen = workStatus === "OPEN" || workStatus === "REQUESTED";


  // Fetch available live providers
  useEffect(() => {
    if (!workId || !isWorkOpen) return;

    async function loadProviders() {
      setLoadingProviders(true);
      try {
        const res = await fetch(`${backendUrl}/api/providers/live`);
        const json = await res.json();
        if (json.success) {
          setProviders(json.providers || []);
        }
      } catch (err) {
        console.error("Failed to fetch providers:", err);
      } finally {
        setLoadingProviders(false);
      }
    }

    loadProviders();
  }, [workId, isWorkOpen, backendUrl]);

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

  // Check if request already sent to provider
  const hasRequestedProvider = (sprovid) => {
    return sentRequests.some(
      (req) =>
        req.sprovid === sprovid &&
        (req.status === "REQUESTED" || req.status === "ACCEPTED")
    );
  };

  // Check if there's any PENDING request for this work
  const pendingRequest = sentRequests.find((req) => req.status === "REQUESTED");

  // Can only send new request if no PENDING request exists
  const canSendNewRequest = !pendingRequest;

  if (!isWorkOpen) {
    return null;
  }

  return (
    <div className="bg-white rounded shadow p-6 mt-8">
      <h2 className="text-2xl font-semibold mb-4">Request Providers</h2>
      <p className="text-gray-600 mb-6">
        Send requests to available providers to accept this work
      </p>

      {pendingRequest && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-300 rounded">
          <p className="text-blue-800">
            <strong>⏳ You have a pending request waiting</strong>
          </p>
          <p className="text-blue-700 text-sm mt-2">
            You can only request one provider at a time. Your current request to provider is
            waiting for a response. Please wait or cancel it to request another provider.
          </p>
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
        <p className="text-gray-500">Loading available providers...</p>
      ) : providers.length === 0 ? (
        <p className="text-gray-500">No live providers available at this time.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => {
            const hasRequested = hasRequestedProvider(provider.sprovid);
            const isCurrentPending = pendingRequest?.sprovid === provider.sprovid;
            const isDisabled = !canSendNewRequest && !isCurrentPending;

            return (
              <div
                key={provider.sprovid}
                className={`border rounded p-4 ${
                  isCurrentPending
                    ? "bg-yellow-50 border-yellow-300"
                    : hasRequested
                    ? "bg-blue-50 border-blue-300"
                    : isDisabled
                    ? "bg-gray-100 border-gray-300"
                    : "bg-gray-50"
                } hover:shadow-md transition`}
              >
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {provider.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-green-600">Live</span>
                  </div>
                </div>

                {provider.mobile && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Contact:</strong> {provider.mobile}
                  </p>
                )}

                {provider.email && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Email:</strong> {provider.email}
                  </p>
                )}

                {isCurrentPending ? (
                  <button
                    disabled
                    className="w-full mt-4 bg-yellow-200 text-yellow-800 px-4 py-2 rounded font-semibold cursor-not-allowed"
                  >
                    ⏳ Awaiting Response
                  </button>
                ) : hasRequested ? (
                  <button
                    disabled
                    className="w-full mt-4 bg-blue-200 text-blue-800 px-4 py-2 rounded font-semibold cursor-not-allowed"
                  >
                    ✓ Request Sent
                  </button>
                ) : isDisabled ? (
                  <button
                    disabled
                    className="w-full mt-4 bg-gray-300 text-gray-600 px-4 py-2 rounded font-semibold cursor-not-allowed"
                    title="Cancel your pending request first to request another provider"
                  >
                    Cannot Request
                  </button>
                ) : (
                  <button
                    onClick={() => handleSendRequest(provider.sprovid)}
                    disabled={submittingRequestId === provider.sprovid}
                    className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold disabled:opacity-50 transition"
                  >
                    {submittingRequestId === provider.sprovid
                      ? "Sending..."
                      : "Send Request"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
