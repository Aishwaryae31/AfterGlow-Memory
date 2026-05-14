import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  AUTH_ACCESS_COOKIE,
  AUTH_REFRESH_COOKIE,
  clearAuthCookies,
  setAuthCookies,
} from "@/lib/auth/auth-cookies";
import { getApiBase } from "@/lib/server/api-base";

async function refreshSession(refreshToken: string) {
  const res = await fetch(`${getApiBase()}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: refreshToken }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as {
    accessToken?: string;
    refreshToken?: string;
  };
}

async function upstreamOnce(
  accessToken: string,
  pathWithQuery: string,
  init: RequestInit,
) {
  const headers = new Headers(init.headers ?? undefined);
  headers.set("Authorization", `Bearer ${accessToken}`);
  return fetch(`${getApiBase()}${pathWithQuery}`, {
    ...init,
    headers,
    cache: "no-store",
  });
}

async function toNextResponse(upstream: Response): Promise<NextResponse> {
  const buf = await upstream.arrayBuffer();
  const res = new NextResponse(buf, { status: upstream.status });
  const ct = upstream.headers.get("content-type");
  if (ct) res.headers.set("content-type", ct);
  return res;
}

async function respondWithRefresh(
  tokens: { accessToken: string; refreshToken: string },
  pathWithQuery: string,
  init: RequestInit,
) {
  const upstream = await upstreamOnce(tokens.accessToken, pathWithQuery, init);
  const out = await toNextResponse(upstream);
  setAuthCookies(out, tokens);
  return out;
}

/**
 * Forwards an authenticated request to Express, refreshing cookies when needed.
 * `pathWithQuery` must start with `/api/...`.
 */
export async function proxyAuthedRequest(
  pathWithQuery: string,
  init: RequestInit = {},
): Promise<NextResponse> {
  const jar = await cookies();
  const access = jar.get(AUTH_ACCESS_COOKIE)?.value ?? "";
  const refresh = jar.get(AUTH_REFRESH_COOKIE)?.value;

  if (!access && refresh) {
    const tokens = await refreshSession(refresh);
    if (!tokens?.accessToken || !tokens.refreshToken) {
      const r = NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      clearAuthCookies(r);
      return r;
    }
    return respondWithRefresh(
      {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      pathWithQuery,
      init,
    );
  }

  if (!access) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const upstream = await upstreamOnce(access, pathWithQuery, init);
  if (upstream.status === 401 && refresh) {
    const tokens = await refreshSession(refresh);
    if (tokens?.accessToken && tokens.refreshToken) {
      return respondWithRefresh(
        {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        pathWithQuery,
        init,
      );
    }
    const r = NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    clearAuthCookies(r);
    return r;
  }

  return toNextResponse(upstream);
}
