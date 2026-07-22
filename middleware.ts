import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/logout") {
    return new NextResponse("Sesión cerrada", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin", charset="UTF-8"',
      },
    });
  }

  const user = process.env.ADMIN_USER || "admin";
  const pass = process.env.ADMIN_PASS || "guia2026";

  const authHeader = request.headers.get("authorization");

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = atob(encoded);
      const [u, p] = decoded.split(":");
      if (u === user && p === pass) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Autenticación requerida", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin"',
    },
  });
}
