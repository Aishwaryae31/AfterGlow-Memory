import { NextResponse } from "next/server";
import { loginSchema } from "@afterglow/shared";

import { setAuthCookies } from "@/lib/auth/auth-cookies";
import { getApiBase } from "@/lib/server/api-base";

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const upstream = await fetch(`${getApiBase()}/api/auth/login`, {
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
    return NextResponse.json(data, { status: upstream.status });
  }

  if (!data.accessToken || !data.refreshToken) {
    return NextResponse.json(
      { message: "Unexpected auth response." },
      { status: 502 },
    );
  }

  const res = NextResponse.json({ user: data.user });
  setAuthCookies(res, {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
  return res;
}
