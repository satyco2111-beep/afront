"use client";
import { useRouter } from "next/navigation";

export default function ProviderLogoutButton() {
  const router = useRouter();
  return (
    <p><button onClick={() => router.push("/admin/logout-provider")}>
      Logout p
    </button></p>
  );
}