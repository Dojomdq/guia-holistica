import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

const SESSION_COOKIE = "admin_session";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/logout") {
    const response = new NextResponse(null, {
      status: 302,
      headers: { Location: "/admin/login" },
    });
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const user = process.env.ADMIN_USER || "admin";
  const pass = process.env.ADMIN_PASS || "guia2026";

  const sessionCookie = request.cookies.get(SESSION_COOKIE);
  if (sessionCookie?.value === "authenticated") {
    return NextResponse.next();
  }

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

  return NextResponse.redirect(new URL("/admin/login", request.url));
}
