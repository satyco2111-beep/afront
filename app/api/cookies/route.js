import { NextResponse } from "next/server";

export async function GET(request) {
  const token = request.cookies.get("token")?.value || null;
  const id = request.cookies.get("id")?.value || null;
  const role = request.cookies.get("role")?.value || null;
  const sa_token = request.cookies.get("sa_token")?.value || null;
  const sa_id = request.cookies.get("sa_id")?.value || null;

  return NextResponse.json({ token, role, id, sa_token, sa_id });
}
