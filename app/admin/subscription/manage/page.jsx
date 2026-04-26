"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SubscriptionPlanManagementPage() {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [backendUrl] = useState(process.env.NEXT_PUBLIC_BACKEN_BASE_URL);
  const [currentUser, setCurrentUser] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/cookies");
      const data = await res.json();
      
      // Check if super admin (role === "0")
      if (data.role !== "0") {
        alert("Access denied. Super admin only.");
        router.push("/admin");
        return;
      }
      
      setCurrentUser({ id: data.id, role: data.role });
    } catch (err) {
      console.error("Auth check failed:", err);
      router.push("/admin");
    }
  };

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    features: "",
    maxWorks: "",
    maxWorkRequests: "",
    sortOrder: "0",
    isActive: true,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/subscription/plans`);
      const data = await res.json();
      if (data.success) {
        setPlans(data.plans || []);
      }
    } catch (err) {
      console.error("Failed to fetch plans:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Parse features from comma-separated string to array
      const featuresArray = formData.features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f);

      const res = await fetch(`${backendUrl}/api/subscription/plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
          maxWorks: formData.maxWorks ? Number(formData.maxWorks) : null,
          maxWorkRequests: formData.maxWorkRequests ? Number(formData.maxWorkRequests) : null,
          sortOrder: Number(formData.sortOrder),
          features: featuresArray,
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        alert("Plan created successfully!");
        setFormData({
          name: "",
          description: "",
          amount: "",
          features: "",
          maxWorks: "",
          maxWorkRequests: "",
          sortOrder: "0",
          isActive: true,
        });
        fetchPlans();
      } else {
        alert(data.message || "Failed to create plan");
      }
    } catch (err) {
      console.error("Create plan error:", err);
      alert("Failed to create plan");
    } finally {
      setSaving(false);
    }
  };

  const togglePlanStatus = async (planId, currentStatus) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? "deactivate" : "activate"} this plan?`)) {
      return;
    }

    try {
      // For now, we'll just show a message - could add toggle endpoint later
      alert("Plan status toggle coming soon!");
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold">Verifying access...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Subscription Plan Management
        </h1>

        {/* Create Plan Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Plan</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Plan Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Basic, Pro, Enterprise"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (INR) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 299"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Short description of the plan"
                />
              </div>

              {/* Features */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features (comma-separated)
                </label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Up to 5 works, Priority support, Analytics"
                />
              </div>

              {/* Max Works */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Active Works (leave empty for unlimited)
                </label>
                <input
                  type="number"
                  name="maxWorks"
                  value={formData.maxWorks}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 5"
                />
              </div>

              {/* Max Work Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Work Requests/month (leave empty for unlimited)
                </label>
                <input
                  type="number"
                  name="maxWorkRequests"
                  value={formData.maxWorkRequests}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 10"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  name="sortOrder"
                  value={formData.sortOrder}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              {/* Active Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="isActive"
                  value={formData.isActive}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-semibold disabled:opacity-50 transition"
              >
                {saving ? "Creating..." : "Create Plan"}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Plans List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Existing Plans</h2>
          
          {plans.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No subscription plans found. Create one above.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Plan
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Max Works
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Max Requests
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan.planId} className="border-t">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-800">{plan.name}</div>
                        <div className="text-xs text-gray-500">{plan.planId}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {plan.description || "-"}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-800">
                        ₹{plan.amount}/month
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {plan.maxWorks || "Unlimited"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {plan.maxWorkRequests || "Unlimited"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            plan.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {plan.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => togglePlanStatus(plan.planId, plan.isActive)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {plan.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}