
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CommentsAndReviews from "@/app/component/CommentsAndReviews";

export default function WorkDetailsPage() {
  const { id } = useParams(); // swrid

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const [work, setWork] = useState(null);
  const [user, setUser] = useState(null);
  const [city, setCity] = useState(null);
  const [local, setLocal] = useState(null);
  const [service, setService] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [providerReviews, setProviderReviews] = useState([]);
  const [loadingProviderReviews, setLoadingProviderReviews] = useState(false);

  // 🔁 FETCH ALL DETAILS
  useEffect(() => {
    if (!id) return;

    async function fetchDetails() {
      try {
        const cookieRes = await fetch("/api/cookies");
        const cookieJson = await cookieRes.json();
        setCurrentUser({
          id: cookieJson?.id,
          type: cookieJson?.role === "2" ? "provider" : "user",
          name: cookieJson?.name || "Unknown",
        });

        const workRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/works/${id}`);
        const workData = await workRes.json();
        if (!workData.success) throw new Error("Work not found");

        const w = workData.work;
        setWork(w);

        const [
          providerRes,
          cityRes,
          localRes,
          serviceRes,
        ] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/providers/provider/${w.sprovid ? w.sprovid :1}`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/city`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/local-aria`),
          fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/services`),
        ]);

        const providerData = await providerRes.json();
        const cityData = await cityRes.json();
        const localData = await localRes.json();
        const serviceData = await serviceRes.json();
        console.log("providerData",providerData)
        setUser(providerData?.provider || null);
        setCity(cityData.citys.find(c => c.sctyid === w.sctyid));
        setLocal(localData.loaclArias.find(l => l.sloctyid === w.sloctyid));
        setService(serviceData.services.find(s => s.ssrvcid === w.ssrvcid));

        // Fetch provider reviews if work is ACCEPTED
        if (w.status === "ACCEPTED" && w.sprovid) {
          setLoadingProviderReviews(true);
          try {
            const reviewRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/review/provider/${w.sprovid}`);
            const reviewData = await reviewRes.json();
            if (reviewData.success) {
              setProviderReviews(reviewData.reviews || []);
            }
          } catch (err) {
            console.error("Failed to fetch provider reviews:", err);
          } finally {
            setLoadingProviderReviews(false);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [id]);


      // updateStatus  CANCELED  with Provider ================ byUserCanceleWork

   const updateStausCancele = async (providerId) => {
    if (!work) return;
    //    const cookie = await fetch("/api/cookies");
    // const { id } = await cookie.json();

    try {
      setActionLoading(true);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/providers/payment-complete/${providerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({sprovid: providerId }),
      });

      const data = await res.json();
      if (!data.success) throw new Error("Failed to update complete Pay status");
      


      // ====
      const resUpW = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/works/byUserCanceleWork/${work.swrid}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "CANCELED" }),
        }
      );

      const dataW = await resUpW.json();
      if (!dataW.success) throw new Error("Failed to update status");

      setWork(dataW.work);


      // setWork(data.work); // update UI instantly
            // setUpdatePage(3)
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

        // updateStatus  CANCELED  byUserCanceleWork ================ 

   const byUserCanceleWork = async () => {
    if (!work) return;
    //    const cookie = await fetch("/api/cookies");
    // const { id } = await cookie.json();

    try {
      setActionLoading(true);
      // ====
            const resUpW = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/works/byUserCanceleWork/${work.swrid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELED" }),
      });

      const dataW = await resUpW.json();
      if (!dataW.success) throw new Error("Failed to update status");

      setWork(dataW.work);

    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const reopenWorkByUser = async () => {
    if (!work) return;

    try {
      setActionLoading(true);

      const cookieRes = await fetch("/api/cookies");
      const { token } = await cookieRes.json();
      if (!token) throw new Error("Please login again");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/works/byuser/${work.swrid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "OPEN" }),
        }
      );

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to reopen work");
      setWork(data.work);
      setUser(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };
  



  if (loading) {
    return <div className="p-6 text-center">Loading work details...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="max-w-4xl w-full bg-white rounded shadow p-6 space-y-6">

        {/* WORK INFO */}
        <section>
          <h1 className="text-3xl font-bold">{work.title}</h1>
          <p className="text-gray-600 mt-2">{work.description}</p>

          <div className="mt-4 flex flex-wrap gap-4">
            <span className="bg-blue-100 px-3 py-1 rounded">
              Price: ₹{work.price}
            </span>
            <span className="bg-green-100 px-3 py-1 rounded">
              Status: {work.status || "pending"}
            </span>
            <span className="bg-yellow-100 px-3 py-1 rounded">
              Payment: {work.paymentStatus || "unpaid"}
            </span>
          </div>
        </section>

        {/* LOCATION */}
        <section className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Location</h2>
          <p>🏙 City: <b>{city?.name || "N/A"}</b></p>
          <p>📍 Local Area: <b>{local?.name || "N/A"}</b></p>
        </section>

        {/* SERVICE */}
        <section className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Service</h2>
          <p>🛠 {service?.name || "N/A"}</p>
        </section>

        {/* USER DETAILS */}
        {work.sprovid && user && work.status !== "DONE" ?
        <section className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">ACCEPTED BY</h2>
          <p>👤 Name: <b>{user?.name}</b></p>
          <p>📧 Email: <b>{user?.email}</b></p>
          <p>📧 Mobile: <b>{user?.mobile}</b></p>
          {/* <p>🆔 User ID: {user?.suid}</p> */}
          <div className="flex gap-4 mt-2">
            {/* Call */}
            <a
              href={`tel:${user?.mobile}`}
              className="text-blue-600 hover:underline"
            >
              📞 Call
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${user?.mobile}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              💬 WhatsApp Chat
            </a>

            {/* Email */}
            <a
              href={`mailto:${user?.email}`}
              className="text-red-600 hover:underline"
            >
              ✉️ Email
            </a>
          </div>
        </section>:null}
          {/* {work.status !== "COMPLETED"? <h2 className="text-xl font-semibold mb-2">Action</h2>:null} */}

      

        {/* META */}
        <section className="border-t pt-4 text-sm text-gray-500">

          
             {work.status === "OPEN"?
            <button
              disabled={actionLoading}
              onClick={() => byUserCanceleWork()}
              className="bg-red-300 px-4 py-2 rounded disabled:opacity-50"
            >
              {actionLoading ? "Please wait..." : "CANCELE"}
            </button>:null}


               {work.status === "ACCEPTED"?
            <button
              disabled={actionLoading}
              onClick={() => updateStausCancele(user?.sprovid)}
              className="bg-red-300 px-4 py-2 rounded disabled:opacity-50"
            >
              {actionLoading ? "Please wait..." : "CANCELE"}
            </button>:null}

            {["CANCELED", "CANCELLED"].includes(work.status) ? (
              <button
                disabled={actionLoading}
                onClick={reopenWorkByUser}
                className="bg-green-300 px-4 py-2 rounded disabled:opacity-50 ml-2"
              >
                {actionLoading ? "Please wait..." : "REOPEN"}
              </button>
            ) : null}
          {/* <p>Work ID: {work.swrid}</p> */}
          <p>Created At: {new Date(work.createdAt).toLocaleString()}</p>
        </section>

        {/* PROVIDER REVIEWS - Show when work is ACCEPTED */}
        {work && work.status === "ACCEPTED" && user && (
          <section className="border-t pt-4 mt-6">
            <h2 className="text-2xl font-semibold mb-4">About This Provider</h2>
            <div className="bg-white rounded shadow p-6">
              <h3 className="text-xl font-semibold mb-4">{user.name}'s Reviews</h3>
              
              {loadingProviderReviews ? (
                <p className="text-gray-500">Loading provider reviews...</p>
              ) : providerReviews.length === 0 ? (
                <p className="text-gray-500">This provider has no reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {providerReviews.slice(0, 5).map((review) => (
                    <div key={review.sreviewid} className="border rounded p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <strong className="text-gray-800">{review.authorName}</strong>
                          <span className="text-xs text-gray-500 ml-2">(User)</span>
                        </div>
                        <div className="text-lg">
                          {[...Array( review.rating)].map((_, i) => (
                            <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.review}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  {providerReviews.length > 5 && (
                    <p className="text-center text-gray-500 text-sm mt-4">
                      +{providerReviews.length - 5} more reviews
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* COMMENTS AND REVIEWS */}
        {currentUser && work && (
          <CommentsAndReviews
            workId={work.swrid}
            workStatus={work.status}
            currentUserId={currentUser.id}
            currentUserType={currentUser.type}
            currentUserName={currentUser.name}
            otherUserId={work.sprovid}
            backendUrl={process.env.NEXT_PUBLIC_BACKEN_BASE_URL}
          />
        )}

      </div>
    </div>
  );
}

