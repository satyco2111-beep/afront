import { NextResponse } from "next/server";

export async function POST(req) {
  const token = req.cookies.get("sa_token")?.value;
  if (token) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/superadmin/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // still clear cookies so the session ends client-side
    }
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("sa_token", "", { httpOnly: true, expires: new Date(0) });
  res.cookies.set("sa_id", "", { httpOnly: true, expires: new Date(0) });
  return res;
}
