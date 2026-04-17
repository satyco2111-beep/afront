"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuperAdminLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await fetch("/api/superadmin-logout", { method: "POST" });
      } finally {
        router.replace("/superadmin/login");
      }
    })();
  }, [router]);

  return (
    <div className="flex justify-center mt-24">
      <h2 className="text-lg text-gray-700">Logging out…</h2>
    </div>
  );
}
