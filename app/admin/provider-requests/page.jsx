"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProviderRequestsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("PENDING"); // PENDING, ACCEPTED, REJECTED
  const backendUrl = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

  // Fetch current user from cookies
  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const res = await fetch("/api/cookies");
        const json = await res.json();
        setCurrentUser({
          id: json?.id,
          type: json?.role === "2" ? "provider" : "user",
          name: json?.name || "Unknown",
        });
      } catch (err) {
        console.error("Failed to fetch current user:", err);
      }
    }

    loadCurrentUser();
  }, []);

  // Fetch provider requests
  useEffect(() => {
    if (!currentUser?.id) return;

    async function loadRequests() {
      setLoading(true);
      try {
        const res = await fetch(
          `${backendUrl}/api/work-requests/provider/${currentUser.id}`
        );
        const json = await res.json();
        if (json.success) {
          setRequests(json.requests || []);
        }
      } catch (err) {
        console.error("Failed to fetch requests:", err);
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, [currentUser?.id, backendUrl]);

  // Mark request as seen
  const markAsSeen = async (srequestid) => {
    try {
      await fetch(`${backendUrl}/api/work-requests/mark-seen/${srequestid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      // Update local state
      setRequests(
        requests.map((req) =>
          req.srequestid === srequestid ? { ...req, isSeen: true } : req
        )
      );
    } catch (err) {
      console.error("Failed to mark as seen:", err);
    }
  };

  // Navigate to work details and mark as seen
  const handleViewWork = (workId, srequestid) => {
    markAsSeen(srequestid);
    router.push(`/admin/work-full-detils-number/${workId}`);
  };

  // Accept request
  const handleAcceptRequest = async (srequestid) => {
    try {
      const res = await fetch(
        `${backendUrl}/api/work-requests/accept/${srequestid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();
      if (data.success) {
        // Update request status
        setRequests(
          requests.map((req) =>
            req.srequestid === srequestid
              ? { ...req, status: "ACCEPTED" }
              : req
          )
        );
        alert("Work request accepted! Work status updated to ACCEPTED.");
      } else {
        alert(`Failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Failed to accept request:", err);
      alert("Failed to accept request");
    }
  };

  // Reject request
  const handleRejectRequest = async (srequestid) => {
    if (!confirm("Are you sure you want to reject this request?")) return;

    try {
      const res = await fetch(
        `${backendUrl}/api/work-requests/reject/${srequestid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();
      if (data.success) {
        // Update request status
        setRequests(
          requests.map((req) =>
            req.srequestid === srequestid
              ? { ...req, status: "REJECTED" }
              : req
          )
        );
        alert("Request rejected successfully.");
      } else {
        alert(`Failed: ${data.message}`);
      }
    } catch (err) {
      console.error("Failed to reject request:", err);
      alert("Failed to reject request");
    }
  };

  const filteredRequests = requests.filter((req) => req.status === filter);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Work Requests</h1>
        <p className="text-gray-600 mb-8">
          View and manage work requests from users
        </p>

        {!currentUser || currentUser.type !== "provider" ? (
          <div className="bg-red-50 border border-red-300 rounded p-6">
            <p className="text-red-800">
              This page is only accessible to providers.
            </p>
          </div>
        ) : (
          <>
            {/* Filter Tabs */}
            <div className="flex-wrap gap-4 mb-8 flex justify-center mt-4">
              {["PENDING", "ACCEPTED", "REJECTED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-6 py-3 rounded font-semibold transition flex-wrap items-center gap-2  ${
                    filter === status
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {status === "PENDING" && "📭"}
                  {status === "ACCEPTED" && "✅"}
                  {status === "REJECTED" && "❌"}
                  {` ${status} (${requests.filter((r) => r.status === status).length})`}
                </button>
              ))}
            </div>

            {/* Requests List */}
            {loading ? (
              <p className="text-gray-500 text-center py-12">
                Loading requests...
              </p>
            ) : filteredRequests.length === 0 ? (
              <div className="bg-white rounded shadow p-12 text-center">
                <p className="text-gray-500 text-lg">
                  No {filter.toLowerCase()} requests at this time.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <div
                    key={request.srequestid}
                    className={`bg-white rounded shadow p-6 border-l-4 ${
                      request.status === "PENDING"
                        ? "border-yellow-500"
                        : request.status === "ACCEPTED"
                        ? "border-green-500"
                        : "border-red-500"
                    } ${!request.isSeen && request.status === "PENDING" ? "bg-yellow-50" : ""}`}
                  >
                    {/* Request Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {request.work?.title || "Work Title"}
                        </h3>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-600">
                            <strong>From:</strong> {request.work?.suid}
                          </span>
                          <span className={`text-sm font-semibold px-3 py-1 rounded ${
                            request.status === "PENDING"
                              ? "bg-yellow-200 text-yellow-800"
                              : request.status === "ACCEPTED"
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}>
                            {!request.isSeen && request.status === "PENDING" ? "🔴 NEW" : request.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Work Details */}
                    {request.work && (
                      <div className="bg-gray-50 rounded p-4 mb-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Price</p>
                            <p className="font-semibold text-gray-800">
                              ₹{request.work.price}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Status</p>
                            <p className="font-semibold text-gray-800">
                              {request.work.status}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Posted On</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(request.work.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Request Date</p>
                            <p className="font-semibold text-gray-800">
                              {new Date(request.requestedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {request.work.description && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-gray-600 text-sm mb-2">Description:</p>
                            <p className="text-gray-800">{request.work.description}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Request Message */}
                    {request.message && (
                      <div className="mb-4 p-3 bg-blue-50 rounded border-l-2 border-blue-400">
                        <p className="text-sm text-gray-600 mb-1">User Message:</p>
                        <p className="text-gray-800">{request.message}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-4 flex-wrap">
                      <button
                        onClick={() =>
                          handleViewWork(request.swrid, request.srequestid)
                        }
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition"
                      >
                        👁️ View Work Details
                      </button>

                      {request.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleAcceptRequest(request.srequestid)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold transition"
                          >
                            ✅ Accept Request
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.srequestid)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold transition"
                          >
                            ❌ Reject Request
                          </button>
                        </>
                      )}

                      {request.status === "ACCEPTED" && (
                        <button
                          disabled
                          className="flex-1 bg-green-200 text-green-800 px-6 py-2 rounded font-semibold cursor-not-allowed"
                        >
                          ✓ Work Accepted
                        </button>
                      )}

                      {request.status === "REJECTED" && (
                        <button
                          disabled
                          className="flex-1 bg-red-200 text-red-800 px-6 py-2 rounded font-semibold cursor-not-allowed"
                        >
                          ✗ Request Rejected
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
