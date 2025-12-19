"use client";
import { useRouter } from "next/navigation";

export default function UserLogoutButton() {
  const router = useRouter();
  return (
    <p><button onClick={() => router.push("/admin/logout")}>
      Logout u
    </button></p>
  );
}