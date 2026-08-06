import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE = "admin_auth";

function checkAuth(request: NextRequest): string | null {
  return request.cookies.get(AUTH_COOKIE)?.value || null;
}

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const token = checkAuth(request);

  if (token) {
    try {
      const decoded = atob(token);
      const [u, p] = decoded.split(":");
      if (u === process.env.ADMIN_USER && p === process.env.ADMIN_PASS) {
        return NextResponse.next();
      }
    } catch {}
  }

  if (pathname.startsWith("/admin")) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return new NextResponse("No autorizado", { status: 401 });
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/:path*"],
};
