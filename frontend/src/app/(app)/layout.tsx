import Link from "next/link";
import { Sparkles } from "lucide-react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-dvh">
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 border-b border-[color:var(--glass-border)]",
          "bg-[var(--glass-bg)]/80 backdrop-blur-[var(--glass-blur)]",
        )}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 font-display text-base font-semibold tracking-tight text-foreground"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--glass-border)] bg-white/40 shadow-glass dark:bg-white/5">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
            </span>
            <span className="bg-gradient-to-r from-blush-500 via-primary to-blush-700 bg-clip-text text-transparent">
              Afterglow Studio
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link href="/">Home</Link>
            </Button>
            <SignOutButton />
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
