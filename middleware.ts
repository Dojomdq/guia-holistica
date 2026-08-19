import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE = "admin_auth";
const JWT_SECRET = process.env.JWT_SECRET || "";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rutas públicas que no requieren auth
  if (
    pathname === "/admin/login" ||
    pathname === "/admin/register" ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Verificar JWT de la cookie
  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (!token) {
    if (pathname.startsWith("/admin")) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Para rutas API protegidas (además de las que ya tiene matcher)
    return new NextResponse(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Verificar y decodificar el JWT
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));

    // Opcional: verificar roles/permisos aquí si es necesario
    // Si el payload tiene datos adicionales, úsalos

    return NextResponse.next();
  } catch {
    // Token inválido, expirado o firmado con clave distinta
    if (pathname.startsWith("/admin")) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return new NextResponse(JSON.stringify({ error: "Token inválido" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    // Proteger todas las APIs admin, pero EXCLUIR login/logout y routes públicas
    "/api/pagos",
    "/api/pagos/:path*",
    "/api/comisiones",
    "/api/comisiones/:path*",
    "/api/facilitadores",
    "/api/facilitadores/:path*",
    "/api/planes",
    "/api/planes/:path*",
    "/api/facilitador-planes",
    "/api/facilitador-planes/:path*",
    "/api/representantes",
    "/api/representantes/:path*",
    "/api/comisiones",
    "/api/comisiones/:path*",
    "/api/clicks-admin",
    "/api/clicks-admin/:path*",
    "/api/destacados",
    "/api/destacados/:path*",
    "/api/actividades",
    "/api/actividades/:path*",
    "/api/categorias",
    "/api/categorias/:path*",
  ],
};