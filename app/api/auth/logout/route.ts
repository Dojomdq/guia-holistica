import { NextResponse } from "next/server";

export async function GET() {
  const resp = NextResponse.json({ success: true });
  resp.cookies.set("admin_auth", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  });
  return resp;
}