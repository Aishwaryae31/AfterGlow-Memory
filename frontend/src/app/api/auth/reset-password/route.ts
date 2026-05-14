import { NextResponse } from "next/server";
import { resetPasswordSchema } from "@afterglow/shared";

import { getApiBase } from "@/lib/server/api-base";

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Validation failed.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const upstream = await fetch(`${getApiBase()}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  const data: unknown = await upstream.json();
  return NextResponse.json(data, { status: upstream.status });
}
