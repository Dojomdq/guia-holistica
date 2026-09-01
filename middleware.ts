import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/admin/login" || pathname === "/") {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_auth")?.value;

  if (!token) {
    if (pathname.startsWith("/admin")) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return new NextResponse(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload = await verifyJWT(token, JWT_SECRET);

  if (!payload) {
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/facilitadores",
    "/api/facilitadores/:path*",
    "/api/actividades",
    "/api/actividades/:path*",
    "/api/categorias",
    "/api/categorias/:path*",
    "/api/destacados",
    "/api/destacados/:path*",
    "/api/eventos",
    "/api/eventos/:path*",
    "/api/pagos",
    "/api/pagos/:path*",
    "/api/comisiones",
    "/api/comisiones/:path*",
    "/api/planes",
    "/api/planes/:path*",
    "/api/facilitador-planes",
    "/api/facilitador-planes/:path*",
    "/api/representantes",
    "/api/representantes/:path*",
    "/api/clicks-admin",
    "/api/clicks-admin/:path*",
  ],
};
