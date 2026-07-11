import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: "/admin/:path*",
};

export function middleware(request: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;

  if (!user || !pass) {
    return new NextResponse("Admin no configurado", { status: 500 });
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

  return new NextResponse("Autenticación requerida", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin"',
    },
  });
}
