import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose/jwt/verify";

import { AUTH_ACCESS_COOKIE } from "@/lib/auth/auth-cookies";

const protectedPrefixes = ["/dashboard"];

const authGateRoutes = ["/login", "/signup"];

function getSecret() {
  const s = process.env.JWT_ACCESS_SECRET;
  if (!s) return null;
  return new TextEncoder().encode(s);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = getSecret();
  const access = request.cookies.get(AUTH_ACCESS_COOKIE)?.value;

  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  if (isProtected) {
    if (!secret) {
      return NextResponse.next();
    }
    if (!access) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    try {
      const { payload } = await jwtVerify(access, secret, {
        algorithms: ["HS256"],
      });
      if (payload.token_use !== "access") throw new Error("invalid token use");
      return NextResponse.next();
    } catch {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (authGateRoutes.some((p) => pathname === p) && access && secret) {
    try {
      await jwtVerify(access, secret, { algorithms: ["HS256"] });
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/login", "/signup"],
};
