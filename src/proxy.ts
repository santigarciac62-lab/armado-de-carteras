import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verificarSesion } from "@/lib/auth";

// En Next.js 16 "Middleware" pasó a llamarse "Proxy" (mismo comportamiento,
// archivo/función renombrados). Ver node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md
export async function proxy(request: NextRequest) {
  const sesion = await verificarSesion(request.cookies.get(COOKIE_NAME)?.value);
  if (sesion) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!login|api/login|api/logout|_next/static|_next/image|favicon.ico|favicon.svg|.*\\.svg$).*)",
  ],
};
