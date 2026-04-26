"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// import RequestProviderComponent from "@/components/RequestProviderComponent"; // Adjust path as needed

// Helper function for relative time
const getRelativeTime = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now - past;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${diffInDays}d ago`;
};

export default function WorkDetailsPage() {
  const { id } = useParams(); // swrid

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [work, setWork] = useState(null);
  const [city, setCity] = useState(null);
  const [local, setLocal] = useState(null);
  const [service, setService] = useState(null);
  const [updatepage, setUpdatePage] = useState(1);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEN_BASE_URL;

  useEffect(() => {
    if (!id) return;

    async function fetchDetails() {
      try {
        const workRes = await fetch(`${backendUrl}/api/works/${id}`);
        const workData = await workRes.json();
        if (!workData.success) throw new Error("Work not found");

        const w = workData.work;
        setWork(w);

        const [cityRes, localRes, serviceRes] = await Promise.all([
          fetch(`${backendUrl}/api/city`),
          fetch(`${backendUrl}/api/local-aria`),
          fetch(`${backendUrl}/api/services`),
        ]);

        const cityData = await cityRes.json();
        const localData = await localRes.json();
        const serviceData = await serviceRes.json();

        setCity(cityData.citys?.find((c) => c.sctyid === w.sctyid));
        setLocal(localData.loaclArias?.find((l) => l.sloctyid === w.sloctyid));
        setService(serviceData.services?.find((s) => s.ssrvcid === w.ssrvcid));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [id, updatepage, backendUrl]);

  if (loading) return <div className="p-10 text-center animate-pulse text-gray-500">Loading work details...</div>;
  if (error) return <div className="p-10 text-center text-red-500 font-semibold">Error: {error}</div>;
  if (!work) return null;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* --- TOP HEADER --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase bg-blue-50 px-2 py-1 rounded">
                {work.swrid}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{work.title}</h1>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="text-right">
              <p className="text-xs text-gray-400 uppercase font-bold">Price</p>
              <p className="text-2xl font-bold text-green-600">${work.price}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm ${
              work.status === "REQUESTED" ? "bg-yellow-100 text-yellow-700" : "bg-emerald-100 text-emerald-700"
            }`}>
              {work.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              Job Description
            </h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {work.description || "No description provided."}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
              Location & Service
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <DetailItem label="Service" value={service?.name || work.ssrvcid} />
              <DetailItem label="City" value={city?.name || work.sctyid} />
              <DetailItem label="Local Area" value={local?.name || work.sloctyid} />
              <DetailItem label="Payment Status" value={work.paymentStatus} isStatus />
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-widest">History</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Created</span>
                <span className="font-mono text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                  {getRelativeTime(work.createdAt)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Last Activity</span>
                <span className="font-mono text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                  {getRelativeTime(work.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-widest">Customer</h3>
            <p className="text-xs text-gray-400 font-bold uppercase">User ID</p>
            <p className="text-sm font-mono text-blue-600 truncate mt-1">{work.suid}</p>
          </div>
        </div>
      </div>

      {/* --- PROVIDER REQUEST COMPONENT --- */}
      <div className="border-t border-gray-200 pt-8">
        {/* <RequestProviderComponent
          workId={work.swrid}
          workStatus={work.status}
          userId={work.suid}
          backendUrl={backendUrl}
          onRequestSent={() => setUpdatePage((prev) => prev + 1)}
        /> */}
      </div>
    </div>
  );
}

function DetailItem({ label, value, isStatus = false }) {
  return (
    <div>
      <p className="text-xs text-gray-400 font-bold uppercase mb-1">{label}</p>
      {isStatus ? (
        <span className={`text-xs font-bold px-2 py-1 rounded ${value === "UNPAID" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
          {value}
        </span>
      ) : (
        <p className="font-medium text-gray-800 bg-gray-50 p-2 rounded border border-gray-100">
          {value}
        </p>
      )}
    </div>
  );
}