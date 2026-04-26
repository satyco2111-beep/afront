"use client";

import Link from "next/link";

export default function SuperAdminIndex() {
  const adminLinks = [
    {
      title: "Add City",
      description: "Add new cities to the system",
      href: "/admin/super-admin/add-city",
      color: "bg-blue-500",
    },
    {
      title: "Add Local Area",
      description: "Add new local areas to cities",
      href: "/admin/super-admin/add-local-aria",
      color: "bg-green-500",
    },
    {
      title: "Add Service",
      description: "Add new service categories",
      href: "/admin/super-admin/add-service",
      color: "bg-purple-500",
    },
    {
      title: "Manage Subscription Plans",
      description: "Create and manage subscription plans",
      href: "/admin/subscription/manage",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Super Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
            >
              <div className={`${link.color} text-white w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                <span className="text-xl font-bold">+</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {link.title}
              </h3>
              <p className="text-gray-600 mt-2">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}