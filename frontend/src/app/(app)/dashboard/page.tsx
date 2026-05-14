import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardExperience } from "@/components/dashboard/dashboard-experience";

export const metadata: Metadata = {
  title: "Studio",
  description: "Your softly glowing archive.",
};

type PublicUser = {
  id: string;
  email: string;
  name: string;
  picture: string;
};

async function loadUser(): Promise<PublicUser | null> {
  const h = await headers();
  const host = h.get("host");
  if (!host) return null;
  const proto = h.get("x-forwarded-proto") ?? "http";
  const cookie = h.get("cookie") ?? "";

  const res = await fetch(`${proto}://${host}/api/auth/me`, {
    headers: { cookie },
    cache: "no-store",
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { user: PublicUser | null };
  return data.user;
}

export default async function DashboardPage() {
  const user = await loadUser();
  if (!user) {
    redirect("/login?next=/dashboard");
  }

  return <DashboardExperience user={user} />;
}
