import type { NextResponse } from "next/server";

export const AUTH_ACCESS_COOKIE = "afterglow_at";
export const AUTH_REFRESH_COOKIE = "afterglow_rt";

const secure = process.env.NODE_ENV === "production";

export function setAuthCookies(
  res: NextResponse,
  tokens: { accessToken: string; refreshToken: string },
) {
  res.cookies.set(AUTH_ACCESS_COOKIE, tokens.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 15,
  });
  res.cookies.set(AUTH_REFRESH_COOKIE, tokens.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookies(res: NextResponse) {
  res.cookies.set(AUTH_ACCESS_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 0,
  });
  res.cookies.set(AUTH_REFRESH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 0,
  });
}
