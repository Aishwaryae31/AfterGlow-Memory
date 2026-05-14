import { NextResponse } from "next/server";
import { z } from "zod";

import {
  clearAuthCookies,
  setAuthCookies,
} from "@/lib/auth/auth-cookies";
import { getApiBase } from "@/lib/server/api-base";

const bodySchema = z.object({
  refreshToken: z.string().min(10),
});

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Missing refresh token." }, { status: 400 });
  }

  const upstream = await fetch(`${getApiBase()}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  const data = (await upstream.json()) as {
    user?: unknown;
    accessToken?: string;
    refreshToken?: string;
    message?: string;
  };

  if (!upstream.ok) {
    const res = NextResponse.json(data, { status: upstream.status });
    clearAuthCookies(res);
    return res;
  }

  if (!data.accessToken || !data.refreshToken) {
    const res = NextResponse.json(
      { message: "Unexpected auth response." },
      { status: 502 },
    );
    clearAuthCookies(res);
    return res;
  }

  const res = NextResponse.json({ user: data.user });
  setAuthCookies(res, {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
  return res;
}
