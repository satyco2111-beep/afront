"use client";
import { useRouter } from "next/navigation";

export default function UserLogoutButton() {
  const router = useRouter();
  return (
    <p>
      <button style={{    position: "fixed",right: "10px"}} onClick={() => router.push("/admin/logout")}>
      Logout
    </button>
    </p>
  );
}