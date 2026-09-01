import { NextResponse } from "next/server";
import { signJWT } from "@/lib/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "dev-fallback-secret-change-in-production";
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "guia2026";

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || !body.user || !body.pass) {
    return NextResponse.json({ error: "Faltan usuario o contraseña" }, { status: 400 });
  }

  if (body.user !== ADMIN_USER || body.pass !== ADMIN_PASS) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  try {
    const token = await signJWT({ sub: ADMIN_USER }, JWT_SECRET);

    const resp = NextResponse.json({ success: true, user: ADMIN_USER });
    resp.cookies.set("admin_auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return resp;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
