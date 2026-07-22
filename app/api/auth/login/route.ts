import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const user = process.env.ADMIN_USER || "admin";
  const pass = process.env.ADMIN_PASS || "guia2026";

  if (username === user && password === pass) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
}
