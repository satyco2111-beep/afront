"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SuperAdminHeader() {
  const pathname = usePathname();
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/cookies");
      const d = await res.json();
      if (!cancelled) setHasSession(!!d?.sa_token);
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (pathname === "/superadmin/login" || pathname === "/superadmin/logout") {
    return null;
  }

  if (!hasSession) {
    return null;
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b bg-gray-50 px-4 py-3">
      <Link href="/superadmin/dashboard" className="font-semibold text-gray-900">
        Super Admin
      </Link>
      <nav className="flex flex-wrap items-center gap-4 text-sm">
        <Link href="/superadmin/dashboard" className="text-blue-600 underline">
          Dashboard
        </Link>
        <Link href="/superadmin/withdrawals" className="text-blue-600 underline">
          Withdrawals
        </Link>
        <Link href="/superadmin/logout" className="font-semibold text-red-600 hover:text-red-700">
          Logout
        </Link>
      </nav>
    </header>
  );
}
