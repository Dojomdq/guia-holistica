import { NextResponse } from "next/server";
import { sign, verify } from "jose";

type LoginBody = {
  user: string;
  pass: string;
};

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "guia2026";
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-must-change";

export async function POST(request: Request) {
  try {
    const body: LoginBody = await request.json();

    if (body.user !== ADMIN_USER || body.pass !== ADMIN_PASS) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Firme un JWT con expiración de 24 horas
    const token = await new JWT({
      payload: { sub: ADMIN_USER },
      header: { alg: "HS256" },
    }).sign(new TextEncoder().encode(JWT_SECRET));

    // Setear cookie httpOnly, solo lectura por JS
    const resp = NextResponse.json({ success: true, user: ADMIN_USER });
    resp.cookies.set("admin_auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24, // 24 horas
    });

    return resp;
  } catch {
    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}