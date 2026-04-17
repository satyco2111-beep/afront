"use client";

import CommentsAndReviews from "@/app/component/CommentsAndReviews";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Example implementation for User Work Details Page
 * Shows how to use the CommentsAndReviews component
 */
export default function ExampleWorkDetailsPage() {
  const { id } = useParams();
  const [work, setWork] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEN_BASE_URL || "";

  useEffect(() => {
    async function loadData() {
      try {
        // Get current user from cookies
        const cookieRes = await fetch("/api/cookies");
        const cookieJson = await cookieRes.json();
        const currentUserId = cookieJson?.id || cookieJson?.suid;
        const currentUserType = cookieJson?.role === "2" ? "provider" : "user";

        // Get work details
        const workRes = await fetch(`${backendUrl}/api/work/${id}`);
        const workJson = await workRes.json();

        setCurrentUser({
          id: currentUserId,
          type: currentUserType,
          name: cookieJson?.name || "Unknown",
        });

        if (workJson.success) {
          setWork(workJson.work);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, backendUrl]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!work) return <div className="p-6">Work not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Work Details */}
        <div className="bg-white rounded shadow p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4">{work.title}</h1>
          <p className="text-gray-600 mb-4">{work.description}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Status:</strong> <span className="text-green-600">{work.status}</span>
            </div>
            <div>
              <strong>Budget:</strong> ${work.budget}
            </div>
          </div>
        </div>

        {/* Comments and Reviews Component */}
        <CommentsAndReviews
          workId={work.swrid}
          workStatus={work.status}
          currentUserId={currentUser?.id}
          currentUserType={currentUser?.type}
          currentUserName={currentUser?.name}
          otherUserId={work.sprovid || work.suid} // The other party (provider or user)
          backendUrl={backendUrl}
        />
      </div>
    </div>
  );
}
