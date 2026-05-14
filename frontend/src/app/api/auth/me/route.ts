import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  AUTH_ACCESS_COOKIE,
  AUTH_REFRESH_COOKIE,
  clearAuthCookies,
  setAuthCookies,
} from "@/lib/auth/auth-cookies";
import { getApiBase } from "@/lib/server/api-base";

async function fetchMe(accessToken: string) {
  return fetch(`${getApiBase()}/api/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
}

export async function GET() {
  const jar = await cookies();
  let access = jar.get(AUTH_ACCESS_COOKIE)?.value;
  const refresh = jar.get(AUTH_REFRESH_COOKIE)?.value;

  async function tryRefresh(): Promise<{ access: string; refresh: string } | null> {
    if (!refresh) return null;
    const upstream = await fetch(`${getApiBase()}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refresh }),
      cache: "no-store",
    });
    if (!upstream.ok) return null;
    const data = (await upstream.json()) as {
      accessToken?: string;
      refreshToken?: string;
    };
    if (!data.accessToken || !data.refreshToken) return null;
    return { access: data.accessToken, refresh: data.refreshToken };
  }

  if (!access && refresh) {
    const tokens = await tryRefresh();
    if (!tokens) {
      const res = NextResponse.json({ user: null });
      clearAuthCookies(res);
      return res;
    }
    access = tokens.access;
    const me = await fetchMe(access);
    if (!me.ok) {
      const res = NextResponse.json({ user: null });
      clearAuthCookies(res);
      return res;
    }
    const { user } = (await me.json()) as { user: unknown };
    const res = NextResponse.json({ user });
    setAuthCookies(res, {
      accessToken: tokens.access,
      refreshToken: tokens.refresh,
    });
    return res;
  }

  if (!access) {
    return NextResponse.json({ user: null });
  }

  let me = await fetchMe(access);
  if (me.status === 401 && refresh) {
    const tokens = await tryRefresh();
    if (tokens) {
      access = tokens.access;
      me = await fetchMe(access);
      if (me.ok) {
        const { user } = (await me.json()) as { user: unknown };
        const res = NextResponse.json({ user });
        setAuthCookies(res, {
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
        });
        return res;
      }
    }
    const res = NextResponse.json({ user: null });
    clearAuthCookies(res);
    return res;
  }

  if (!me.ok) {
    const res = NextResponse.json({ user: null });
    clearAuthCookies(res);
    return res;
  }

  const { user } = (await me.json()) as { user: unknown };
  return NextResponse.json({ user });
}
