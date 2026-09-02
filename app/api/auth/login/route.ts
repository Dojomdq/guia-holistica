import { NextResponse } from "next/server";
import { signJWT } from "@/lib/jwt";
import { rateLimited, rateLimitInfo } from "@/lib/rate-limit";
import { verifyPassword } from "@/lib/password";
import { getAdminClient } from "@/lib/supabase/admin";

const JWT_SECRET = process.env.JWT_SECRET || "dev-fallback-secret-change-in-production";
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "guia2026";

async function checkCredentials(user: string, pass: string): Promise<boolean> {
  if (user !== ADMIN_USER) return false;

  // 1) Si hay una contraseña dinámica almacenada en la BD, es la que vale.
  try {
    const supabase = getAdminClient();
    const { data: stored, error } = await supabase
      .from("admin_credentials")
      .select("password_hash")
      .limit(1)
      .maybeSingle();

    if (!error && stored?.password_hash) {
      const ok = await verifyPassword(pass, stored.password_hash as string);
      if (ok) return true;
      // Contraseña dinámica configurada pero no coincide: no caer al fallback
      return false;
    }
  } catch {
    // tabla ausente o error: seguimos con el fallback
  }

  // 2) Sin credencial dinámica (o tabla ausente) → usar la del ambiente (ADMIN_PASS).
  return pass === ADMIN_PASS;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    const { retryAfter } = rateLimitInfo(ip);
    return NextResponse.json(
      { error: "Demasiados intentos. Esperá y volvé a intentar." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || !body.user || !body.pass) {
    return NextResponse.json({ error: "Faltan usuario o contraseña" }, { status: 400 });
  }
  if (typeof body.user !== "string" || typeof body.pass !== "string") {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const ok = await checkCredentials(body.user, body.pass);
  if (!ok) {
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
