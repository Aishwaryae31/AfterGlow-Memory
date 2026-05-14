"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();

  async function onSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="rounded-full border-primary/30 bg-white/30 backdrop-blur-md dark:bg-white/5"
      onClick={() => void onSignOut()}
    >
      Sign out
    </Button>
  );
}
