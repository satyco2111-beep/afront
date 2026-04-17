import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEN_BASE_URL}/api/superadmin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ message: data.message || "Login failed" }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("sa_token", data.token, { httpOnly: true });
  res.cookies.set("sa_id", data.admin.sadmid, { httpOnly: true });
  return res;
}

